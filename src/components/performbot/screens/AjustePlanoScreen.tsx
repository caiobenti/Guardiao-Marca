"use client";

import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { PillButton } from "../ui";

const TEXTO_PADRAO =
  "Essa quinzena estou dedicada ao projeto X e não vou conseguir fazer o role-play 1:1. Vou colocar a Beatriz (top performer do time) como buddy do Carlos — pedir pra ela acompanhar algumas ligações e trocar dicas via Slack.";

type Motivo = "diagnostico" | "outra_acao";

export function AjustePlanoScreen({
  onVoltar,
  onConfirmar,
}: {
  onVoltar: () => void;
  onConfirmar: (texto: string, motivo: Motivo) => void;
}) {
  const [motivo, setMotivo] = useState<Motivo>("outra_acao");
  const [texto, setTexto] = useState(TEXTO_PADRAO);

  function handleMotivo(next: Motivo) {
    setMotivo(next);
    setTexto(next === "outra_acao" ? TEXTO_PADRAO : "");
  }

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
        <h1 className="mb-6 text-xl font-semibold text-gray-900">O que você quer ajustar?</h1>

        <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-3">
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 px-4 py-3 has-[:checked]:border-[#4f46e5] has-[:checked]:bg-[#eef0fc]">
              <input
                type="radio"
                name="motivo"
                checked={motivo === "diagnostico"}
                onChange={() => handleMotivo("diagnostico")}
                className="mt-0.5"
              />
              <span className="text-sm text-gray-800">O diagnóstico não está certo</span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 px-4 py-3 has-[:checked]:border-[#4f46e5] has-[:checked]:bg-[#eef0fc]">
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
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm leading-relaxed text-gray-800 focus:border-[#4f46e5] focus:outline-none focus:ring-1 focus:ring-[#4f46e5]"
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
