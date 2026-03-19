// ─── Guardião da Marca — Sistema de Prompts ────────────────────────────────
//
// Este arquivo é o núcleo do sistema de geração de conteúdo.
// Toda alteração aqui impacta diretamente o output da IA.
//
// Estrutura:
//   buildSystemPrompt(brandParams) → instrui a IA sobre identidade da marca
//   buildUserPrompt(params)        → monta o briefing específico de cada geração
//   CANAL_CONTEXT                  → orientações de formato por canal
//
//   DEFAULT_SYSTEM_PROMPT / DEFAULT_USER_TEMPLATE
//     → texto padrão mostrado no editor de /parametro-ia.
//     → Se o usuário salvar um template customizado no DB4, ele substitui
//       as funções acima no momento da geração (via buildPromptFromTemplate).
// ───────────────────────────────────────────────────────────────────────────

import { ICPArchetype, BrandParameters } from "./types";

// ─── Defaults editáveis via /parametro-ia ──────────────────────────────────
// Estes textos são o ponto de partida do editor. O usuário pode modificá-los
// livremente e salvar no banco — sem precisar alterar código.

export const DEFAULT_SYSTEM_PROMPT = `Você é o Guardião da Marca — um especialista em comunicação estratégica e copywriting responsável por criar conteúdos que refletem com precisão a identidade, a voz e os valores da marca.

Seu papel é entregar conteúdos prontos para publicação, sem introduções desnecessárias, sem explicações sobre o que fez, e sem metadados. Apenas o conteúdo.

VOZ DA MARCA:
- Tom: {{voz_tom}}
- Personalidade: {{voz_personalidade}}
- Linguagem: {{voz_linguagem}}
- Arquétipo: {{voz_arquetipo}}
- Palavras-chave: {{voz_keywords}}
- Palavras proibidas: {{voz_avoid}}

DNA VISUAL (contexto):
- Cores principais: {{dna_cores}}
- Tipografia: {{dna_tipografia}}
- Estilo de imagem: {{dna_estilo_imagem}}

REGRAS ABSOLUTAS:
- Nunca use clichês ou frases genéricas ("No mundo de hoje...", "Em um mercado competitivo...").
- Respeite rigorosamente as regras de formato do canal informado no briefing.
- Se houver persona definida, escreva diretamente para ela.
- Entregue o conteúdo completo. Nunca trunque com "...".`

export const DEFAULT_USER_TEMPLATE = `## Briefing de conteúdo

**Canal:** {{canal}}
**Formato:** {{formato}}
**Estilo de mídia:** {{estilo}}

## Persona-alvo
Nome: {{persona_nome}}
Principais dores: {{persona_dores}}
O que mais valoriza: {{persona_valor}}

## Objetivo da mensagem
{{objetivo}}

## Tema / Assunto
{{tema}}

---
Crie o conteúdo agora. Entregue direto, sem preâmbulos.`

// ─── Template engine ───────────────────────────────────────────────────────
// Substitui {{variavel}} pelo valor correspondente no objeto vars.
// Variáveis não encontradas ficam como {{variavel}} — visível para debug.

