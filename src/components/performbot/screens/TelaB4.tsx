"use client";

import { useState } from "react";
import { BotMessage, ChatBackdrop } from "../ChatShell";
import { PillButton } from "../ui";

export function TelaB4({ onReiniciar }: { onReiniciar: () => void }) {
  const [decisao, setDecisao] = useState<"manter" | "encerrar" | null>(null);

  return (
    <ChatBackdrop>
      <BotMessage caption="15 dias depois">
        <p className="mb-3 font-semibold text-gray-900">Boa notícia sobre o Carlos 🎉</p>
        <p className="mb-3 leading-relaxed">
          Vi que ele e a Beatriz trocaram bastante no Slack essa quinzena — ela deu dicas
          específicas sobre a objeção de autoridade, comentou em um huddle do time sobre como
          conduzir esse tipo de ligação, e trocou feedback com ele depois de pelo menos 2
          reuniões dele.
        </p>
        <p className="mb-3 leading-relaxed">
          Carlos já aplicou isso: nas últimas 3 ligações, quebrou a objeção na{" "}
          <span className="font-semibold">2ª tentativa</span>, dentro da faixa esperada.
        </p>
        <p className="leading-relaxed">
          O plano de buddy começou a dar resultado. Ainda vale monitorar de perto — é sinal
          recente, não confirmado em definitivo.
        </p>

        {decisao ? (
          <div className="mt-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {decisao === "manter"
              ? "✓ Acompanhamento estendido por mais 15 dias."
              : "✓ Registrado como objetivo atingido. Ciclo do Carlos encerrado."}
          </div>
        ) : (
          <div className="mt-5 flex flex-wrap gap-3">
            <PillButton variant="secondary" onClick={() => setDecisao("manter")}>
              Manter o acompanhamento por mais 15 dias
            </PillButton>
            <PillButton variant="primary" onClick={() => setDecisao("encerrar")}>
              Encerrar, objetivo atingido
            </PillButton>
          </div>
        )}

        {decisao && (
          <div className="mt-4">
            <PillButton variant="ghost" onClick={onReiniciar}>
              Reiniciar protótipo
            </PillButton>
          </div>
        )}
      </BotMessage>
    </ChatBackdrop>
  );
}
