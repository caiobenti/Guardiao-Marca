export type Farol = "verde" | "amarelo" | "vermelho";
export type Tendencia = "subindo" | "estavel" | "caindo";

export type Dimensao = "resultado" | "cadencia" | "pesquisa" | "quebraObjecao" | "rapport";

export const DIMENSOES: { id: Dimensao; label: string }[] = [
  { id: "resultado", label: "Resultado" },
  { id: "cadencia", label: "Cadência" },
  { id: "pesquisa", label: "Pesquisa prévia" },
  { id: "quebraObjecao", label: "Quebra de objeção" },
  { id: "rapport", label: "Rapport" },
];

export const FAIXA_MIN = 85;
export const FAIXA_MAX = 115;

export interface SDR {
  id: string;
  nome: string;
  inicial: string;
  farol: Farol;
  tendencia: Tendencia;
  resumo: string;
  valores: Record<Dimensao, number>;
}

export const SDRS: SDR[] = [
  {
    id: "adriano",
    nome: "Adriano",
    inicial: "A",
    farol: "verde",
    tendencia: "estavel",
    resumo: "Dentro do esperado. Último 1:1 há 3 semanas.",
    valores: { resultado: 102, cadencia: 96, pesquisa: 58, quebraObjecao: 104, rapport: 100 },
  },
  {
    id: "beatriz",
    nome: "Beatriz",
    inicial: "B",
    farol: "verde",
    tendencia: "subindo",
    resumo: "Top performer, seguindo em alta. Nenhuma ação sugerida.",
    valores: { resultado: 128, cadencia: 118, pesquisa: 80, quebraObjecao: 122, rapport: 119 },
  },
  {
    id: "carlos",
    nome: "Carlos",
    inicial: "C",
    farol: "vermelho",
    tendencia: "caindo",
    resumo: "Abaixo do esperado há 2 quinzenas seguidas. Plano sugerido, aguardando sua decisão.",
    valores: { resultado: 98, cadencia: 101, pesquisa: 55, quebraObjecao: 58, rapport: 103 },
  },
  {
    id: "daniela",
    nome: "Daniela",
    inicial: "D",
    farol: "verde",
    tendencia: "estavel",
    resumo: "Dentro do esperado. Próximo 1:1 já agendado para 18/09.",
    valores: { resultado: 104, cadencia: 99, pesquisa: 61, quebraObjecao: 108, rapport: 101 },
  },
  {
    id: "eduarda",
    nome: "Eduarda",
    inicial: "E",
    farol: "verde",
    tendencia: "estavel",
    resumo: "Dentro do esperado. Mas já se passaram 2 meses desde o último 1:1, e nada está marcado.",
    valores: { resultado: 100, cadencia: 97, pesquisa: 64, quebraObjecao: 106, rapport: 98 },
  },
  {
    id: "felipe",
    nome: "Felipe",
    inicial: "F",
    farol: "amarelo",
    tendencia: "subindo",
    resumo:
      "Resultado bem acima da média, mas com sinais de força bruta: duas dimensões de processo abaixo do esperado. Vale um olhar, mesmo com o número tão bom.",
    valores: { resultado: 141, cadencia: 71, pesquisa: 59, quebraObjecao: 100, rapport: 64 },
  },
];

export function statusValor(valor: number): "dentro" | "abaixo" | "acima" {
  if (valor < FAIXA_MIN) return "abaixo";
  if (valor > FAIXA_MAX) return "acima";
  return "dentro";
}

// Valores simulados para o recorte "Acumulado do ciclo" — não é dado real,
// só um jeito de mostrar as bolinhas migrando de posição ao trocar o toggle.
export function valorAcumulado(valorAtual: number): number {
  return Math.round(valorAtual * 0.55 + 100 * 0.45);
}
