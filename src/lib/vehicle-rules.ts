export interface VehicleRule {
  channel: string;
  format: string;
  outputSchema: string;
  copyLimit: string;
  criticalPreview: string;
  hookIntent: string;
  promptGuide: string;
}

const VEHICLE_RULES: VehicleRule[] = [
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
    format: "Reels",
    outputSchema: "Roteiro por blocos [0-3s], [4-30s], [final]",
    copyLimit: "Fala estimada em 60-90 segundos",
    criticalPreview: "Primeiros 3 segundos",
    hookIntent: "Gerar tensão imediata com pergunta ou afirmação forte",
    promptGuide:
      "Escreva para fala em voz alta, sem jargão, com 1 CTA falado simples no final.",
  },
  {
    channel: "Instagram",
    format: "Story",
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
    format: "Artigo",
    outputSchema: "Título + subtítulo + corpo em seções + CTA final",
    copyLimit: "Meta entre 1000-2000 palavras",
    criticalPreview: "Título + primeira frase",
    hookIntent: "Ponto de vista específico, não tema genérico",
    promptGuide:
      "Corpo com seções e intertítulos curtos, parágrafos de 3-4 linhas e CTA final para comentários/ação.",
  },
  {
    channel: "Email",
    format: "E-mail único",
    outputSchema: "Subject + preheader + corpo + CTA",
    copyLimit: "150-300 palavras conforme objetivo",
    criticalPreview: "Subject + preheader",
    hookIntent: "Relevância imediata para dor específica",
    promptGuide:
      "Escrever como pessoa para pessoa, sem formalismo excessivo, com CTA único de baixo atrito.",
  },
  {
    channel: "Email",
    format: "Sequência",
    outputSchema: "Série numerada de e-mails com objetivo por etapa",
    copyLimit: "Cada e-mail 150-300 palavras",
    criticalPreview: "Subject e início de cada e-mail",
    hookIntent: "Evoluir relação e mover para próxima ação",
    promptGuide:
      "Cada e-mail deve ser independente, com proposta de valor clara e CTA específico por etapa.",
  },
  {
    channel: "WhatsApp",
    format: "Mensagem única",
    outputSchema: "Mensagem curta em até 3 parágrafos",
    copyLimit: "Texto curto, direto e humano",
    criticalPreview: "Primeiras palavras da notificação",
    hookIntent: "Contexto imediato e dor reconhecível",
    promptGuide:
      "Parágrafo 1 contexto, 2 dor+valor, 3 CTA em pergunta simples. Sem tom corporativo.",
  },
  {
    channel: "WhatsApp",
    format: "Sequência",
    outputSchema: "Mensagens numeradas com progressão",
    copyLimit: "Até 2-3 parágrafos por mensagem",
    criticalPreview: "Abertura de cada mensagem",
    hookIntent: "Retomar contexto sem soar insistente",
    promptGuide:
      "Cada mensagem deve ter ângulo novo, CTA direto e tom leve de conversa.",
  },
];

export function getVehicleRule(canal: string, formato: string): VehicleRule | null {
  const normalizedChannel = (canal || "").trim().toLowerCase();
  const normalizedFormat = (formato || "").trim().toLowerCase();
  return (
    VEHICLE_RULES.find(
      (rule) =>
        rule.channel.toLowerCase() === normalizedChannel &&
        rule.format.toLowerCase() === normalizedFormat
    ) ?? null
  );
}

