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

    // Imagen 4 Fast — 25 req/dia no free tier
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: { sampleCount: 1, aspectRatio: "1:1" },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("[api/gerar-imagem] error:", res.status, errText);
      let msg = `Status ${res.status}`;
      try { msg = JSON.parse(errText)?.error?.message ?? msg; } catch { /* ok */ }
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const data = await res.json();
    const prediction = data?.predictions?.[0];

    if (!prediction?.bytesBase64Encoded) {
      console.error("[api/gerar-imagem] no image in response:", JSON.stringify(data));
      return NextResponse.json({ error: "Nenhuma imagem retornada." }, { status: 500 });
    }

    const mimeType = prediction.mimeType ?? "image/png";
    return NextResponse.json({
      imageUrl: `data:${mimeType};base64,${prediction.bytesBase64Encoded}`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[api/gerar-imagem]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
