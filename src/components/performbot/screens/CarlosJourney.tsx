"use client";

import { useState } from "react";
import { ChannelHeader, Composer, SlackMessage, VoltarHeader } from "../ChatShell";
import { DimensaoGridAnonima } from "../DimensaoGridAnonima";
import { EvidenciaLogTable, LIGACOES, REFERENCIA_TIME_QUEBRADAS, contarQuebradas } from "../EvidenciaLog";
import { Button } from "../ui";
import { STATUS_COLOR } from "../theme";

type Screen = "e1" | "e2" | "e3" | "e4";

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

function TelaE1({ onVerDetalhes }: { onVerDetalhes: () => void }) {
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

            <Button onClick={onVerDetalhes}>Ver detalhes</Button>
          </SlackMessage>
        </div>
      </div>
      <Composer />
    </div>
  );
}

function TelaE2({ onVoltar, onVerAcoes }: { onVoltar: () => void; onVerAcoes: () => void }) {
  const quebradas = contarQuebradas();

  return (
    <div className="h-full overflow-y-auto">
      <VoltarHeader label="Voltar" onVoltar={onVoltar} />
      <div className="mx-auto max-w-2xl px-6 py-8 sm:px-10">
        <h1
          className="mb-1 flex items-center gap-2 text-xl text-[#1a1a1a]"
          style={{ fontFamily: "var(--font-serif-report)" }}
        >
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLOR.abaixo }} />
          Quebra de objeção
        </h1>
        <p className="mb-8 text-sm text-[#6b6a63]">Fora da faixa esperada há 3 quinzenas.</p>

        <div className="border-t border-[#e2e0da] pt-5">
          <p className="mb-3 text-sm text-[#1a1a1a]">
            Você quebrou a objeção em <span className="font-mono">{quebradas}</span> das{" "}
            <span className="font-mono">{LIGACOES.length}</span> últimas reuniões.
          </p>
          <EvidenciaLogTable />
        </div>

        <div className="border-t border-[#e2e0da] pt-5">
          <p className="text-sm text-[#1a1a1a]">
            Carlos: <span className="font-mono">{quebradas}</span> de{" "}
            <span className="font-mono">{LIGACOES.length}</span> quebradas · Referência do time:{" "}
            <span className="font-mono">{REFERENCIA_TIME_QUEBRADAS}</span> de{" "}
            <span className="font-mono">{LIGACOES.length}</span> quebradas
          </p>
        </div>

        <div className="space-y-4 border-t border-[#e2e0da] pt-5">
          <p className="text-[15px] leading-relaxed text-[#1a1a1a]">
            Reparei uma coisa nas suas próprias ligações que vale você perceber: quando você
            quebra a objeção (21/08, 01/09, 03/09), você faz algo que não faz nas outras — para
            de insistir no argumento inicial e faz uma pergunta pra entender o que está por trás
            do &quot;não&quot;. Na de 03/09, por exemplo, você trocou &quot;vou te mostrar os
            diferenciais&quot; por uma pergunta sobre um problema real da escola, e a partir dali
            a conversa virou.
          </p>
          <p className="text-[15px] leading-relaxed text-[#1a1a1a]">
            Nas que não quebram, o padrão se repete: você mantém o mesmo argumento do início ao
            fim, mesmo quando fica claro que a objeção não é sobre o que você está oferecendo.
          </p>
          <p className="text-[15px] leading-relaxed text-[#1a1a1a]">
            O interessante é que você já sabe fazer a coisa que funciona — só não está fazendo de
            propósito, toda vez.
          </p>
        </div>

        <div className="border-t border-[#e2e0da] pt-5">
          <Button onClick={onVerAcoes}>Ver o que pode ajudar</Button>
        </div>
      </div>
    </div>
  );
}

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

function TelaE3({ onVoltar, onOuvirExemplos }: { onVoltar: () => void; onOuvirExemplos: () => void }) {
  return (
    <div className="h-full overflow-y-auto">
      <VoltarHeader label="Voltar" onVoltar={onVoltar} />
      <div className="mx-auto max-w-2xl px-6 py-8 sm:px-10">
        <p className="mb-8 text-[15px] leading-relaxed text-[#1a1a1a]">
          Três caminhos que costumam ajudar nessa dimensão. Escolha o que fizer mais sentido pra
          você — não precisa ser todos.
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
          onClick={onOuvirExemplos}
        />
        <BlocoAcao
          titulo="Treinar o pitch com um colega"
          descricao="Simular a ligação com alguém ajuda a praticar a mudança de abordagem no meio da conversa, não só decorar resposta pronta pra objeção."
          rotuloBotao="Combinar um horário"
        />

        <p className="mt-8 border-t border-[#e2e0da] pt-5 text-sm leading-relaxed text-[#6b6a63]">
          Vale sempre alinhar com a Gabi que você vai focar em desenvolver essa habilidade essa
          quinzena — ajuda ela a acompanhar de perto.
        </p>
      </div>
    </div>
  );
}

function TelaE4({ onVoltar }: { onVoltar: () => void }) {
  return (
    <div className="h-full overflow-y-auto">
      <VoltarHeader label="Voltar" onVoltar={onVoltar} />
      <div className="mx-auto max-w-2xl px-6 py-8 sm:px-10">
        <h1 className="mb-8 text-xl text-[#1a1a1a]" style={{ fontFamily: "var(--font-serif-report)" }}>
          Duas ligações recentes que converteram nessa dimensão
        </h1>

        <div className="border-t border-[#e2e0da] pt-5">
          <p className="mb-3 text-sm text-[#1a1a1a]">
            Beatriz — <span className="font-mono">28/08</span>
          </p>
          <pre className="whitespace-pre-wrap border border-[#e2e0da] p-4 font-mono text-xs leading-relaxed text-[#1a1a1a]">
            {TRANSCRICAO_BEATRIZ}
          </pre>
        </div>

        <div className="mt-6 border-t border-[#e2e0da] pt-5">
          <p className="mb-3 text-sm text-[#1a1a1a]">
            Daniela — <span className="font-mono">30/08</span>
          </p>
          <pre className="whitespace-pre-wrap border border-[#e2e0da] p-4 font-mono text-xs leading-relaxed text-[#1a1a1a]">
            {TRANSCRICAO_DANIELA}
          </pre>
        </div>

        <p className="mt-6 border-t border-[#e2e0da] pt-5 text-sm leading-relaxed text-[#6b6a63]">
          É o mesmo padrão que apareceu nas suas ligações de 21/08, 01/09 e 03/09 — só que aqui
          elas fazem isso de forma consistente, ligação após ligação, não só às vezes.
        </p>
      </div>
    </div>
  );
}

export function CarlosJourney() {
  const [screen, setScreen] = useState<Screen>("e1");

  if (screen === "e1") return <TelaE1 onVerDetalhes={() => setScreen("e2")} />;
  if (screen === "e2") return <TelaE2 onVoltar={() => setScreen("e1")} onVerAcoes={() => setScreen("e3")} />;
  if (screen === "e3")
    return <TelaE3 onVoltar={() => setScreen("e2")} onOuvirExemplos={() => setScreen("e4")} />;
  return <TelaE4 onVoltar={() => setScreen("e3")} />;
}
