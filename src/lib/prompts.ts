import { ICPArchetype, BrandParameters } from "./types";

interface PromptParams {
  persona: ICPArchetype | null;
  canal: string;
  formato: string;
  estilo: string;
  objetivo: string;
  tema: string;
  brandParams?: Partial<BrandParameters>;
}

export function buildPrompt(params: PromptParams): string {
  const { persona, canal, formato, estilo, objetivo, tema, brandParams } = params;

  const lines: string[] = [
    `Crie um conteúdo de ${formato} para ${canal}.`,
    ``,
    `## Persona`,
    persona ? `Nome: ${persona.icp_name}` : "Nenhuma persona selecionada.",
    persona?.pain_points?.length ? `Dores: ${persona.pain_points.join(", ")}` : "",
    persona?.value_prop?.length ? `Proposta de valor: ${persona.value_prop.join(", ")}` : "",
    ``,
    `## Configurações`,
    `Estilo: ${estilo}`,
    `Objetivo: ${objetivo}`,
    `Tema: ${tema}`,
    ``,
    `## Voz da Marca`,
    brandParams?.formality_level ? `Formalidade: ${brandParams.formality_level}` : "",
    brandParams?.emotional_tone ? `Tom emocional: ${brandParams.emotional_tone}` : "",
    brandParams?.sentence_length ? `Tamanho de frase: ${brandParams.sentence_length}` : "",
    brandParams?.jargon_level ? `Jargão: ${brandParams.jargon_level}` : "",
    brandParams?.cta_intensity ? `Intensidade CTA: ${brandParams.cta_intensity}` : "",
    brandParams?.brand_keywords ? `Palavras-chave: ${brandParams.brand_keywords}` : "",
  ];

  return lines.filter(l => l !== "").join("\n");
}
