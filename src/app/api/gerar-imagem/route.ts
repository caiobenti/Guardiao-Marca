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

    // Imagen 3 via Google AI Studio
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: "1:1",
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("[api/gerar-imagem] Imagen error:", geminiRes.status, errText);
      let msg = `Status ${geminiRes.status}`;
      try {
        const errJson = JSON.parse(errText);
        msg = errJson?.error?.message ?? msg;
      } catch { /* keep default */ }
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const data = await geminiRes.json();
    const prediction = data?.predictions?.[0];

    if (!prediction?.bytesBase64Encoded) {
      console.error("[api/gerar-imagem] Unexpected response:", JSON.stringify(data));
      return NextResponse.json({ error: "Nenhuma imagem retornada pelo Imagen." }, { status: 500 });
    }

    const mimeType = prediction.mimeType ?? "image/png";
    const imageUrl = `data:${mimeType};base64,${prediction.bytesBase64Encoded}`;

    return NextResponse.json({ imageUrl });
  } catch (err: unknown) {
    console.error("[api/gerar-imagem] error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
