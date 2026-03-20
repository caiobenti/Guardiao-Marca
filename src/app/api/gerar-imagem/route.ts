import { NextRequest, NextResponse } from "next/server";
import { buildImagePrompt } from "@/lib/prompts";
import { BrandParameters, ICPArchetype } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { canal, tema, objetivo, persona, brandParams } = body as {
      canal: string;
      tema: string;
      objetivo: string;
      persona: ICPArchetype | null;
      brandParams: Partial<BrandParameters> | null;
    };

    const apiKey = process.env.GOOGLE_AI_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GOOGLE_AI_KEY não configurada" }, { status: 500 });
    }

    const prompt = buildImagePrompt({ canal, tema, objetivo, persona, brandParams });

    // Gemini 2.5 Flash Image — geração nativa de imagem (free tier)
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ["IMAGE"] },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("[api/gerar-imagem] Gemini error:", geminiRes.status, errText);
      let msg = `Status ${geminiRes.status}`;
      try {
        const errJson = JSON.parse(errText);
        msg = errJson?.error?.message ?? msg;
      } catch { /* keep default */ }
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const data = await geminiRes.json();
    const parts = data?.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p: { inlineData?: { mimeType: string; data: string } }) => p.inlineData);

    if (!imagePart?.inlineData) {
      console.error("[api/gerar-imagem] Unexpected response:", JSON.stringify(data));
      return NextResponse.json({ error: "Nenhuma imagem retornada." }, { status: 500 });
    }

    const { mimeType, data: base64 } = imagePart.inlineData;
    const imageUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({ imageUrl });
  } catch (err: unknown) {
    console.error("[api/gerar-imagem] error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
