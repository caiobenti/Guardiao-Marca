"use client";

import { useState } from "react";
import { MoreVertical, Paperclip, Phone, Plus, Send, Smile, Type, Video } from "lucide-react";
import { SDRS, Tendencia } from "../data";
import { BotAvatar, DateDivider, SlackMessage } from "../ChatShell";
import { MarcarReuniaoModal } from "../MarcarReuniaoModal";
import { Button, TrendArrow } from "../ui";
import { usePerformBot } from "../context";
import { STATUS_COLOR } from "../theme";

function FarolDot({ cor }: { cor: "verde" | "amarelo" | "vermelho" }) {
  const bg = cor === "vermelho" ? STATUS_COLOR.abaixo : cor === "amarelo" ? STATUS_COLOR.dentro : STATUS_COLOR.acima;
  return <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: bg }} />;
}

function FarolTabela({ sdrId }: { sdrId: string }) {
  const cor = SDRS.find((s) => s.id === sdrId)?.farol ?? "verde";
  return <FarolDot cor={cor} />;
}

interface LinhaQuinzena2 {
  id: string;
  nome: string;
  cor: "verde" | "amarelo" | "vermelho";
  tendencia: Tendencia;
  mixed?: boolean;
  resumo: string;
  acao: "nenhuma" | "concluido" | "marcar1a1" | "buddy" | "monitorar" | "revisar";
}

const QUINZENA2: LinhaQuinzena2[] = [
  {
    id: "adriano",
    nome: "Adriano",
    cor: "verde",
    tendencia: "estavel",
    resumo: "Dentro do esperado. Já se passaram 5 semanas desde o último 1:1.",
    acao: "marcar1a1",
  },
  {
    id: "beatriz",
    nome: "Beatriz",
    cor: "verde",
    tendencia: "subindo",
    resumo:
      "Segue como top performer. Também está apoiando o Carlos como buddy essa quinzena, sem impacto no próprio resultado até aqui.",
    acao: "monitorar",
  },
  {
    id: "carlos",
    nome: "Carlos",
    cor: "amarelo",
    tendencia: "subindo",
    resumo:
      "Em acompanhamento com a Beatriz (buddy). Quebra de objeção voltou à faixa esperada nas últimas ligações — sinal recente, seguimos observando.",
    acao: "buddy",
  },
  {
    id: "daniela",
    nome: "Daniela",
    cor: "verde",
    tendencia: "estavel",
    resumo: "1:1 realizado em 18/09. Segue dentro do esperado.",
    acao: "concluido",
  },
  {
    id: "eduarda",
    nome: "Eduarda",
    cor: "verde",
    tendencia: "estavel",
    resumo: "1:1 realizado em 22/09, conforme agendado.",
    acao: "concluido",
  },
  {
    id: "felipe",
    nome: "Felipe",
    cor: "amarelo",
    tendencia: "subindo",
    mixed: true,
    resumo:
      "Resultado segue bem acima da média, mas continua com duas competências de processo abaixo do esperado — o padrão de força bruta se mantém.",
    acao: "revisar",
  },
];

