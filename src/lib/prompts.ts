import { ICPArchetype, BrandParameters } from './types'

export const DEFAULT_SYSTEM_PROMPT = `Você é o Guardião da Marca — um especialista em comunicação de marca com voz consistente, tom adequado ao canal e profundo conhecimento do público-alvo. Seu papel é criar conteúdo que reflita fielmente a identidade visual, verbal e estratégica da marca.

Siga rigorosamente as diretrizes de voz, DNA visual e perfil de persona fornecidos. Mantenha coerência com os valores e posicionamento da marca. Adapte o formato e linguagem ao canal escolhido. Entregue apenas o conteúdo final, sem explicações adicionais.`

export const DEFAULT_USER_TEMPLATE = `Crie um conteúdo para {{canal}} no formato {{formato}}.

PERSONA / PÚBLICO-ALVO:
Nome: {{persona_nome}}
Descrição: {{persona_descricao}}
Dores principais: {{persona_dores}}
Proposta de valor: {{persona_valor}}

VOZ DA MARCA:
Tom: {{voz_tom}}
Personalidade: {{voz_personalidade}}
Linguagem: {{voz_linguagem}}
Arquétipo: {{voz_arquetipo}}
Palavras-chave: {{voz_keywords}}
Palavras proibidas: {{voz_avoid}}

DNA VISUAL (contexto):
Cores principais: {{dna_cores}}
Tipografia: {{dna_tipografia}}
Estilo de imagem: {{dna_estilo_imagem}}

BRIEFING:
Estilo de conteúdo: {{estilo}}
Objetivo: {{objetivo}}
Tema / Assunto: {{tema}}

Entregue o conteúdo pronto para uso, no formato adequado ao canal {{canal}}.`

export function buildPromptFromTemplate(
  template: string,
  vars: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`)
}

export function buildVars(params: {
  canal: string
  formato: string
  estilo: string
  objetivo: string
  tema: string
  persona: ICPArchetype | null
  brandParams: BrandParameters | null
}): Record<string, string> {
  const { canal, formato, estilo, objetivo, tema, persona, brandParams } = params
  return {
    canal,
    formato,
    estilo,
    objetivo,
    tema,
    persona_nome: persona?.name ?? '',
    persona_descricao: persona?.description ?? '',
    persona_dores: (persona?.pain_points ?? []).join(', '),
    persona_valor: (persona?.value_prop ?? []).join(', '),
    voz_tom: brandParams?.tone ?? '',
    voz_personalidade: brandParams?.personality ?? '',
    voz_linguagem: brandParams?.language_style ?? '',
    voz_arquetipo: brandParams?.archetype ?? '',
    voz_keywords: (brandParams?.keywords ?? []).join(', '),
    voz_avoid: (brandParams?.avoid_words ?? []).join(', '),
    dna_cores: [brandParams?.primary_color, brandParams?.secondary_color, brandParams?.accent_color].filter(Boolean).join(', '),
    dna_tipografia: brandParams?.typography ?? '',
    dna_estilo_imagem: brandParams?.image_style ?? '',
  }
}
