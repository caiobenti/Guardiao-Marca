import { NextRequest, NextResponse } from "next/server";
import { buildImagePrompt, buildPromptFromTemplate, buildTemplateVars } from "@/lib/prompts";
import { BrandParameters, ICPArchetype } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { CURRENT_USER_CODE } from "@/lib/config";

interface SlidePromptItem {
  index: number;
  promptImagem: string;
}

function compactTemplatePrompt(templatePrompt: string): string {
  return templatePrompt
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      canal,
      tema,
      objetivo,
      persona,
      brandParams,
      formato,
      estilo,
      copyGerada,
      imageDirective,
      briefingLivre,
      slides,
    } =
      body as {
        canal: string;
        tema: string;
        objetivo: string;
        persona: ICPArchetype | null;
        brandParams: Partial<BrandParameters> | null;
        formato?: string;
        estilo?: string;
        copyGerada?: string;
        imageDirective?: string;
        briefingLivre?: string;
        slides?: SlidePromptItem[];
      };

    const hfToken = process.env.HF_TOKEN;
    if (!hfToken) {
      return NextResponse.json({ error: "HF_TOKEN não configurado" }, { status: 500 });
    }

    const { data: iaConfig } = await supabase
      .from("DB4 - ia_config")
      .select("system_prompt_img, user_template_img, prompt_blocks_json")
      .eq("user_code", CURRENT_USER_CODE)
      .maybeSingle();
    const promptBlocksConfig =
      iaConfig?.prompt_blocks_json && typeof iaConfig.prompt_blocks_json === "object"
        ? iaConfig.prompt_blocks_json
        : null;

    const generateSingle = async (params: {
      slidePrompt?: string;
      slideIndex?: number;
    }) => {
      const primaryDirection = (params.slidePrompt || imageDirective || "").trim();
      const fallbackPrompt = buildImagePrompt({
        canal,
        tema,
        objetivo,
        persona,
        brandParams,
        copyGerada,
        imageDirective: primaryDirection,
        briefingLivre,
        promptBlocksConfig,
      });

      const vars = buildTemplateVars({
        canal,
        formato: formato ?? "",
        estilo: estilo ?? "",
        objetivo,
        tema,
        persona,
        brandParams,
        copyGerada,
        imageDirective: primaryDirection,
        briefingLivre,
      });

      const sysImg = (iaConfig?.system_prompt_img
        ? buildPromptFromTemplate(iaConfig.system_prompt_img, vars)
        : ""
      ).trim();
      const usrImg = (iaConfig?.user_template_img
        ? buildPromptFromTemplate(iaConfig.user_template_img, vars)
        : ""
      ).trim();
      const templatePrompt = compactTemplatePrompt([sysImg, usrImg].filter(Boolean).join("\n\n"));
      const directiveBlock = primaryDirection
        ? `Primary visual direction (highest priority)${
            params.slideIndex ? ` - Slide ${params.slideIndex}` : ""
          }:\n${primaryDirection}`
        : "";
      const alignmentBlock = templatePrompt
        ? "Use template constraints (style/colors/composition) only when they do not conflict with Primary visual direction."
        : "";
      const briefingBlock = briefingLivre?.trim()
        ? `User free briefing (priority over style preferences when conflict):\n${briefingLivre.trim()}`
        : "";
      const briefingFirst =
        promptBlocksConfig?.priority?.briefingLivreFirst !== false;
      const finalPrompt = templatePrompt || directiveBlock
        ? [
            briefingFirst ? briefingBlock : directiveBlock,
            briefingFirst ? directiveBlock : briefingBlock,
            alignmentBlock,
            templatePrompt,
          ]
            .filter(Boolean)
            .join("\n\n")
        : fallbackPrompt;

      const res = await fetch(
        "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${hfToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: finalPrompt }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        console.error("[api/gerar-imagem] HF error:", res.status, errText);
        let msg = `Status ${res.status}`;
        try { msg = JSON.parse(errText)?.error ?? msg; } catch { /* ok */ }
        throw new Error(msg);
      }

      const buffer = await res.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const contentType = res.headers.get("content-type") ?? "image/jpeg";
      return {
        imageUrl: `data:${contentType};base64,${base64}`,
        promptDebug: {
          slideIndex: params.slideIndex ?? null,
          primaryDirection,
          final: finalPrompt,
          system: sysImg,
          user: usrImg,
          fallback: fallbackPrompt,
        },
      };
    };

    if (Array.isArray(slides) && slides.length > 0) {
      const sortedSlides = slides
        .filter((s) => s && Number.isFinite(s.index) && s.promptImagem?.trim())
        .sort((a, b) => a.index - b.index);

      const generated = [];
      for (const slide of sortedSlides) {
        const one = await generateSingle({
          slidePrompt: slide.promptImagem,
          slideIndex: slide.index,
        });
        generated.push({
          index: slide.index,
          imageUrl: one.imageUrl,
          promptDebug: one.promptDebug,
        });
      }
      return NextResponse.json({
        images: generated,
        imageUrls: generated.map((g) => g.imageUrl),
        promptDebugBySlide: generated.map((g) => ({
          index: g.index,
          final: g.promptDebug.final,
          primaryDirection: g.promptDebug.primaryDirection,
        })),
        promptDebug: { final: generated.map((g) => g.promptDebug.final).join("\n\n---\n\n") },
      });
    }

    const single = await generateSingle({});
    return NextResponse.json(single);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[api/gerar-imagem]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