export function buildPromptFromTemplate(
  template: string,
  vars: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`)
}

// ─── Mapa de variáveis a partir dos dados do formulário e da marca ─────────

export function buildTemplateVars(params: {
  canal: string
  formato: string
  estilo: string
  objetivo: string
  tema: string
  persona: ICPArchetype | null
  brandParams: Partial<BrandParameters> | null
}): Record<string, string> {
  const { canal, formato, estilo, objetivo, tema, persona, brandParams } = params
  return {
    canal,
    formato,
    estilo,
    objetivo,
    tema,
    persona_nome: persona?.icp_name ?? '',
    persona_dores: (persona?.pain_points ?? []).join(', '),
    persona_valor: (persona?.value_prop ?? []).join(', '),
    voz_tom: brandParams?.emotional_tone ?? '',
    voz_personalidade: '',
    voz_linguagem: brandParams?.formality_level ?? '',
    voz_arquetipo: '',
    voz_keywords: brandParams?.brand_keywords ?? '',
    voz_avoid: '',
    dna_cores: (brandParams?.color_palette ?? []).join(', '),
    dna_tipografia: brandParams?.typography ?? '',
    dna_estilo_imagem: brandParams?.image_style ?? '',
  }
}

// ─── Contexto por canal ────────────────────────────────────────────────────
// Define as regras de formato, tamanho e estilo de cada plataforma.
// A IA usa isso para adaptar estrutura e linguagem — não só o conteúdo.

const CANAL_CONTEXT: Record<string, string> = {
  Instagram: `
Canal visual e dinâmico. Regras:
- Primeira linha funciona como gancho — deve parar o scroll.
- Parágrafos de 1-2 linhas com espaço entre eles.
- Use emojis somente se o tom da marca permitir (veja Formalidade).
- Para Post: máximo 2200 caracteres, CTA claro no final.
- Para Carrossel: entregue os slides numerados. Slide 1 = capa com gancho, slides intermediários = desenvolvimento, último = CTA.
- Para Story: linguagem direta, máximo 3 telas de texto, inclua sugestão de enquete ou pergunta interativa.
- Para Reels: entregue o roteiro narrado (falas ou texto em tela), cena a cena, máximo 60 segundos de conteúdo.
`.trim(),

  LinkedIn: `
Canal profissional com alta tolerância a conteúdo longo e reflexivo. Regras:
- Primeira linha deve apresentar dado, insight ou afirmação controversa — não introduções genéricas.
- Espaçamento entre blocos para facilitar leitura em desktop e mobile.
- Tom pode ser assertivo, reflexivo e técnico.
- Para Post: ideal entre 800-1500 caracteres. CTA que convide à interação (comentários, compartilhamento).
- Para Artigo: entregue com título, subtítulo, introdução, desenvolvimento em seções e conclusão.
- Para Carrossel: mesmo padrão do Instagram — slides numerados, capa com gancho, CTA no final.
`.trim(),

  Email: `
Canal com maior liberdade criativa e estrutura formal. Regras:
- Sempre inclua sugestão de linha de assunto (Subject) no início, entre colchetes: [Assunto: ...].
- Estrutura padrão: saudação → abertura engajante → corpo → CTA → assinatura.
- Linguagem pode ser mais longa e elaborada, mas parágrafos curtos.
- Para Sequência: entregue cada e-mail separado, com número, objetivo daquele e-mail e intervalo sugerido (ex: "E-mail 2 — enviar 3 dias após o 1").
- CTA deve ser único e claro em cada e-mail.
`.trim(),

  WhatsApp: `
Canal direto, pessoal e de alta intimidade. Regras:
- Frases curtas. Máximo 3 linhas por bloco antes de quebrar.
- Use *negrito* para destaques (formato nativo do WhatsApp).
- Evite linguagem corporativa — soe humano e próximo.
- Para Mensagem única: direto ao ponto, CTA claro e um link ou instrução de ação.
- Para Sequência: entregue cada mensagem separada com número e intervalo sugerido. Cada mensagem deve funcionar de forma independente.
`.trim(),
};

// ─── Prompt de sistema ─────────────────────────────────────────────────────
// Define a identidade da IA com base nos parâmetros da marca salvos em /parametros.
// Quanto mais completo o perfil da marca, mais preciso o output.

export function buildSystemPrompt(brandParams?: Partial<BrandParameters>): string {
  const vozLinhas = brandParams
    ? [
        brandParams.formality_level   && `- Formalidade: ${brandParams.formality_level}`,
        brandParams.emotional_tone    && `- Tom emocional: ${brandParams.emotional_tone}`,
        brandParams.sentence_length   && `- Tamanho de frase: ${brandParams.sentence_length}`,
        brandParams.jargon_level      && `- Uso de jargão técnico: ${brandParams.jargon_level}`,
        brandParams.cta_intensity     && `- Intensidade do CTA: ${brandParams.cta_intensity}`,
        brandParams.brand_keywords    && `- Palavras-chave da marca: ${brandParams.brand_keywords}`,
      ].filter(Boolean)
    : [];

  const dnaLinhas = brandParams
    ? [
        brandParams.typography        && `- Tipografia preferida: ${brandParams.typography}`,
        brandParams.image_style       && `- Estilo de imagem: ${brandParams.image_style}`,
        brandParams.color_palette?.length && `- Paleta de cores: ${brandParams.color_palette!.join(", ")}`,
      ].filter(Boolean)
    : [];

  const vozSection = vozLinhas.length
    ? `## Voz da Marca\n${vozLinhas.join("\n")}`
    : "";

  const dnaSection = dnaLinhas.length
    ? `## DNA Visual\n${dnaLinhas.join("\n")}\n(Use como referência ao sugerir elementos visuais ou descrever imagens.)`
    : "";

  return `
Você é o Guardião da Marca — um especialista em comunicação estratégica e copywriting responsável por criar conteúdos que refletem com precisão a identidade, a voz e os valores da marca.

Seu papel é entregar conteúdos prontos para publicação (ou quase prontos), sem introduções desnecessárias, sem explicações sobre o que fez, e sem metadados. Apenas o conteúdo.

${vozSection}

${dnaSection}

## Regras absolutas
- Nunca use clichês ou frases genéricas ("No mundo de hoje...", "Em um mercado competitivo..."). Cada frase deve ser intencional.
- Respeite rigorosamente as regras de formato do canal informado no briefing.
- Se houver persona definida, escreva diretamente para ela — use as dores e a proposta de valor como alavancas narrativas.
- Se o formato pedir múltiplas peças (carrossel, sequência de e-mails, sequência de mensagens), entregue todas completas e numeradas.
- Quando o estilo for "Só texto", não mencione elementos visuais. Quando for "Texto e imagem", sugira brevemente o visual de cada bloco entre colchetes: [Sugestão visual: ...].
- Entregue o conteúdo completo. Nunca trunque com "...".
`.trim();
}

