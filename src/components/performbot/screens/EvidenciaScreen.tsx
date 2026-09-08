"use client";

import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui";
import { STATUS_COLOR } from "../theme";

const LIGACOES: { data: string; tentativa: number; nota?: string }[] = [
  { data: "18/08", tentativa: 2 },
  { data: "19/08", tentativa: 4 },
  { data: "21/08", tentativa: 3 },
  { data: "25/08", tentativa: 3 },
  { data: "26/08", tentativa: 1 },
  { data: "28/08", tentativa: 3 },
  { data: "29/08", tentativa: 5 },
  { data: "01/09", tentativa: 4 },
  { data: "02/09", tentativa: 2 },
  { data: "03/09", tentativa: 3, nota: "objeção da secretária da escola" },
];

const TRANSCRICAO = `Secretária: A diretora não costuma atender contato direto, ela pede
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

export function EvidenciaScreen({
  onVoltar,
  onAceitar,
  onAjustar,
}: {
  onVoltar: () => void;
  onAceitar: () => void;
  onAjustar: () => void;
}) {
  const [transcricaoAberta, setTranscricaoAberta] = useState(false);

  const foraDaFaixa = LIGACOES.filter((l) => l.tentativa >= 3).length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex items-center gap-3 border-b border-[#e2e0da] px-6 py-3.5">
        <button
          onClick={onVoltar}
          className="flex items-center gap-1.5 text-sm text-[#6b6a63] hover:text-[#1a1a1a]"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Voltar
        </button>
      </div>
      <div className="mx-auto max-w-2xl px-6 py-8 sm:px-10">
        <h1
          className="mb-1 flex items-center gap-2 text-xl text-[#1a1a1a]"
          style={{ fontFamily: "var(--font-serif-report)" }}
        >
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: STATUS_COLOR.abaixo }}
          />
          Carlos — Quebra de objeção
        </h1>
        <p className="mb-8 text-sm text-[#6b6a63]">Fora da faixa esperada há 3 quinzenas.</p>

        <div className="border-t border-[#e2e0da] pt-5">
          <p className="mb-3 text-sm text-[#1a1a1a]">
            Últimas 10 reuniões — tentativa em que a objeção foi quebrada
          </p>
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-[#e2e0da]">
              {LIGACOES.map((l) => (
                <tr key={l.data}>
                  <td className="w-24 py-2 font-mono text-[#1a1a1a]">{l.data}</td>
                  <td className="py-2 font-mono text-[#1a1a1a]">{l.tentativa}ª tentativa</td>
                  <td className="py-2 text-right">
                    {l.nota && (
                      <button
                        onClick={() => setTranscricaoAberta((v) => !v)}
                        className="text-xs text-[#1a1a1a] underline underline-offset-2"
                      >
                        {transcricaoAberta ? "ocultar transcrição" : `ver transcrição — ${l.nota}`}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {transcricaoAberta && (
            <pre className="mt-4 whitespace-pre-wrap border border-[#e2e0da] p-4 font-mono text-xs leading-relaxed text-[#1a1a1a]">
              {TRANSCRICAO}
            </pre>
          )}

          <p className="mt-4 text-sm text-[#1a1a1a]">
            Em <span className="font-mono">{foraDaFaixa}</span> das{" "}
            <span className="font-mono">10</span> reuniões, a objeção só foi quebrada a partir da
            3ª tentativa.
          </p>
        </div>

        <div className="border-t border-[#e2e0da] pt-5">
          <p className="text-sm text-[#1a1a1a]">
            Carlos: <span className="font-mono">3ª</span> tentativa (mediana) · Referência do
            time: <span className="font-mono">2ª</span> tentativa
          </p>
          <p className="mt-2 text-sm text-[#1a1a1a]">
            Carlos é o único fora da faixa nessa dimensão essa quinzena.
          </p>
        </div>

        <div className="border-t border-[#e2e0da] pt-5">
          <p className="mb-1 text-sm text-[#1a1a1a]">Plano sugerido</p>
          <p className="text-[15px] leading-relaxed text-[#1a1a1a]">
            Sessão de role-play 1:1 com você (Gabi), usando 2 exemplos reais das próprias
            ligações do Carlos.
          </p>
        </div>

        <div className="flex gap-2 border-t border-[#e2e0da] pt-5">
          <Button onClick={onAceitar}>Aceitar plano</Button>
          <Button variant="secondary" onClick={onAjustar}>
            Ajustar plano
          </Button>
        </div>
      </div>
    </div>
  );
}
