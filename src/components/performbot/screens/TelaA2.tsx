"use client";

import { useMemo, useState } from "react";
import {
  DIMENSOES,
  Dimensao,
  FAIXA_MAX,
  FAIXA_MIN,
  SDR,
  SDRS,
  statusValor,
  valorAcumulado,
} from "../data";

const SCALE_MIN = 45;
const SCALE_MAX = 150;
const TRACK_HEIGHT = 340;

function yFor(value: number) {
  const clamped = Math.min(SCALE_MAX, Math.max(SCALE_MIN, value));
  const ratio = (clamped - SCALE_MIN) / (SCALE_MAX - SCALE_MIN);
  return TRACK_HEIGHT - ratio * TRACK_HEIGHT;
}

const STATUS_STYLE: Record<"dentro" | "abaixo" | "acima", { bg: string; border: string; text: string }> = {
  dentro: { bg: "bg-emerald-500", border: "border-emerald-600", text: "dentro do esperado" },
  abaixo: { bg: "bg-red-500", border: "border-red-600", text: "abaixo do esperado" },
  acima: { bg: "bg-amber-400", border: "border-amber-500", text: "acima do esperado" },
};

// Pequeno deslocamento horizontal determinístico pra bolinhas próximas não
// ficarem exatamente uma sobre a outra dentro da coluna.
const JITTER = [0, -20, 20, -10, 10, -30];

function DimensionColumn({
  dimensao,
  recorte,
  selectedId,
  onSelect,
}: {
  dimensao: Dimensao;
  recorte: "quinzena" | "acumulado";
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const bandTop = yFor(FAIXA_MAX);
  const bandBottom = yFor(FAIXA_MIN);

  const pontos = useMemo(() => {
    const ordenados = [...SDRS].sort(
      (a, b) => a.valores[dimensao] - b.valores[dimensao]
    );
    return ordenados.map((sdr, i) => {
      const raw = sdr.valores[dimensao];
      const valor = recorte === "quinzena" ? raw : valorAcumulado(raw);
      return { sdr, valor, dx: JITTER[i % JITTER.length] };
    });
  }, [dimensao, recorte]);

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-full rounded-lg bg-gray-50"
        style={{ height: TRACK_HEIGHT }}
      >
        <div
          className="absolute left-0 right-0 border-y border-dashed border-gray-300 bg-emerald-50/70"
          style={{ top: bandTop, height: bandBottom - bandTop }}
        />
        {pontos.map(({ sdr, valor, dx }) => {
          const status = statusValor(valor);
          const style = STATUS_STYLE[status];
          const isSelected = selectedId === sdr.id;
          return (
            <button
              key={sdr.id}
              onClick={() => onSelect(sdr.id)}
              title={`${sdr.nome}: ${valor}`}
              className={`absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[11px] font-bold text-white shadow transition-all ${style.bg} ${
                isSelected
                  ? "z-10 ring-4 ring-[#4338ca] ring-offset-1"
                  : selectedId
                  ? "opacity-30"
                  : "opacity-100"
              }`}
              style={{
                top: yFor(valor),
                left: `calc(50% + ${dx}px)`,
              }}
            >
              {sdr.inicial}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TelaA2({
  onVoltarMensagem,
  onVerEvidenciaCarlos,
}: {
  onVoltarMensagem: () => void;
  onVerEvidenciaCarlos: () => void;
}) {
  const [recorte, setRecorte] = useState<"quinzena" | "acumulado">("quinzena");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected: SDR | undefined = SDRS.find((s) => s.id === selectedId);

  return (
    <div className="flex h-full min-h-0">
      <div className="min-w-0 flex-1 overflow-y-auto px-6 py-8 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <button
            onClick={onVoltarMensagem}
            className="mb-4 text-sm font-medium text-gray-500 hover:text-gray-800"
          >
            ← Voltar para a mensagem
          </button>

          <div className="mb-1 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Time da Gabi — visão por dimensão
            </h1>
            <div className="inline-flex rounded-full border border-gray-300 bg-white p-1 text-sm">
              {(["quinzena", "acumulado"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setRecorte(opt)}
                  className={`rounded-full px-3.5 py-1.5 font-medium transition-colors ${
                    recorte === opt
                      ? "bg-[#4338ca] text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {opt === "quinzena" ? "Quinzena atual" : "Acumulado do ciclo"}
                </button>
              ))}
            </div>
          </div>

          <p className="mb-6 text-sm text-gray-500">
            Índice onde 100 = exatamente o esperado. Faixa sombreada = dentro do esperado
            (85–115).
          </p>

          <div className="mb-6 flex flex-wrap items-center gap-5 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> dentro do esperado
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> acima do esperado
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> abaixo do esperado
            </span>
          </div>

          <div className="grid grid-cols-5 gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            {DIMENSOES.map((d) => (
              <div key={d.id} className="min-w-0">
                <p className="mb-3 truncate text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {d.label}
                </p>
                <DimensionColumn
                  dimensao={d.id}
                  recorte={recorte}
                  selectedId={selectedId}
                  onSelect={(id) => setSelectedId(id === selectedId ? null : id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {selected && (
        <aside className="w-80 shrink-0 overflow-y-auto border-l border-gray-200 bg-white px-6 py-8">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                SDR selecionado
              </p>
              <h2 className="text-lg font-semibold text-gray-900">{selected.nome}</h2>
            </div>
            <button
              onClick={() => setSelectedId(null)}
              className="text-gray-400 hover:text-gray-700"
              aria-label="Fechar painel"
            >
              ✕
            </button>
          </div>

          <ul className="space-y-2.5">
            {DIMENSOES.map((d) => {
              const raw = selected.valores[d.id];
              const valor = recorte === "quinzena" ? raw : valorAcumulado(raw);
              const status = statusValor(valor);
              const style = STATUS_STYLE[status];
              const mostrarEvidencia = selected.id === "carlos" && d.id === "quebraObjecao";
              return (
                <li
                  key={d.id}
                  className="rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-gray-800">{d.label}</span>
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${style.bg}`}
                      title={style.text}
                    />
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Índice {valor} · {style.text}
                  </p>
                  {mostrarEvidencia && (
                    <button
                      onClick={onVerEvidenciaCarlos}
                      className="mt-2 text-xs font-semibold text-[#4338ca] underline underline-offset-2 hover:text-[#372da3]"
                    >
                      Ver evidência →
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </aside>
      )}
    </div>
  );
}
