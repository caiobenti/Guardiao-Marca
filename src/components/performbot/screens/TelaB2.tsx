"use client";

import { useState } from "react";
import { PillButton } from "../ui";

const TEXTO_PADRAO =
  "Essa quinzena estou dedicada ao projeto X e não vou conseguir fazer o role-play 1:1. Vou colocar a Beatriz (top performer do time) como buddy do Carlos — pedir pra ela acompanhar algumas ligações e trocar dicas via Slack.";

type Motivo = "diagnostico" | "outra_acao";

export function TelaB2({
  onConfirmar,
}: {
  onConfirmar: (texto: string, motivo: Motivo) => void;
}) {
  const [motivo, setMotivo] = useState<Motivo>("outra_acao");
  const [texto, setTexto] = useState(TEXTO_PADRAO);

  function handleMotivo(next: Motivo) {
    setMotivo(next);
    setTexto(next === "outra_acao" ? TEXTO_PADRAO : "");
  }

  return (
    <div className="h-full overflow-y-auto px-6 py-8 sm:px-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-xl font-semibold text-gray-900">O que você quer ajustar?</h1>

        <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-3">
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 px-4 py-3 has-[:checked]:border-[#4338ca] has-[:checked]:bg-[#eef0fc]">
              <input
                type="radio"
                name="motivo"
                checked={motivo === "diagnostico"}
                onChange={() => handleMotivo("diagnostico")}
                className="mt-0.5"
              />
              <span className="text-sm text-gray-800">O diagnóstico não está certo</span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 px-4 py-3 has-[:checked]:border-[#4338ca] has-[:checked]:bg-[#eef0fc]">
              <input
                type="radio"
                name="motivo"
                checked={motivo === "outra_acao"}
                onChange={() => handleMotivo("outra_acao")}
                className="mt-0.5"
              />
              <span className="text-sm text-gray-800">
                Concordo com o diagnóstico, mas prefiro outra ação
              </span>
            </label>
          </div>

          <div>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder={
                motivo === "diagnostico"
                  ? "Descreva por que o diagnóstico não está certo..."
                  : "Descreva a ação alternativa..."
              }
              rows={5}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm leading-relaxed text-gray-800 focus:border-[#4338ca] focus:outline-none focus:ring-1 focus:ring-[#4338ca]"
            />
          </div>

          <PillButton
            variant="primary"
            onClick={() => onConfirmar(texto, motivo)}
            className={texto.trim().length === 0 ? "pointer-events-none opacity-40" : ""}
          >
            Confirmar plano alternativo
          </PillButton>
        </div>
      </div>
    </div>
  );
}
