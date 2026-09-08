"use client";

import { useState } from "react";
import { ChannelHeader, Composer, SlackMessage } from "../ChatShell";
import { DimensaoGridAnonima } from "../DimensaoGridAnonima";
import { EvidenciaLogTable, LIGACOES, REFERENCIA_TIME_QUEBRADAS, contarQuebradas } from "../EvidenciaLog";
import { Button } from "../ui";
import { STATUS_COLOR } from "../theme";

const TRANSCRICAO_BEATRIZ = `Prospect: Já uso outra ferramenta pra isso, não estou procurando
trocar agora.

Beatriz: Entendo. Só fico curiosa: o que mais incomoda vocês na
ferramenta atual, se é que incomoda alguma coisa?

Prospect: Olha, o relatório de fechamento é bem manual, a gente
perde tempo nisso todo mês.

Beatriz: Faz sentido, é uma dor comum. Vale 15 minutos só pra eu te
mostrar como isso fica automático? Sem compromisso de trocar de
ferramenta.

Prospect: Pode ser, manda um horário.

(Beatriz não insistiu no diferencial do produto — perguntou o que
incomodava na ferramenta atual, e ofereceu resolver exatamente esse
ponto, não a proposta geral)`;

const TRANSCRICAO_DANIELA = `Prospect: Sinceramente não é prioridade agora, temos outras frentes
rodando.

Daniela: Entendo completamente. Só pra eu saber quando faz sentido
voltar a falar com vocês: tem alguma época do ano em que essa frente
costuma virar prioridade?

Prospect: Geralmente perto da renovação com o fornecedor atual, em
novembro.

Daniela: Ótimo saber. Posso te ligar em outubro, mais perto dessa
decisão, já com uma comparação pronta?

Prospect: Isso ajuda, pode ser.

(Daniela não tentou vencer o "não é prioridade" — perguntou o que
mudaria isso, e ancorou o próximo passo num gatilho real, não numa
insistência genérica)`;

function BlocoAcao({
  titulo,
  descricao,
  rotuloBotao,
  onClick,
}: {
  titulo: string;
  descricao: string;
  rotuloBotao: string;
  onClick?: () => void;
}) {
  return (
    <div className="border-t border-[#e2e0da] py-5 first:border-t-0 first:pt-0">
      <p className="mb-1 text-[15px] font-semibold text-[#1a1a1a]">{titulo}</p>
      <p className="mb-3 text-sm leading-relaxed text-[#6b6a63]">{descricao}</p>
      <button
        onClick={onClick}
        className="rounded-sm border border-[#1a1a1a] px-3.5 py-1.5 text-xs text-[#1a1a1a] transition-colors hover:bg-[#1a1a1a]/5"
      >
        {rotuloBotao}
      </button>
    </div>
  );
}

