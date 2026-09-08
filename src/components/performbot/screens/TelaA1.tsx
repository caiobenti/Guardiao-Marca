"use client";

import { useState } from "react";
import { SDRS } from "../data";
import { BotMessage, ChatBackdrop } from "../ChatShell";
import { FarolDot, PillButton, TrendArrow } from "../ui";

export function TelaA1({
  onRevisarCarlos,
  onVerVisaoGeral,
}: {
  onRevisarCarlos: () => void;
  onVerVisaoGeral: () => void;
}) {
  const [eduardaAgendada, setEduardaAgendada] = useState(false);

  return (
    <ChatBackdrop wide>
      <BotMessage>
        <p className="mb-4">Bom dia, Gabi! Aqui está sua leitura quinzenal do time 👋</p>

        <div className="mb-5 flex gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3">
          <span className="text-lg leading-none">⚠️</span>
          <p className="text-sm leading-relaxed text-amber-900">
            <span className="font-semibold">Alerta geral do time</span> — nessa quinzena, todo o
            time caiu na dimensão <span className="font-semibold">Pesquisa prévia do cliente</span>.
            Vale avaliar o que mudou (possível causa: fonte da lista de leads).{" "}
            <button
              onClick={onVerVisaoGeral}
              className="font-semibold text-amber-900 underline underline-offset-2 hover:text-amber-950"
            >
              Ver detalhe na visão geral do time →
            </button>
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[640px] table-fixed text-left text-sm">
            <colgroup>
              <col className="w-[15%]" />
              <col className="w-[10%]" />
              <col className="w-[12%]" />
              <col className="w-[38%]" />
              <col className="w-[25%]" />
            </colgroup>
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-2.5 font-medium">SDR</th>
                <th className="px-3 py-2.5 font-medium">Status</th>
                <th className="px-3 py-2.5 font-medium">Tendência</th>
                <th className="px-4 py-2.5 font-medium">Resumo</th>
                <th className="px-4 py-2.5 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {SDRS.map((sdr) => (
                <tr key={sdr.id} className="align-top">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                    {sdr.nome}
                  </td>
                  <td className="px-3 py-3">
                    <FarolDot farol={sdr.farol} />
                  </td>
                  <td className="px-3 py-3">
                    <TrendArrow tendencia={sdr.tendencia} mixed={sdr.id === "felipe"} />
                  </td>
                  <td className="px-4 py-3 text-gray-700">{sdr.resumo}</td>
                  <td className="px-4 py-3">
                    {sdr.id === "carlos" && (
                      <PillButton variant="primary" onClick={onRevisarCarlos}>
                        Revisar
                      </PillButton>
                    )}
                    {sdr.id === "daniela" && (
                      <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                        📅 18/09
                      </span>
                    )}
                    {sdr.id === "eduarda" &&
                      (eduardaAgendada ? (
                        <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                          ✓ Agendado — 22/09
                        </span>
                      ) : (
                        <PillButton variant="secondary" onClick={() => setEduardaAgendada(true)}>
                          Marcar 1:1
                        </PillButton>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-gray-400">
          * Felipe: sinal misto — resultado em alta, mas processo com gaps.
        </p>

        <div className="mt-5">
          <PillButton variant="primary" onClick={onVerVisaoGeral}>
            Ver visão geral do time
          </PillButton>
        </div>
      </BotMessage>
    </ChatBackdrop>
  );
}
