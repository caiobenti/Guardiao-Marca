import { NextRequest, NextResponse } from "next/server";
import { buildImagePrompt, buildPromptFromTemplate, buildTemplateVars } from "@/lib/prompts";
import { BrandParameters, ICPArchetype } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { CURRENT_USER_CODE } from "@/lib/config";

interface SlidePromptItem {
  index: number;
  promptImagem: string;
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
        slides?: SlidePromptItem[];
      };

    const hfToken = process.env.HF_TOKEN;
    if (!hfToken) {
      return NextResponse.json({ error: "HF_TOKEN não configurado" }, { status: 500 });
    }

    const { data: iaConfig } = await supabase
      .from("DB4 - ia_config")
      .select("system_prompt_img, user_template_img")
      .eq("user_code", CURRENT_USER_CODE)
      .maybeSingle();

    const generateSingle = async (params: {
      slidePrompt?: string;
      slideIndex?: number;
    }) => {
      const fallbackPrompt = buildImagePrompt({
        canal,
        tema,
        objetivo,
        persona,
        brandParams,
        copyGerada,
        imageDirective: params.slidePrompt || imageDirective,
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
        imageDirective: params.slidePrompt || imageDirective,
      });

      const sysImg = (iaConfig?.system_prompt_img
        ? buildPromptFromTemplate(iaConfig.system_prompt_img, vars)
        : ""
      ).trim();
      const usrImg = (iaConfig?.user_template_img
        ? buildPromptFromTemplate(iaConfig.user_template_img, vars)
        : ""
      ).trim();
      const templatePrompt = [sysImg, usrImg].filter(Boolean).join("\n\n");
      const directive = (params.slidePrompt || imageDirective || "").trim();
      const directiveBlock = directive
        ? `Hidden image direction from text LLM (must guide the scene)${
            params.slideIndex ? ` - Slide ${params.slideIndex}` : ""
          }:\n${directive}`
        : "";
      const finalPrompt = templatePrompt
        ? [directiveBlock, templatePrompt].filter(Boolean).join("\n\n")
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
