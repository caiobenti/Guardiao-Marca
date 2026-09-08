"use client";

import { useState } from "react";
import { Button } from "./ui";

export function MarcarReuniaoModal({
  nome,
  onConfirmar,
  onFechar,
}: {
  nome: string;
  onConfirmar: (dataFormatada: string) => void;
  onFechar: () => void;
}) {
  const [data, setData] = useState("");
  const [hora, setHora] = useState("09:00");

  function confirmar() {
    if (!data) return;
    const [, mes, dia] = data.split("-");
    onConfirmar(`${dia}/${mes} às ${hora}`);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a1a]/30"
      onClick={onFechar}
    >
      <div
        className="w-full max-w-sm border border-[#1a1a1a] bg-[#fdfdfc] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-5 text-lg text-[#1a1a1a]" style={{ fontFamily: "var(--font-serif-report)" }}>
          Marcar 1:1 — {nome}
        </p>

        <label className="mb-4 block text-sm text-[#1a1a1a]">
          Data
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="mt-1 w-full border border-[#e2e0da] px-3 py-2 font-mono text-sm text-[#1a1a1a] focus:border-[#1a1a1a] focus:outline-none"
          />
        </label>

        <label className="mb-6 block text-sm text-[#1a1a1a]">
          Horário
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="mt-1 w-full border border-[#e2e0da] px-3 py-2 font-mono text-sm text-[#1a1a1a] focus:border-[#1a1a1a] focus:outline-none"
          />
        </label>

        <div className="flex gap-2">
          <Button onClick={confirmar} className={!data ? "pointer-events-none opacity-40" : ""}>
            Confirmar
          </Button>
          <Button variant="secondary" onClick={onFechar}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
