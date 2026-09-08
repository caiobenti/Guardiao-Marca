"use client";

import { useState } from "react";
import { MoreVertical, Paperclip, Phone, Plus, Send, Smile, Type, Video } from "lucide-react";
import { SDRS } from "../data";
import { BotAvatar, DateDivider, SlackMessage } from "../ChatShell";
import { DecisoesPendentesSection } from "../DecisoesPendentesSection";
import { PillButton, TrendArrow } from "../ui";
import { usePerformBot } from "../context";

function FarolTabela({ sdrId }: { sdrId: string }) {
  if (sdrId === "felipe") {
    return (
      <span
        className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ background: "linear-gradient(135deg, #22c55e 50%, #eab308 50%)" }}
        aria-label="status misto"
      />
    );
  }
  const cor = SDRS.find((s) => s.id === sdrId)?.farol;
  const bg = cor === "vermelho" ? "#ef4444" : cor === "amarelo" ? "#eab308" : "#22c55e";
  return <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: bg }} />;
}

function ChannelHeader() {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-3.5">
      <div className="flex items-center gap-3">
        <BotAvatar size={34} />
        <div>
          <p className="flex items-center gap-2 text-[15px] font-bold text-gray-900">
            PerformBot
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
              APP
            </span>
          </p>
          <p className="text-xs text-gray-500">Assistente de performance do time de vendas</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-gray-400">
        <Phone size={18} />
        <Video size={18} />
        <MoreVertical size={18} />
      </div>
    </div>
  );
}

function Composer() {
  return (
    <div className="border-t border-gray-100 px-6 py-4">
      <div className="rounded-xl border border-gray-300">
        <div className="px-4 pt-2.5 text-sm text-gray-400">Enviar uma mensagem para PerformBot...</div>
        <div className="flex items-center gap-3 px-3 pb-2 pt-3 text-gray-400">
          <Plus size={17} />
          <Type size={17} />
          <Smile size={17} />
          <Paperclip size={17} />
          <span className="flex-1" />
          <Send size={17} />
        </div>
      </div>
    </div>
  );
}

export function ChatScreen({
  onRevisarCarlos,
  onVerVisaoGeral,
  conversationStage,
  mensagemCombinado,
  mostrarCheckIn,
}: {
  onRevisarCarlos: () => void;
  onVerVisaoGeral: () => void;
  conversationStage: 0 | 1;
  mensagemCombinado: string;
  mostrarCheckIn: boolean;
}) {
  const { carlosStatus } = usePerformBot();
  const [eduardaAgendada, setEduardaAgendada] = useState(false);
  const [checkInDecisao, setCheckInDecisao] = useState<"manter" | "encerrar" | null>(null);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ChannelHeader />
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-4xl">
          <SlackMessage timestamp="09:02">
            <p className="mb-4 font-medium">Bom dia, Gabi! Aqui está sua leitura quinzenal do time 👋</p>

            <div className="mb-5">
              <DecisoesPendentesSection onRevisarCarlos={onRevisarCarlos} />
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full min-w-[720px] table-fixed text-left text-sm">
                <colgroup>
                  <col className="w-[13%]" />
                  <col className="w-[10%]" />
                  <col className="w-[10%]" />
                  <col className="w-[45%]" />
                  <col className="w-[22%]" />
                </colgroup>
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">SDR</th>
                    <th className="px-3 py-2.5 font-medium">Status</th>
                    <th className="px-3 py-2.5 font-medium">Tendência</th>
                    <th className="px-4 py-2.5 font-medium">Resumo</th>
                    <th className="px-4 py-2.5 font-medium">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {SDRS.map((sdr) => (
                    <tr key={sdr.id} className="align-top">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                        {sdr.nome}
                      </td>
                      <td className="px-3 py-3">
                        <FarolTabela sdrId={sdr.id} />
                      </td>
                      <td className="px-3 py-3">
                        <TrendArrow tendencia={sdr.tendencia} mixed={sdr.id === "felipe"} />
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {sdr.id === "carlos"
                          ? "Abaixo do esperado em quebra de objeção, há 3 quinzenas seguidas."
                          : sdr.resumo}
                      </td>
                      <td className="px-4 py-3">
                        {sdr.id === "carlos" && (
                          <span className="text-xs italic text-gray-400">
                            {carlosStatus === "resolvido" ? "Resolvido" : "ver acima ↑"}
                          </span>
                        )}
                        {sdr.id === "daniela" && (
                          <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg border border-[#4f46e5] px-3 py-1 text-xs font-medium text-[#4f46e5]">
                            📅 18/09
                          </span>
                        )}
                        {sdr.id === "eduarda" &&
                          (eduardaAgendada ? (
                            <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                              ✓ Agendado — 22/09
                            </span>
                          ) : (
                            <button
                              onClick={() => setEduardaAgendada(true)}
                              className="rounded-lg border border-[#4f46e5] px-3.5 py-1.5 text-xs font-medium text-[#4f46e5] transition-colors hover:bg-[#eef0fd]"
                            >
                              Marcar 1:1
                            </button>
                          ))}
                        {sdr.id !== "carlos" &&
                          sdr.id !== "daniela" &&
                          sdr.id !== "eduarda" && <span className="text-gray-300">—</span>}
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
              <button
                onClick={onVerVisaoGeral}
                className="rounded-lg bg-[#4f46e5] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4338ca]"
              >
                Ver visão geral do time
              </button>
            </div>
          </SlackMessage>

          {conversationStage >= 1 && (
            <>
              <SlackMessage timestamp="09:14">
                <p>{mensagemCombinado}</p>
              </SlackMessage>

              {mostrarCheckIn && (
                <>
                  <DateDivider label="22 de setembro" />

                  <SlackMessage timestamp="09:00">
                    <p className="mb-3 font-semibold text-gray-900">Boa notícia sobre o Carlos 🎉</p>
                    <p className="mb-3 leading-relaxed">
                      Vi que ele e a Beatriz trocaram bastante no Slack essa quinzena — ela deu
                      dicas específicas sobre a objeção de autoridade, comentou em um huddle do
                      time sobre como conduzir esse tipo de ligação, e trocou feedback com ele
                      depois de pelo menos 2 reuniões dele.
                    </p>
                    <p className="mb-3 leading-relaxed">
                      Carlos já aplicou isso: nas últimas 3 ligações, quebrou a objeção na{" "}
                      <span className="font-semibold">2ª tentativa</span>, dentro da faixa
                      esperada.
                    </p>
                    <p className="leading-relaxed">
                      O plano de buddy começou a dar resultado. Ainda vale monitorar de perto — é
                      sinal recente, não confirmado em definitivo.
                    </p>

                    {checkInDecisao ? (
                      <div className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                        {checkInDecisao === "manter"
                          ? "✓ Acompanhamento estendido por mais 15 dias."
                          : "✓ Registrado como objetivo atingido. Ciclo do Carlos encerrado."}
                      </div>
                    ) : (
                      <div className="mt-4 flex flex-wrap gap-3">
                        <PillButton
                          variant="secondary"
                          onClick={() => setCheckInDecisao("manter")}
                        >
                          Manter o acompanhamento por mais 15 dias
                        </PillButton>
                        <PillButton
                          variant="primary"
                          onClick={() => setCheckInDecisao("encerrar")}
                        >
                          Encerrar, objetivo atingido
                        </PillButton>
                      </div>
                    )}
                  </SlackMessage>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <Composer />
    </div>
  );
}
