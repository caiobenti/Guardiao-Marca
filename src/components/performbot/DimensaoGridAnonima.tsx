"use client";

import { useMemo } from "react";
import { DIMENSOES, Dimensao, SDRS } from "./data";
import { BAND_BOTTOM, BAND_TOP, JITTER, TRACK_HEIGHT, yFor } from "./dimensaoScale";

function ColunaAnonima({ dimensao }: { dimensao: Dimensao }) {
  const pontos = useMemo(() => {
    const ordenados = [...SDRS].sort((a, b) => a.valores[dimensao] - b.valores[dimensao]);
    return ordenados.map((sdr, i) => ({
      sdr,
      valor: sdr.valores[dimensao],
      dx: JITTER[i % JITTER.length],
    }));
  }, [dimensao]);

  return (
    <div className="relative w-full border border-[#e2e0da]" style={{ height: TRACK_HEIGHT }}>
      <div
        className="absolute left-0 right-0 border-y border-dashed border-[#c9c6bd]"
        style={{ top: BAND_TOP, height: BAND_BOTTOM - BAND_TOP }}
      />
      {pontos.map(({ sdr, valor, dx }) =>
        sdr.id === "carlos" ? (
          <div
            key={sdr.id}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5"
            style={{ top: yFor(valor), left: "50%" }}
          >
            <span className="h-3 w-3 shrink-0 rounded-full border-2 border-[#1a1a1a] bg-[#1a1a1a]" />
            <span className="whitespace-nowrap font-mono text-[10px] font-medium text-[#1a1a1a]">
              Você
            </span>
          </div>
        ) : (
          <span
            key={sdr.id}
            className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9c6bd]"
            style={{ top: yFor(valor), left: `calc(50% + ${dx}px)` }}
          />
        )
      )}
    </div>
  );
}

export function DimensaoGridAnonima() {
  return (
    <div className="grid grid-cols-5 gap-4">
      {DIMENSOES.map((d) => (
        <div key={d.id} className="min-w-0">
          <p className="mb-3 truncate text-center text-xs text-[#1a1a1a]">{d.label}</p>
          <ColunaAnonima dimensao={d.id} />
        </div>
      ))}
    </div>
  );
}
