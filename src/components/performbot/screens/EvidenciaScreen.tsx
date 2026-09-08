"use client";

import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { PillButton } from "../ui";

const TRANSCRICAO = `Secretária: Olha, a diretora não costuma receber esse tipo de contato...
Carlos: Entendo. É rápido, só queria entender se vocês já usam alguma ferramenta pra isso.
Secretária: A gente já tem um processo, viu?
Carlos: Sem problema. Só pra eu não incomodar de novo: teria um e-mail que eu possa mandar mais informação?
Secretária: Pode mandar, mas não prometo que ela vai ler.
Carlos: Perfeito, mando hoje. Obrigado pelo tempo!

(objeção só é quebrada na 4ª tentativa, 6 minutos depois, quando Carlos muda de
abordagem e oferece um material em vez de insistir na ligação)`;

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

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-3.5">
        <button
          onClick={onVoltar}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>
      </div>
      <div className="mx-auto max-w-2xl px-6 py-8 sm:px-10">
        <h1 className="mb-6 flex items-center gap-2 text-xl font-semibold text-gray-900">
          Carlos — Quebra de objeção
          <span className="text-red-500">🔴</span>
          <span className="text-sm font-normal text-gray-500">
            (fora da faixa há 3 quinzenas)
          </span>
        </h1>

        <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Evidência
            </p>
            <p className="text-[15px] leading-relaxed text-gray-800">
              Nas últimas 10 reuniões, em <span className="font-semibold">7</span> a objeção só
              foi quebrada depois da <span className="font-semibold">3ª tentativa</span>.
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
            Esse padrão vem do comportamento observado nos SDRs que mais convertem nessa
            cadeira — eles resolvem, em média, na <span className="font-medium">2ª tentativa</span>.
          </div>

          <div>
            <button
              onClick={() => setTranscricaoAberta((v) => !v)}
              className="text-sm font-semibold text-[#4f46e5] underline underline-offset-2 hover:text-[#4338ca]"
            >
              {transcricaoAberta ? "Ocultar" : "Ver"} transcrição da ligação de 03/09 (objeção da
              secretária da escola) {transcricaoAberta ? "↑" : "→"}
            </button>
            {transcricaoAberta && (
              <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-900 p-4 font-mono text-xs leading-relaxed text-gray-100">
                {TRANSCRICAO}
              </pre>
            )}
          </div>

          <p className="text-sm italic text-gray-500">
            Carlos é o único fora da faixa nessa dimensão essa quinzena.
          </p>

          <div className="border-t border-gray-100 pt-5">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Plano sugerido
            </p>
            <p className="text-[15px] leading-relaxed text-gray-800">
              Sessão de role-play 1:1 com você (Gabi), usando 2 exemplos reais das próprias
              ligações do Carlos.
            </p>
          </div>

          <div className="flex gap-3 border-t border-gray-100 pt-5">
            <PillButton variant="primary" onClick={onAceitar}>
              ✓ Aceitar plano
            </PillButton>
            <PillButton variant="secondary" onClick={onAjustar}>
              ✗ Ajustar plano
            </PillButton>
          </div>
        </div>
      </div>
    </div>
  );
}
