export interface VehicleRule {
  channel: string;
  format: string;
  outputSchema: string;
  copyLimit: string;
  criticalPreview: string;
  hookIntent: string;
  promptGuide: string;
}

export const CHANNEL_OPTIONS = ["Instagram", "LinkedIn", "Email", "WhatsApp"] as const;

export const CHANNEL_FORMATS: Record<string, string[]> = {
  Instagram: ["Post", "Carrossel", "Texto para reels", "Stories"],
  LinkedIn: ["Post", "Carrossel", "Artigo longo"],
  Email: ["Prospecção", "Nutrição", "Conversão"],
  WhatsApp: ["Abordagem 1:1", "Follow-up"],
};

export const VEHICLE_RULES: VehicleRule[] = [
  {
    channel: "Instagram",
    format: "Post",
    outputSchema: "Caption + CTA + hashtags",
    copyLimit: "Primeira linha com até 125 chars visíveis no feed",
    criticalPreview: "Primeira linha da caption",
    hookIntent: "Interromper scroll e gerar awareness/engajamento",
    promptGuide:
      "Entregue: 1) Caption com primeira linha autônoma e sem ponto final; 2) CTA para bio; 3) 5-10 hashtags do específico ao amplo.",
  },
  {
    channel: "Instagram",
    format: "Carrossel",
    outputSchema: "Slide 1 (capa) + slides 2..N + caption + hashtags",
    copyLimit: "Max 80 chars por slide; até 10 slides",
    criticalPreview: "Slide 1 é o único preview no feed",
    hookIntent: "Promessa clara de ganho ao passar os slides",
    promptGuide:
      "Entregue: capa com promessa explícita, 1 ideia por slide, último slide com CTA e caption curta do post.",
  },
  {
    channel: "Instagram",
    format: "Texto para reels",
    outputSchema: "Roteiro por blocos [0-3s], [4-30s], [final]",
    copyLimit: "Fala estimada em 60-90 segundos",
    criticalPreview: "Primeiros 3 segundos",
    hookIntent: "Gerar tensão imediata com pergunta ou afirmação forte",
    promptGuide:
      "Escreva para fala em voz alta, sem jargão, com 1 CTA falado simples no final.",
  },
  {
    channel: "Instagram",
    format: "Stories",
    outputSchema: "Sequência de 3-5 telas",
    copyLimit: "1-2 frases por tela",
    criticalPreview: "Primeira tela",
    hookIntent: "Abrir contexto direto sem preâmbulo",
    promptGuide:
      "Tela 1 com pergunta/contexto direto, telas intermediárias com 1 ideia por tela e última tela com CTA de DM/link/salvar.",
  },
  {
    channel: "LinkedIn",
    format: "Post",
    outputSchema: "Hook + corpo + CTA + hashtags opcionais",
    copyLimit: "Até 1300 chars",
    criticalPreview: "3 primeiras linhas antes do 'ver mais'",
    hookIntent: "Afirmação polarizadora ou dado concreto",
    promptGuide:
      "Hook em até 2 linhas, parágrafos de 2-3 linhas com respiro e CTA em pergunta/ação clara.",
  },
  {
    channel: "LinkedIn",
    format: "Carrossel",
    outputSchema: "Capa + slides de insight + slide final CTA + caption",
    copyLimit: "80-100 chars por slide",
    criticalPreview: "Slide 1 (capa) no feed",
    hookIntent: "Prometer aprendizado concreto",
    promptGuide:
      "1 insight por slide, último slide com próximo passo e caption curta de acompanhamento.",
  },
  {
    channel: "LinkedIn",
    format: "Artigo longo",
    outputSchema: "Título + subtítulo + corpo em seções + CTA final",
    copyLimit: "Meta entre 1000-2000 palavras",
    criticalPreview: "Título + primeira frase",
    hookIntent: "Ponto de vista específico, não tema genérico",
    promptGuide:
      "Corpo com seções e intertítulos curtos, parágrafos de 3-4 linhas e CTA final para comentários/ação.",
  },
  {
    channel: "Email",
    format: "Prospecção",
    outputSchema: "Subject + preheader + corpo curto + CTA de baixo compromisso",
    copyLimit: "100-150 words no corpo",
    criticalPreview: "Subject (41 chars) + preheader (85 chars)",
    hookIntent: "Relevância imediata para a dor sem contexto assumido",
    promptGuide:
      "Entregue Subject (max 41), Preheader (max 85), corpo até 150 words e CTA de baixo compromisso.",
  },
  {
    channel: "Email",
    format: "Nutrição",
    outputSchema: "Subject + preheader + corpo com conteúdo de valor + CTA educacional",
    copyLimit: "200-300 words",
    criticalPreview: "Subject + preheader",
    hookIntent: "Promessa de aprendizado ou insight útil",
    promptGuide:
      "Entregue Subject, Preheader, corpo com gancho->valor->transição e CTA educacional.",
  },
  {
    channel: "Email",
    format: "Conversão",
    outputSchema: "Subject + preheader + corpo focado em 1 objeção + CTA direto e único",
    copyLimit: "150-200 words",
    criticalPreview: "Subject + preheader",
    hookIntent: "Referência ao contexto anterior ou urgência",
    promptGuide:
      "Entregue Subject, Preheader, corpo focado em 1 objeção e CTA único sem alternativas.",
  },
  {
    channel: "WhatsApp",
    format: "Abordagem 1:1",
    outputSchema: "Mensagem curta em até 3 parágrafos",
    copyLimit: "Texto curto, direto e humano",
    criticalPreview: "Primeiras palavras da notificação",
    hookIntent: "Contexto imediato e dor reconhecível",
    promptGuide:
      "Parágrafo 1 contexto, 2 dor+valor, 3 CTA em pergunta simples. Sem tom corporativo.",
  },
  {
    channel: "WhatsApp",
    format: "Follow-up",
    outputSchema: "Referência ao contato anterior + nova proposta de valor + CTA direto",
    copyLimit: "Máximo 2 parágrafos",
    criticalPreview: "Primeiras palavras da notificação push",
    hookIntent: "Retomada natural sem ser invasivo",
    promptGuide:
      "Retome contexto sem cobrar, traga novo ângulo e CTA direto em tom leve.",
  },
];

function normalizeText(value: string): string {
  return (value || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();
}

function normalizeFormat(channel: string, format: string): string {
  const ch = normalizeText(channel);
  const fm = normalizeText(format);
  if (ch === "instagram" && (fm === "reels" || fm === "texto para reels")) return "texto para reels";
  if (ch === "instagram" && (fm === "story" || fm === "stories")) return "stories";
  if (ch === "linkedin" && (fm === "artigo" || fm === "artigo longo")) return "artigo longo";
  if (ch === "email" && (fm === "e-mail unico" || fm === "email unico")) return "prospeccao";
  if (ch === "email" && fm === "sequencia") return "nutricao";
  if (ch === "whatsapp" && fm === "mensagem unica") return "abordagem 1:1";
  return fm;
}

export function getVehicleRule(canal: string, formato: string): VehicleRule | null {
  const normalizedChannel = normalizeText(canal);
  const normalizedFormat = normalizeFormat(canal, formato);
  return (
    VEHICLE_RULES.find(
      (rule) =>
        normalizeText(rule.channel) === normalizedChannel &&
        normalizeText(rule.format) === normalizedFormat
    ) ?? null
  );
}

export function getAllVehicleRules(): VehicleRule[] {
  return [...VEHICLE_RULES];
}