export function CarlosJourney() {
  const [mostrarE2, setMostrarE2] = useState(false);
  const [mostrarE3, setMostrarE3] = useState(false);
  const [mostrarE4, setMostrarE4] = useState(false);

  const quebradas = contarQuebradas();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ChannelHeader />
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-4xl">
          <SlackMessage timestamp="09:02">
            <p className="mb-4 max-w-2xl leading-relaxed text-[#1a1a1a]">
              Oi, Carlos! Bom dia! Segue o seu termômetro da quinzena (lembrando: isso não é
              uma avaliação, é uma ferramenta pra te ajudar a ver como você está chegando nas
              suas ligações e identificar onde vale focar seu desenvolvimento, se você quiser).
            </p>

            <DimensaoGridAnonima />

            <p className="mt-6 mb-4 max-w-2xl leading-relaxed text-[#1a1a1a]">
              Reparei um padrão em Quebra de objeção que vale sua atenção. Dá uma olhada?
            </p>

            {!mostrarE2 && <Button onClick={() => setMostrarE2(true)}>Ver detalhes</Button>}
          </SlackMessage>

          {mostrarE2 && (
            <SlackMessage timestamp="09:03">
              <p className="mb-1 flex items-center gap-2 text-[15px] font-semibold text-[#1a1a1a]">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: STATUS_COLOR.abaixo }}
                />
                Quebra de objeção
              </p>
              <p className="mb-4 text-sm text-[#6b6a63]">Fora da faixa esperada há 3 quinzenas.</p>

              <p className="mb-3 text-sm text-[#1a1a1a]">
                Você quebrou a objeção em <span className="font-mono">{quebradas}</span> das{" "}
                <span className="font-mono">{LIGACOES.length}</span> últimas reuniões.
              </p>
              <EvidenciaLogTable />

              <p className="mt-4 text-sm text-[#1a1a1a]">
                Carlos: <span className="font-mono">{quebradas}</span> de{" "}
                <span className="font-mono">{LIGACOES.length}</span> quebradas · Referência do
                time: <span className="font-mono">{REFERENCIA_TIME_QUEBRADAS}</span> de{" "}
                <span className="font-mono">{LIGACOES.length}</span> quebradas
              </p>

              <div className="mt-4 space-y-4">
                <p className="text-[15px] leading-relaxed text-[#1a1a1a]">
                  Reparei uma coisa nas suas próprias ligações que vale você perceber: quando
                  você quebra a objeção (21/08, 01/09, 03/09), você faz algo que não faz nas
                  outras — para de insistir no argumento inicial e faz uma pergunta pra entender
                  o que está por trás do &quot;não&quot;. Na de 03/09, por exemplo, você trocou
                  &quot;vou te mostrar os diferenciais&quot; por uma pergunta sobre um problema
                  real da escola, e a partir dali a conversa virou.
                </p>
                <p className="text-[15px] leading-relaxed text-[#1a1a1a]">
                  Nas que não quebram, o padrão se repete: você mantém o mesmo argumento do
                  início ao fim, mesmo quando fica claro que a objeção não é sobre o que você
                  está oferecendo.
                </p>
                <p className="text-[15px] leading-relaxed text-[#1a1a1a]">
                  O interessante é que você já sabe fazer a coisa que funciona — só não está
                  fazendo de propósito, toda vez.
                </p>
              </div>

              {!mostrarE3 && (
                <div className="mt-4">
                  <Button onClick={() => setMostrarE3(true)}>Ver o que pode ajudar</Button>
                </div>
              )}
            </SlackMessage>
          )}

          {mostrarE3 && (
            <SlackMessage timestamp="09:04">
              <p className="mb-4 text-[15px] leading-relaxed text-[#1a1a1a]">
                Três caminhos que costumam ajudar nessa dimensão. Escolha o que fizer mais
                sentido pra você — não precisa ser todos.
              </p>

              <BlocoAcao
                titulo="Conhecer melhor o produto"
                descricao="Quanto mais fundo você entende o que vende, mais fácil é mostrar valor real na primeira objeção, em vez de insistir no roteiro."
                rotuloBotao="Ver material de produto"
              />
              <BlocoAcao
                titulo="Ouvir ligações de quem converte bem nisso"
                descricao="Quem converte nessa dimensão muda de abordagem assim que sente que a objeção é real, não genérica — pergunta antes de insistir."
                rotuloBotao="Ouvir 2-3 exemplos"
                onClick={() => setMostrarE4(true)}
              />
              <BlocoAcao
                titulo="Treinar o pitch com um colega"
                descricao="Simular a ligação com alguém ajuda a praticar a mudança de abordagem no meio da conversa, não só decorar resposta pronta pra objeção."
                rotuloBotao="Combinar um horário"
              />

              <p className="mt-4 border-t border-[#e2e0da] pt-4 text-sm leading-relaxed text-[#6b6a63]">
                Vale sempre alinhar com a Gabi que você vai focar em desenvolver essa habilidade
                essa quinzena — ajuda ela a acompanhar de perto.
              </p>
            </SlackMessage>
          )}

          {mostrarE4 && (
            <SlackMessage timestamp="09:05">
              <p className="mb-4 text-[15px] font-semibold text-[#1a1a1a]">
                Duas ligações recentes que converteram nessa dimensão
              </p>

              <p className="mb-3 text-sm text-[#1a1a1a]">
                Beatriz — <span className="font-mono">28/08</span>
              </p>
              <pre className="whitespace-pre-wrap border border-[#e2e0da] p-4 font-mono text-xs leading-relaxed text-[#1a1a1a]">
                {TRANSCRICAO_BEATRIZ}
              </pre>

              <p className="mb-3 mt-6 text-sm text-[#1a1a1a]">
                Daniela — <span className="font-mono">30/08</span>
              </p>
              <pre className="whitespace-pre-wrap border border-[#e2e0da] p-4 font-mono text-xs leading-relaxed text-[#1a1a1a]">
                {TRANSCRICAO_DANIELA}
              </pre>

              <p className="mt-4 text-sm leading-relaxed text-[#6b6a63]">
                É o mesmo padrão que apareceu nas suas ligações de 21/08, 01/09 e 03/09 — só que
                aqui elas fazem isso de forma consistente, ligação após ligação, não só às
                vezes.
              </p>
            </SlackMessage>
          )}
        </div>
      </div>
      <Composer />
    </div>
  );
}
