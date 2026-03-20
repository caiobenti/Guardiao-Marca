import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { CURRENT_USER_CODE } from "@/lib/config";
import {
  buildSystemPrompt,
  buildUserPrompt,
  buildPromptFromTemplate,
  buildPromptBlocks,
  buildTemplateVars,
  UserPromptParams,
} from "@/lib/prompts";
import { BrandParameters, ICPArchetype } from "@/lib/types";
import { getVehicleRule } from "@/lib/vehicle-rules";

interface GerarRequest extends UserPromptParams {
  brandParams?: Partial<BrandParameters>;
  personaId?: string;
  icps?: ICPArchetype[];
}

interface SlidePromptItem {
  index: number;
  promptImagem: string;
}

function validatePublicContentQuality(params: {
  content: string;
  formato?: string;
  slidesCount: number;
}): string | null {
  const text = params.content.trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  const isCarousel = /carrossel|sequ[êe]ncia/i.test(params.formato ?? "") || params.slidesCount > 1;
  const minChars = isCarousel ? 180 : 80;
  const minWords = isCarousel ? 28 : 12;

  if (text.length < minChars || words < minWords) {
    return isCarousel
      ? "Formato inválido da LLM de texto: campo 'publico' veio curto para conteúdo em múltiplos slides. Gere um texto mais completo."
      : "Formato inválido da LLM de texto: campo 'publico' veio curto. Gere um texto mais completo.";
  }
  return null;
}

