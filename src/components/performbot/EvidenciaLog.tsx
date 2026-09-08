"use client";

import { useState } from "react";
import { STATUS_COLOR } from "./theme";

const TRANSCRICAO_NAO_QUEBROU = `Prospect: Não tenho interesse, já uso outra ferramenta.

Carlos: Entendo, mas nossa solução tem diferenciais bem
interessantes, posso te mostrar rapidinho?

Prospect: Não, obrigado, não é prioridade agora.

Carlos: Sem problema, mas será que vale 5 minutinhos só pra eu te
explicar os cases que temos com empresas parecidas com a sua?

Prospect: Sinceramente, não tenho tempo agora.

Carlos: Entendo. Posso te ligar de novo semana que vem então?

Prospect: Pode ser, mas não prometo nada.

(objeção não é quebrada — Carlos repete a mesma abordagem em todas
as tentativas, sem investigar a causa real da recusa nem ajustar o
discurso; a ligação termina sem próximo passo confirmado)`;

const TRANSCRICAO_QUEBROU = `Secretária: A diretora não costuma atender contato direto, ela pede
pra passar por e-mail.

Carlos: Entendo, e prefiro respeitar isso mesmo. Só pra eu mandar
algo que faça sentido: hoje, como funciona o controle de repasse de
material entre as professoras? Pergunto porque costuma dar dor de
cabeça em fim de bimestre.

Secretária: Ah, isso aqui é uma bagunça, viu. Mas mesmo assim ela
não costuma abrir agenda assim do nada.

Carlos: Sem problema, não precisa ser hoje. Consigo 15 minutos com
ela numa quinta de manhã, só pra mostrar como outras escolas da
região resolveram isso.

Secretária: Deixa eu ver a agenda aqui... quinta às 9h ela tem uma
janela, posso tentar encaixar.

Carlos: Perfeito, pode marcar quinta às 9h. Muito obrigado!

(reunião marcada na 3ª tentativa — depois de reconhecer que a
objeção real era agenda cheia, não falta de interesse, e oferecer
um recorte de tempo menor ancorado num problema concreto da escola)`;

export const LIGACOES: {
  data: string;
  tentativas: number;
  quebrou: boolean;
  transcricao?: string;
}[] = [
  { data: "18/08", tentativas: 2, quebrou: false },
  { data: "19/08", tentativas: 4, quebrou: false, transcricao: TRANSCRICAO_NAO_QUEBROU },
  { data: "21/08", tentativas: 2, quebrou: true },
  { data: "25/08", tentativas: 3, quebrou: false },
  { data: "26/08", tentativas: 1, quebrou: false },
  { data: "28/08", tentativas: 3, quebrou: false },
  { data: "29/08", tentativas: 5, quebrou: false },
  { data: "01/09", tentativas: 3, quebrou: true },
  { data: "02/09", tentativas: 2, quebrou: false },
  { data: "03/09", tentativas: 3, quebrou: true, transcricao: TRANSCRICAO_QUEBROU },
];

export const REFERENCIA_TIME_QUEBRADAS = 7;

export function contarQuebradas() {
  return LIGACOES.filter((l) => l.quebrou).length;
}

export function EvidenciaLogTable() {
  const [transcricaoAbertaData, setTranscricaoAbertaData] = useState<string | null>(null);
  const ligacaoAberta = LIGACOES.find((l) => l.data === transcricaoAbertaData);

  return (
    <>
      <table className="w-full text-left text-sm">
        <thead className="text-xs text-[#6b6a63]">
          <tr className="border-b border-[#e2e0da]">
            <th className="w-24 py-2 font-normal">Data</th>
            <th className="w-32 py-2 font-normal">Tentativas</th>
            <th className="py-2 font-normal">Resultado</th>
            <th className="py-2 font-normal"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e2e0da]">
          {LIGACOES.map((l) => {
            const aberta = l.data === transcricaoAbertaData;
            return (
              <tr key={l.data}>
                <td className="py-2 font-mono text-[#1a1a1a]">{l.data}</td>
                <td className="py-2 font-mono text-[#1a1a1a]">{l.tentativas}</td>
                <td className="py-2">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[#1a1a1a]">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: l.quebrou ? STATUS_COLOR.acima : STATUS_COLOR.abaixo }}
                    />
                    {l.quebrou ? "Quebrou" : "Não quebrou"}
                  </span>
                </td>
                <td className="py-2 text-right">
                  <button
                    onClick={
                      l.transcricao ? () => setTranscricaoAbertaData(aberta ? null : l.data) : undefined
                    }
                    className="text-xs text-[#1a1a1a] underline underline-offset-2"
                  >
                    {aberta ? "ocultar transcrição" : "ver transcrição"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {ligacaoAberta?.transcricao && (
        <pre className="mt-4 whitespace-pre-wrap border border-[#e2e0da] p-4 font-mono text-xs leading-relaxed text-[#1a1a1a]">
          {ligacaoAberta.transcricao}
        </pre>
      )}
    </>
  );
}