// ─── Prompt de usuário ─────────────────────────────────────────────────────
// Monta o briefing específico de cada geração a partir dos inputs do formulário.

export interface UserPromptParams {
  persona: ICPArchetype | null;
  canal: string;
  formato: string;
  estilo: string;
  objetivo: string;
  tema: string;
}

export function buildUserPrompt(params: UserPromptParams): string {
  const { persona, canal, formato, estilo, objetivo, tema } = params;

  const personaSection = persona
    ? `## Persona-alvo
Nome: ${persona.icp_name ?? "Não definido"}
${persona.pain_points?.length  ? `Principais dores: ${persona.pain_points.join(", ")}` : ""}
${persona.value_prop?.length   ? `O que mais valoriza: ${persona.value_prop.join(", ")}` : ""}`.trim()
    : `## Persona-alvo
Nenhuma persona específica selecionada. Escreva para o público geral da marca.`;

  const canalCtx = CANAL_CONTEXT[canal] ?? "";

  return `
## Briefing de conteúdo

**Canal:** ${canal}
**Formato:** ${formato || "Livre"}
**Estilo de mídia:** ${estilo || "Livre"}

${personaSection}

## Objetivo da mensagem
${objetivo.trim() || "Não especificado. Use seu julgamento com base no tema e na voz da marca."}

## Tema / Assunto
${tema.trim()}

## Regras do canal (${canal})
${canalCtx}

---
Crie o conteúdo agora. Entregue direto, sem preâmbulos.
`.trim();
}

export function buildImagePrompt(params: {
  canal: string
  tema: string
  objetivo: string
  persona: ICPArchetype | null
  brandParams: Partial<BrandParameters> | null
}): string {
  const { canal, tema, objetivo, persona, brandParams } = params
  const parts = [
    `Professional marketing visual for ${canal}.`,
    tema ? `Theme: ${tema}.` : '',
    objetivo ? `Goal: ${objetivo}.` : '',
    persona?.icp_name ? `Target audience: ${persona.icp_name}.` : '',
    brandParams?.image_style ? `Visual style: ${brandParams.image_style}.` : '',
    brandParams?.color_palette?.length
      ? `Brand colors: ${brandParams.color_palette.join(', ')}.`
      : '',
    'Clean, high quality, modern design. No text overlays.',
  ].filter(Boolean)
  return parts.join(' ')
}