function validateVehicleContract(params: {
  canal: string;
  formato: string;
  content: string;
  slides: SlidePromptItem[];
}): string | null {
  const rule = getVehicleRule(params.canal, params.formato);
  if (!rule) return null;

  if (/carrossel/i.test(params.formato) && params.slides.length < 2) {
    return "Contrato do veículo inválido: carrossel deve retornar ao menos 2 slides com promptImagem.";
  }
  if (/reels/i.test(params.formato) && !/\[0-3s\]|\[4-30s\]|\[final\]/i.test(params.content)) {
    return "Contrato do veículo inválido para Reels: esperado roteiro com blocos [0-3s], [4-30s] e [Final].";
  }
  if (/story/i.test(params.formato) && !/tela\s*1|slide\s*1/i.test(params.content)) {
    return "Contrato do veículo inválido para Story: esperado conteúdo em sequência de telas.";
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body: GerarRequest = await req.json();

    // Resolve persona from icps list if personaId was passed
    const persona: ICPArchetype | null =
      body.persona ??
      (body.icps && body.personaId
        ? (body.icps.find((p) => p.id === body.personaId) ?? null)
        : null);

    // Fetch ia_config from DB4 for model/temperature/tokens + optional custom prompts
    const { data: iaConfig } = await supabase
      .from("DB4 - ia_config")
      .select("*")
      .eq("user_code", CURRENT_USER_CODE)
      .maybeSingle();

    const model       = iaConfig?.model       || "llama-3.3-70b-versatile";
    const temperature = iaConfig?.temperature ?? 0.72;
    const maxTokens   = iaConfig?.max_tokens  ?? 2048;
    const storedPromptBlocksConfig =
      iaConfig?.prompt_blocks_json && typeof iaConfig.prompt_blocks_json === "object"
        ? iaConfig.prompt_blocks_json
        : null;
    const { data: vehicleRule } = await supabase
      .from("DB5 - ia_vehicle_rules")
      .select("output_schema, copy_limit, critical_preview, hook, intent, prompt_guide")
      .eq("user_code", CURRENT_USER_CODE)
      .eq("channel", body.canal)
      .eq("format", body.formato)
      .maybeSingle();

    if (!vehicleRule) {
      return NextResponse.json(
        {
          error: `Regra do Bloco B não encontrada em DB5 para ${body.canal} / ${body.formato}. Configure em setup/parâmetros de IA.`,
        },
        { status: 422 }
      );
    }

    const vehicleRuleKey = `${body.canal}::${body.formato}`;
    const promptBlocksConfig = {
      ...(storedPromptBlocksConfig ?? {}),
      vehicleRules: {
        ...(storedPromptBlocksConfig?.vehicleRules ?? {}),
        [vehicleRuleKey]: {
          outputSchema: vehicleRule.output_schema,
          copyLimit: vehicleRule.copy_limit,
          criticalPreview: vehicleRule.critical_preview,
          hookIntent: vehicleRule.hook,
          promptGuide: [vehicleRule.intent, vehicleRule.prompt_guide]
            .filter(Boolean)
            .join(" | "),
        },
      },
    };

    // Build prompts: use DB4 custom template if saved, otherwise built-in functions
    let systemPrompt: string;
    let userPrompt: string;

    if (iaConfig?.system_prompt_txt || iaConfig?.user_template_txt) {
      const vars = buildTemplateVars({
        canal:       body.canal,
        formato:     body.formato,
        estilo:      body.estilo,
        objetivo:    body.objetivo,
        tema:        body.tema,
        persona,
        brandParams: body.brandParams ?? null,
        briefingLivre: body.briefingLivre,
      });
      systemPrompt = buildPromptFromTemplate(
        iaConfig?.system_prompt_txt || "",
        vars
      );
      userPrompt = buildPromptFromTemplate(
        iaConfig?.user_template_txt || "",
        vars
      );
    } else {
      // fallback: built-in rich prompt functions
      systemPrompt = buildSystemPrompt(body.brandParams);
      userPrompt   = buildUserPrompt({ ...body, persona, promptBlocksConfig });
    }

    if (body.estilo === "Texto e imagem") {
      userPrompt = `${userPrompt}

---
FORMATO DE SAIDA OBRIGATORIO:
Retorne apenas JSON valido (sem markdown) com as chaves:
{
  "publico": "<conteudo final que o usuario vai ver>",
  "slides": [
    {
      "index": 1,
      "promptImagem": "<descricao visual tecnica para IA de imagem, sem texto rasterizado>"
    }
  ]
}
Nao inclua texto fora do JSON.`
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY não configurada no servidor" },
        { status: 500 }
      );
    }

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature,
          max_tokens: maxTokens,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user",   content: userPrompt   },
          ],
        }),
      }
    );

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("[api/gerar] Groq error:", groqRes.status, errText);

      let msg = `Status ${groqRes.status}`;
      try {
        const errJson = JSON.parse(errText);
        msg = errJson?.error?.message ?? errJson?.message ?? msg;
      } catch { /* mantém msg padrão */ }

      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const data = await groqRes.json();
    const finishReason: string | undefined = data.choices?.[0]?.finish_reason;
    const rawContent: string = data.choices?.[0]?.message?.content ?? "";
    const cleanedRaw = rawContent
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    let content = rawContent;
    let slides: SlidePromptItem[] = [];

    if (body.estilo === "Texto e imagem") {
      try {
        const parsed = JSON.parse(cleanedRaw) as {
          publico?: unknown;
          slides?: unknown;
        };
        if (typeof parsed.publico === "string" && parsed.publico.trim()) {
          content = parsed.publico.trim();
        } else {
          return NextResponse.json(
            {
              error:
                "Formato inválido da LLM de texto: campo 'publico' ausente ou vazio no modo Texto e imagem.",
            },
            { status: 422 }
          );
        }
        if (!Array.isArray(parsed.slides) || parsed.slides.length === 0) {
          return NextResponse.json(
            {
              error:
                "Formato inválido da LLM de texto: campo 'slides' ausente ou vazio no modo Texto e imagem.",
            },
            { status: 422 }
          );
        }

        const parsedSlides = parsed.slides
          .map((item): SlidePromptItem | null => {
            if (!item || typeof item !== "object") return null;
            const idxRaw = (item as { index?: unknown }).index;
            const promptRaw = (item as { promptImagem?: unknown }).promptImagem;
            const index =
              typeof idxRaw === "number"
                ? idxRaw
                : typeof idxRaw === "string"
                  ? Number.parseInt(idxRaw, 10)
                  : NaN;
            const promptImagem =
              typeof promptRaw === "string" ? promptRaw.trim() : "";
            if (!Number.isFinite(index) || index < 1 || !promptImagem) return null;
            return { index, promptImagem };
          })
          .filter((s): s is SlidePromptItem => Boolean(s))
          .sort((a, b) => a.index - b.index);

        if (parsedSlides.length === 0) {
          return NextResponse.json(
            {
              error:
                "Formato inválido da LLM de texto: nenhum slide válido com 'index' e 'promptImagem' foi retornado.",
            },
            { status: 422 }
          );
        }
        slides = parsedSlides;
        const qualityError = validatePublicContentQuality({
          content,
          formato: body.formato,
          slidesCount: slides.length,
        });
        if (qualityError) {
          return NextResponse.json({ error: qualityError }, { status: 422 });
        }
        const vehicleError = validateVehicleContract({
          canal: body.canal,
          formato: body.formato,
          content,
          slides,
        });
        if (vehicleError) {
          return NextResponse.json({ error: vehicleError }, { status: 422 });
        }
      } catch {
        return NextResponse.json(
          {
            error:
              "Formato inválido da LLM de texto no modo Texto e imagem. Esperado JSON com 'publico' e 'slides'.",
          },
          { status: 422 }
        );
      }
    }

    const blocks = buildPromptBlocks({ ...body, persona, promptBlocksConfig });
    return NextResponse.json({
      content,
      slides,
      promptDebug: {
        system: systemPrompt,
        user: userPrompt,
        model,
        temperature,
        maxTokens,
        finishReason: finishReason ?? "unknown",
        blocks,
      },
    });
  } catch (err: unknown) {
    console.error("[api/gerar] error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
