"use client";

import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui";

const TEXTO_PADRAO =
  "Quero testar uma nova abordagem de colocar um buddy (a Beatriz) para acompanhar ele. Não terei tempo livre essa semana para acompanhar o Carlos de perto.";

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
      <div className="flex items-center gap-3 border-b border-[#e2e0da] px-6 py-3.5">
        <button
          onClick={onVoltar}
          className="flex items-center gap-1.5 text-sm text-[#6b6a63] hover:text-[#1a1a1a]"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Voltar
        </button>
      </div>
      <div className="mx-auto max-w-2xl px-6 py-8 sm:px-10">
        <h1 className="mb-6 text-xl text-[#1a1a1a]" style={{ fontFamily: "var(--font-serif-report)" }}>
          O que você quer ajustar?
        </h1>

        <div className="space-y-3 border-t border-[#e2e0da] pt-5">
          <label className="flex cursor-pointer items-start gap-3 py-1">
            <input
              type="radio"
              name="motivo"
              checked={motivo === "diagnostico"}
              onChange={() => handleMotivo("diagnostico")}
              className="mt-0.5 accent-[#1a1a1a]"
            />
            <span className="text-sm text-[#1a1a1a]">O diagnóstico não está certo</span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 py-1">
            <input
              type="radio"
              name="motivo"
              checked={motivo === "outra_acao"}
              onChange={() => handleMotivo("outra_acao")}
              className="mt-0.5 accent-[#1a1a1a]"
            />
            <span className="text-sm text-[#1a1a1a]">
              Concordo com o diagnóstico, mas prefiro outra ação
            </span>
          </label>
        </div>

        <div className="border-t border-[#e2e0da] pt-5">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder={
              motivo === "diagnostico"
                ? "Descreva por que o diagnóstico não está certo..."
                : "Descreva a ação alternativa..."
            }
            rows={5}
            className="w-full resize-none border border-[#e2e0da] px-4 py-3 text-sm leading-relaxed text-[#1a1a1a] focus:border-[#1a1a1a] focus:outline-none"
          />
        </div>

        <div className="border-t border-[#e2e0da] pt-5">
          <Button
            onClick={() => onConfirmar(texto, motivo)}
            className={texto.trim().length === 0 ? "pointer-events-none opacity-40" : ""}
          >
            Confirmar plano alternativo
          </Button>
        </div>
      </div>
    </div>
  );
}
