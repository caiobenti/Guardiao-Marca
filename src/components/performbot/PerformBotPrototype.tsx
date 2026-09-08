"use client";

import { useState } from "react";
import { TelaA1 } from "./screens/TelaA1";
import { TelaA2 } from "./screens/TelaA2";
import { TelaB1 } from "./screens/TelaB1";
import { TelaB2 } from "./screens/TelaB2";
import { TelaB3 } from "./screens/TelaB3";
import { TelaB4 } from "./screens/TelaB4";

type Sequencia = "A" | "B";
type TelaA = "A1" | "A2";
type TelaB = "B1" | "B2" | "B3" | "B4";

const MSG_ACEITE_ORIGINAL =
  "Combinado! Vou acompanhar as sessões de role-play com você e volto com uma leitura em 15 dias.";

const MSG_BUDDY =
  "Combinado. Vou acompanhar as interações entre Carlos e Beatriz essa quinzena e volto com uma leitura em 15 dias.";

const MSG_DIAGNOSTICO =
  "Entendido. Vou reavaliar o diagnóstico com base no que você trouxe e ajusto a leitura da próxima quinzena.";

export function PerformBotPrototype() {
  const [sequencia, setSequencia] = useState<Sequencia>("A");
  const [telaA, setTelaA] = useState<TelaA>("A1");
  const [telaB, setTelaB] = useState<TelaB>("B1");
  const [mensagemB3, setMensagemB3] = useState(MSG_BUDDY);
  const [mostrarContinuarB4, setMostrarContinuarB4] = useState(true);

  function irParaSequenciaA() {
    setSequencia("A");
    setTelaA("A1");
  }

  function irParaSequenciaB() {
    setSequencia("B");
    setTelaB("B1");
  }

  function confirmarAjuste(_texto: string, motivo: "diagnostico" | "outra_acao") {
    if (motivo === "outra_acao") {
      setMensagemB3(MSG_BUDDY);
      setMostrarContinuarB4(true);
    } else {
      setMensagemB3(MSG_DIAGNOSTICO);
      setMostrarContinuarB4(false);
    }
    setTelaB("B3");
  }

  function aceitarPlanoOriginal() {
    setMensagemB3(MSG_ACEITE_ORIGINAL);
    setMostrarContinuarB4(false);
    setTelaB("B3");
  }

  return (
    <div className="flex h-full min-h-screen flex-col">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-gray-800 bg-[#14161f] px-5 text-xs text-gray-300">
        <span className="font-medium tracking-wide text-gray-400">
          PerformBot · Protótipo navegável
        </span>
        <div className="flex gap-1.5">
          <button
            onClick={irParaSequenciaA}
            className={`rounded-full px-3 py-1 font-medium transition-colors ${
              sequencia === "A" ? "bg-white text-gray-900" : "text-gray-300 hover:bg-white/10"
            }`}
          >
            Sequência A — Visão do time
          </button>
          <button
            onClick={irParaSequenciaB}
            className={`rounded-full px-3 py-1 font-medium transition-colors ${
              sequencia === "B" ? "bg-white text-gray-900" : "text-gray-300 hover:bg-white/10"
            }`}
          >
            Sequência B — Coaching do Carlos
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        {sequencia === "A" && telaA === "A1" && (
          <TelaA1
            onRevisarCarlos={irParaSequenciaB}
            onVerVisaoGeral={() => setTelaA("A2")}
          />
        )}
        {sequencia === "A" && telaA === "A2" && (
          <TelaA2
            onVoltarMensagem={() => setTelaA("A1")}
            onVerEvidenciaCarlos={irParaSequenciaB}
          />
        )}

        {sequencia === "B" && telaB === "B1" && (
          <TelaB1 onAceitar={aceitarPlanoOriginal} onAjustar={() => setTelaB("B2")} />
        )}
        {sequencia === "B" && telaB === "B2" && <TelaB2 onConfirmar={confirmarAjuste} />}
        {sequencia === "B" && telaB === "B3" && (
          <TelaB3
            mensagem={mensagemB3}
            onContinuar={mostrarContinuarB4 ? () => setTelaB("B4") : undefined}
            onReiniciar={irParaSequenciaB}
          />
        )}
        {sequencia === "B" && telaB === "B4" && <TelaB4 onReiniciar={irParaSequenciaB} />}
      </div>
    </div>
  );
}