function ChannelHeader() {
  return (
    <div className="flex items-center justify-between border-b border-[#e2e0da] px-6 py-3.5">
      <div className="flex items-center gap-3">
        <BotAvatar size={34} />
        <div>
          <p className="flex items-center gap-2 text-[15px] font-semibold text-[#1a1a1a]">
            PerformBot
            <span className="border border-[#e2e0da] px-1 text-[10px] text-[#6b6a63]">APP</span>
          </p>
          <p className="text-xs text-[#6b6a63]">Assistente de performance do time de vendas</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-[#6b6a63]">
        <Phone size={18} strokeWidth={1.5} />
        <Video size={18} strokeWidth={1.5} />
        <MoreVertical size={18} strokeWidth={1.5} />
      </div>
    </div>
  );
}

function Composer() {
  return (
    <div className="border-t border-[#e2e0da] px-6 py-4">
      <div className="rounded-sm border border-[#e2e0da]">
        <div className="px-4 pt-2.5 text-sm text-[#6b6a63]">Enviar uma mensagem para PerformBot...</div>
        <div className="flex items-center gap-3 px-3 pb-2 pt-3 text-[#6b6a63]">
          <Plus size={17} strokeWidth={1.5} />
          <Type size={17} strokeWidth={1.5} />
          <Smile size={17} strokeWidth={1.5} />
          <Paperclip size={17} strokeWidth={1.5} />
          <span className="flex-1" />
          <Send size={17} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}

export function ChatScreen({
  onVerVisaoGeral,
  conversationStage,
  mensagemCombinado,
  mostrarCheckIn,
}: {
  onVerVisaoGeral: () => void;
  conversationStage: 0 | 1;
  mensagemCombinado: string;
  mostrarCheckIn: boolean;
}) {
  const { carlosStatus, pendingCount } = usePerformBot();
  const [eduardaData, setEduardaData] = useState<string | null>(null);
  const [adrianoData, setAdrianoData] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState<"eduarda" | "adriano" | null>(null);
  const [checkInDecisao, setCheckInDecisao] = useState<"manter" | "encerrar" | null>(null);
  const [checkInRevelado, setCheckInRevelado] = useState(false);
  const [quinzena2Revelada, setQuinzena2Revelada] = useState(false);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ChannelHeader />
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-4xl">
          <SlackMessage timestamp="09:02">
            <p className="mb-3 font-medium">Bom dia, Gabi. Aqui está sua leitura quinzenal do time.</p>

            <p className="mb-4 max-w-2xl leading-relaxed text-[#1a1a1a]">
              Resultado geral do time dentro do esperado nessa quinzena, com Carlos abaixo em
              quebra de objeção. Nas competências, pesquisa prévia do cliente caiu
              estruturalmente para o time inteiro — sinal de causa comum, não de execução
              individual.
            </p>

            <div className="mb-6">
              <Button onClick={onVerVisaoGeral}>Ver dashboard completo</Button>
            </div>

            <table className="w-full min-w-[720px] table-fixed border-t border-[#e2e0da] text-left text-sm">
              <colgroup>
                <col className="w-[13%]" />
                <col className="w-[10%]" />
                <col className="w-[10%]" />
                <col className="w-[45%]" />
                <col className="w-[22%]" />
              </colgroup>
              <thead className="text-xs text-[#6b6a63]">
                <tr className="border-b border-[#e2e0da]">
                  <th className="px-0 py-2 pr-4 font-normal">SDR</th>
                  <th className="px-3 py-2 font-normal">Status</th>
                  <th className="px-3 py-2 font-normal">Tendência</th>
                  <th className="px-4 py-2 font-normal">Resumo</th>
                  <th className="px-4 py-2 font-normal">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e0da]">
                {SDRS.map((sdr) => (
                  <tr key={sdr.id} className="align-top">
                    <td className="whitespace-nowrap py-3 pr-4 font-medium text-[#1a1a1a]">
                      {sdr.nome}
                    </td>
                    <td className="px-3 py-3">
                      <FarolTabela sdrId={sdr.id} />
                    </td>
                    <td className="px-3 py-3">
                      <TrendArrow tendencia={sdr.tendencia} mixed={sdr.id === "felipe"} />
                    </td>
                    <td className="px-4 py-3 text-[#1a1a1a]">
                      {sdr.id === "carlos"
                        ? "Abaixo do esperado em quebra de objeção, há 3 quinzenas seguidas."
                        : sdr.resumo}
                    </td>
                    <td className="px-4 py-3">
                      {sdr.id === "carlos" && (
                        <span className="whitespace-nowrap rounded-sm border border-[#1a1a1a] px-3 py-1 text-xs text-[#1a1a1a]">
                          {carlosStatus === "resolvido" ? "Resolvido" : "Aguardando revisão"}
                        </span>
                      )}
                      {sdr.id === "daniela" && (
                        <span className="whitespace-nowrap border border-[#e2e0da] px-2 py-1 font-mono text-xs text-[#1a1a1a]">
                          18/09
                        </span>
                      )}
                      {sdr.id === "eduarda" &&
                        (eduardaData ? (
                          <span className="whitespace-nowrap font-mono text-xs text-[#1a1a1a]">
                            Agendado — {eduardaData}
                          </span>
                        ) : (
                          <button
                            onClick={() => setModalAberto("eduarda")}
                            className="whitespace-nowrap rounded-sm border border-[#1a1a1a] px-3 py-1 text-xs text-[#1a1a1a] transition-colors hover:bg-[#1a1a1a]/5"
                          >
                            Marcar 1:1
                          </button>
                        ))}
                      {(sdr.id === "adriano" || sdr.id === "beatriz") && (
                        <span className="text-xs text-[#1a1a1a]">Nenhuma ação sugerida</span>
                      )}
                      {sdr.id === "felipe" && (
                        <span className="text-xs text-[#1a1a1a]">
                          Nenhuma ação a princípio, mas acompanhar evolução
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="mt-3 text-xs text-[#6b6a63]">
              * Felipe: sinal misto — resultado em alta, mas processo com gaps.
            </p>

            {pendingCount > 0 && (
              <div className="mt-6 border-t border-[#e2e0da] pt-4">
                <p className="text-sm leading-relaxed text-[#1a1a1a]">
                  Lembrete: você tem{" "}
                  <span className="font-mono">{pendingCount}</span>{" "}
                  {pendingCount === 1 ? "revisão pendente" : "revisões pendentes"}. Elas precisam
                  ser avaliadas no dashboard antes de qualquer decisão.
                </p>
              </div>
            )}

            <div className="mt-5">
              <Button onClick={onVerVisaoGeral}>Ver dashboard completo</Button>
            </div>
          </SlackMessage>

          {conversationStage >= 1 && (
            <>
              <SlackMessage timestamp="09:14">
                <p>{mensagemCombinado}</p>
              </SlackMessage>

              {mostrarCheckIn && !checkInRevelado && (
                <div className="border-t border-[#e2e0da] py-6">
                  <Button variant="secondary" onClick={() => setCheckInRevelado(true)}>
                    Ver atualização do Carlos
                  </Button>
                </div>
              )}

              {mostrarCheckIn && checkInRevelado && (
                <>
                  <DateDivider label="22 de setembro" />

                  <SlackMessage timestamp="09:00">
                    <p className="mb-3 font-semibold text-[#1a1a1a]">Atualização sobre o Carlos</p>
                    <p className="mb-3 leading-relaxed">
                      Ele e a Beatriz trocaram bastante no Slack essa quinzena — ela deu dicas
                      específicas sobre a objeção de autoridade, comentou em um huddle do time
                      sobre como conduzir esse tipo de ligação, e trocou feedback com ele depois
                      de pelo menos 2 reuniões dele.
                    </p>
                    <p className="mb-3 leading-relaxed">
                      Carlos já aplicou isso: nas últimas 3 ligações, quebrou a objeção na{" "}
                      <span className="font-mono">2ª</span> tentativa, dentro da faixa esperada.
                    </p>
                    <p className="leading-relaxed">
                      O plano de buddy começou a dar resultado. Ainda vale monitorar de perto — é
                      sinal recente, não confirmado em definitivo.
                    </p>

                    {checkInDecisao ? (
                      <p className="mt-4 border-t border-[#e2e0da] pt-4 text-sm text-[#1a1a1a]">
                        {checkInDecisao === "manter"
                          ? "Acompanhamento estendido por mais 15 dias."
                          : "Registrado como objetivo atingido. Ciclo do Carlos encerrado."}
                      </p>
                    ) : (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button variant="secondary" onClick={() => setCheckInDecisao("manter")}>
                          Manter o acompanhamento por mais 15 dias
                        </Button>
                        <Button onClick={() => setCheckInDecisao("encerrar")}>
                          Encerrar, objetivo atingido
                        </Button>
                      </div>
                    )}
                  </SlackMessage>

                  {checkInDecisao && !quinzena2Revelada && (
                    <div className="border-t border-[#e2e0da] py-6">
                      <Button variant="secondary" onClick={() => setQuinzena2Revelada(true)}>
                        Ver leitura quinzenal do time
                      </Button>
                    </div>
                  )}

                  {checkInDecisao && quinzena2Revelada && (
                    <>
                      <SlackMessage timestamp="09:05">
                        <p className="mb-3 font-medium">
                          Bom dia, Gabi. Aqui está sua leitura quinzenal do time.
                        </p>

                        <p className="mb-4 max-w-2xl leading-relaxed text-[#1a1a1a]">
                          Pesquisa prévia do cliente recuperou depois da atualização da fonte de
                          leads — sinal de que a causa estrutural foi corrigida. Felipe segue com
                          resultado bem acima da média, mas mantém duas competências de processo
                          abaixo do esperado.
                        </p>

                        <div className="mb-6">
                          <Button onClick={onVerVisaoGeral}>Ver dashboard completo</Button>
                        </div>

                        <table className="w-full min-w-[720px] table-fixed border-t border-[#e2e0da] text-left text-sm">
                          <colgroup>
                            <col className="w-[13%]" />
                            <col className="w-[10%]" />
                            <col className="w-[10%]" />
                            <col className="w-[45%]" />
                            <col className="w-[22%]" />
                          </colgroup>
                          <thead className="text-xs text-[#6b6a63]">
                            <tr className="border-b border-[#e2e0da]">
                              <th className="px-0 py-2 pr-4 font-normal">SDR</th>
                              <th className="px-3 py-2 font-normal">Status</th>
                              <th className="px-3 py-2 font-normal">Tendência</th>
                              <th className="px-4 py-2 font-normal">Resumo</th>
                              <th className="px-4 py-2 font-normal">Ação</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#e2e0da]">
                            {QUINZENA2.map((sdr) => (
                              <tr key={sdr.id} className="align-top">
                                <td className="whitespace-nowrap py-3 pr-4 font-medium text-[#1a1a1a]">
                                  {sdr.nome}
                                </td>
                                <td className="px-3 py-3">
                                  <FarolDot cor={sdr.cor} />
                                </td>
                                <td className="px-3 py-3">
                                  <TrendArrow tendencia={sdr.tendencia} mixed={sdr.mixed} />
                                </td>
                                <td className="px-4 py-3 text-[#1a1a1a]">{sdr.resumo}</td>
                                <td className="px-4 py-3">
                                  {sdr.acao === "concluido" && (
                                    <span className="text-xs text-[#1a1a1a]">Sem ação</span>
                                  )}
                                  {sdr.acao === "marcar1a1" &&
                                    (adrianoData ? (
                                      <span className="whitespace-nowrap font-mono text-xs text-[#1a1a1a]">
                                        Agendado — {adrianoData}
                                      </span>
                                    ) : (
                                      <button
                                        onClick={() => setModalAberto("adriano")}
                                        className="whitespace-nowrap rounded-sm border border-[#1a1a1a] px-3 py-1 text-xs text-[#1a1a1a] transition-colors hover:bg-[#1a1a1a]/5"
                                      >
                                        Marcar 1:1
                                      </button>
                                    ))}
                                  {sdr.acao === "buddy" && (
                                    <span className="text-xs text-[#1a1a1a]">
                                      Continuar com programa buddy
                                    </span>
                                  )}
                                  {sdr.acao === "monitorar" && (
                                    <span className="text-xs text-[#1a1a1a]">
                                      Continuar acompanhando performance
                                    </span>
                                  )}
                                  {sdr.acao === "revisar" && (
                                    <button className="whitespace-nowrap rounded-sm border border-[#1a1a1a] px-3 py-1 text-xs text-[#1a1a1a] transition-colors hover:bg-[#1a1a1a]/5">
                                      Revisar
                                    </button>
                                  )}
                                  {sdr.acao === "nenhuma" && (
                                    <span className="text-[#a8a69e]">—</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <p className="mt-3 text-xs text-[#6b6a63]">
                          * Felipe: sinal misto — resultado em alta, mas processo com gaps.
                        </p>

                        <div className="mt-5">
                          <Button onClick={onVerVisaoGeral}>Ver dashboard completo</Button>
                        </div>
                      </SlackMessage>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
      <Composer />

      {modalAberto === "eduarda" && (
        <MarcarReuniaoModal
          nome="Eduarda"
          onFechar={() => setModalAberto(null)}
          onConfirmar={(data) => {
            setEduardaData(data);
            setModalAberto(null);
          }}
        />
      )}
      {modalAberto === "adriano" && (
        <MarcarReuniaoModal
          nome="Adriano"
          onFechar={() => setModalAberto(null)}
          onConfirmar={(data) => {
            setAdrianoData(data);
            setModalAberto(null);
          }}
        />
      )}
    </div>
  );
}
