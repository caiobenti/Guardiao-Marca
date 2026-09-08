"use client";

import { ArrowLeft } from "lucide-react";
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
import { DecisoesPendentesSection } from "../DecisoesPendentesSection";
import { STATUS_COLOR } from "../theme";

const SCALE_MIN = 45;
const SCALE_MAX = 150;
const TRACK_HEIGHT = 300;

function yFor(value: number) {
  const clamped = Math.min(SCALE_MAX, Math.max(SCALE_MIN, value));
  const ratio = (clamped - SCALE_MIN) / (SCALE_MAX - SCALE_MIN);
  return TRACK_HEIGHT - ratio * TRACK_HEIGHT;
}

const STATUS_TEXT: Record<"dentro" | "abaixo" | "acima", string> = {
  dentro: "dentro do esperado",
  abaixo: "abaixo do esperado",
  acima: "acima do esperado",
};

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
    const ordenados = [...SDRS].sort((a, b) => a.valores[dimensao] - b.valores[dimensao]);
    return ordenados.map((sdr, i) => {
      const raw = sdr.valores[dimensao];
      const valor = recorte === "quinzena" ? raw : valorAcumulado(raw);
      return { sdr, valor, dx: JITTER[i % JITTER.length] };
    });
  }, [dimensao, recorte]);

  return (
    <div className="relative w-full border border-[#e2e0da]" style={{ height: TRACK_HEIGHT }}>
      <div
        className="absolute left-0 right-0 border-y border-dashed border-[#c9c6bd]"
        style={{ top: bandTop, height: bandBottom - bandTop }}
      />
      {pontos.map(({ sdr, valor, dx }) => {
        const status = statusValor(valor);
        const isSelected = selectedId === sdr.id;
        return (
          <button
            key={sdr.id}
            onClick={() => onSelect(sdr.id)}
            title={`${sdr.nome}: ${valor}`}
            className={`absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-mono text-[11px] font-medium text-white transition-opacity ${
              isSelected ? "ring-2 ring-[#1a1a1a] ring-offset-1" : selectedId ? "opacity-30" : "opacity-100"
            }`}
            style={{ top: yFor(valor), left: `calc(50% + ${dx}px)`, background: STATUS_COLOR[status] }}
          >
            {sdr.inicial}
          </button>
        );
      })}
    </div>
  );
}

export function DashboardScreen({
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
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-3 border-b border-[#e2e0da] px-6 py-3.5">
        <button
          onClick={onVoltarMensagem}
          className="flex items-center gap-1.5 text-sm text-[#6b6a63] hover:text-[#1a1a1a]"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Voltar para a mensagem
        </button>
      </div>

      <div className="flex h-full min-h-0">
        <div className="min-w-0 flex-1 overflow-y-auto px-6 py-6 sm:px-10">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 border-b border-[#e2e0da] pb-6">
              <DecisoesPendentesSection onRevisarCarlos={onVerEvidenciaCarlos} />
            </div>

            <div className="mb-1 flex flex-wrap items-center justify-between gap-4">
              <h1
                className="text-xl text-[#1a1a1a]"
                style={{ fontFamily: "var(--font-serif-report)" }}
              >
                Time da Gabi — visão por dimensão
              </h1>
              <div className="flex text-sm">
                {(["quinzena", "acumulado"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setRecorte(opt)}
                    className={`border border-[#1a1a1a] px-3.5 py-1.5 -ml-px first:ml-0 ${
                      recorte === opt ? "bg-[#1a1a1a] text-[#fdfdfc]" : "text-[#1a1a1a] hover:bg-[#1a1a1a]/5"
                    }`}
                  >
                    {opt === "quinzena" ? "Quinzena atual" : "Acumulado do ciclo"}
                  </button>
                ))}
              </div>
            </div>

            <p className="mb-6 text-sm text-[#6b6a63]">
              Índice onde 100 = exatamente o esperado. Faixa sombreada = dentro do esperado
              (85–115).
            </p>

            <div className="mb-6 flex flex-wrap items-center gap-5 text-xs text-[#6b6a63]">
              <span className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: STATUS_COLOR.dentro }}
                />{" "}
                dentro do esperado
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: STATUS_COLOR.acima }}
                />{" "}
                acima do esperado
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: STATUS_COLOR.abaixo }}
                />{" "}
                abaixo do esperado
              </span>
            </div>

            <div>
              <div className="mb-2 grid grid-cols-5 gap-4">
                <div />
                <div className="col-span-4 border-b border-[#e2e0da] pb-1.5 text-center text-xs text-[#6b6a63]">
                  Competências · 4 dimensões
                </div>
              </div>
              <div className="grid grid-cols-5 gap-4">
                {DIMENSOES.map((d) => (
                  <div key={d.id} className="min-w-0">
                    <p className="truncate text-center text-xs text-[#1a1a1a]">{d.label}</p>
                    <p className="mb-3 h-3.5 text-center font-mono text-[10px] text-[#6b6a63]">
                      {d.id === "resultado" ? "(meta 10 reuniões/semana)" : ""}
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
        </div>

        {selected && (
          <aside className="w-80 shrink-0 overflow-y-auto border-l border-[#e2e0da] px-6 py-8">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-xs text-[#6b6a63]">SDR selecionado</p>
                <h2 className="text-lg text-[#1a1a1a]" style={{ fontFamily: "var(--font-serif-report)" }}>
                  {selected.nome}
                </h2>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="text-[#6b6a63] hover:text-[#1a1a1a]"
                aria-label="Fechar painel"
              >
                ✕
              </button>
            </div>

            <ul>
              {DIMENSOES.map((d) => {
                const raw = selected.valores[d.id];
                const valor = recorte === "quinzena" ? raw : valorAcumulado(raw);
                const status = statusValor(valor);
                const mostrarEvidencia = selected.id === "carlos" && d.id === "quebraObjecao";
                return (
                  <li key={d.id} className="border-t border-[#e2e0da] py-2.5 first:border-t-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-[#1a1a1a]">{d.label}</span>
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: STATUS_COLOR[status] }}
                        title={STATUS_TEXT[status]}
                      />
                    </div>
                    <p className="mt-0.5 text-xs text-[#6b6a63]">
                      Índice <span className="font-mono">{valor}</span> · {STATUS_TEXT[status]}
                    </p>
                    {mostrarEvidencia && (
                      <button
                        onClick={onVerEvidenciaCarlos}
                        className="mt-2 text-xs text-[#1a1a1a] underline underline-offset-2"
                      >
                        Ver evidência
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
}
