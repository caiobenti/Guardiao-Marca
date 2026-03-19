import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt, buildUserPrompt, UserPromptParams } from "@/lib/prompts";
import { BrandParameters } from "@/lib/types";

interface GerarRequest extends UserPromptParams {
  brandParams?: Partial<BrandParameters>;
}

export async function POST(req: NextRequest) {
  const body: GerarRequest = await req.json();

  const systemPrompt = buildSystemPrompt(body.brandParams);
  const userPrompt   = buildUserPrompt(body);

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userPrompt   },
      ],
      temperature: 0.72,
      max_tokens: 2048,
    }),
  });

  if (!groqRes.ok) {
    const errText = await groqRes.text();
    console.error("[api/gerar] Groq error:", groqRes.status, errText);

    // Tenta extrair mensagem legível do JSON de erro do Groq
    let msg = `Status ${groqRes.status}`;
    try {
      const errJson = JSON.parse(errText);
      msg = errJson?.error?.message ?? errJson?.message ?? msg;
    } catch { /* mantém msg padrão */ }

    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const data = await groqRes.json();
  const content: string = data.choices?.[0]?.message?.content ?? "";

  return NextResponse.json({ content });
}
