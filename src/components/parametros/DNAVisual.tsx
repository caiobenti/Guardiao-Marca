"use client";

import { useState, useRef } from "react";
import { saveRecord } from "@/lib/db";
import { BrandParameters } from "@/lib/types";

// ─── Opções ────────────────────────────────────────────────────────────────
const TYPOGRAPHY_OPTIONS = ["serif", "sans-serif", "monospace", "display"];
const IMAGE_STYLE_OPTIONS = ["clean", "bold", "organic", "minimal"];

const VALUE_LABELS: Record<string, string> = {
  serif: "Serif", "sans-serif": "Sans-serif", monospace: "Monospace", display: "Display",
  clean: "Clean", bold: "Bold", organic: "Organic", minimal: "Minimal",
};

// ─── Tipos ─────────────────────────────────────────────────────────────────
type SaveStatus = "idle" | "saving" | "saved" | "error";

interface Props {
  data?: Partial<BrandParameters>;
  userCode: string;
}

// ─── Componente ────────────────────────────────────────────────────────────
export function DNAVisual({ data, userCode }: Props) {
  const [palette, setPalette] = useState<string[]>(
    [...(data?.color_palette ?? []), "", "", ""].slice(0, 3)
  );
  const [typography, setTypography] = useState(data?.typography ?? "");
  const [imageStyle, setImageStyle] = useState(data?.image_style ?? "");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const isSaving = useRef(false);

  // ─── Save ───────────────────────────────────────────────────────────────
  async function handleSave() {
    if (isSaving.current) return;
    isSaving.current = true;
    setSaveStatus("saving");

    const { error } = await saveRecord("DB2 - brand_parameters", "user_code", userCode, {
      user_code: userCode,
      color_palette: palette.filter(c => c.trim() !== ""),
      typography,
      image_style: imageStyle,
    });

    isSaving.current = false;
    setSaveStatus(error ? "error" : "saved");
    setTimeout(() => setSaveStatus("idle"), 3000);
  }

  function updatePalette(index: number, value: string) {
    const next = [...palette];
    next[index] = value;
    setPalette(next);
  }

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-[10px] border border-[#e8e8e4]" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

      {/* Cabeçalho */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e8e4]">
        <h2 className="text-sm font-semibold text-gray-900">DNA Visual</h2>
        <div className="flex items-center gap-3">
          {saveStatus === "saving" && <span className="text-xs text-gray-400">Salvando...</span>}
          {saveStatus === "saved"  && <span className="text-xs text-[#1a6b5a]">✓ Salvo</span>}
          {saveStatus === "error"  && <span className="text-xs text-red-500">Erro ao salvar</span>}
          <button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="text-xs font-medium px-3 py-1.5 rounded-[8px] bg-[#1a6b5a] text-white hover:bg-[#155a4a] transition disabled:opacity-50"
          >
            Salvar
          </button>
        </div>
      </div>

      {/* Campos */}
      <div className="px-5 py-4 flex flex-col gap-4">

        {/* Paleta de cores */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Paleta de cores</label>
          {[0, 1, 2].map(i => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="color"
                value={palette[i] || "#ffffff"}
                onChange={e => updatePalette(i, e.target.value)}
                className="w-7 h-7 rounded cursor-pointer border border-[#e8e8e4] shrink-0"
              />
              <input
                type="text"
                placeholder={`Cor ${i + 1} — ex: #1a6b5a`}
                value={palette[i] || ""}
                onChange={e => updatePalette(i, e.target.value)}
                className="flex-1 rounded-[8px] border border-[#e8e8e4] px-3 py-1.5 text-sm text-gray-800 font-mono focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/30 focus:border-[#1a6b5a] transition placeholder:text-gray-300"
              />
            </div>
          ))}
        </div>

        {/* Tipografia */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Tipografia</label>
          <div className="flex gap-1.5 flex-wrap">
            {TYPOGRAPHY_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => setTypography(opt === typography ? "" : opt)}
                className={`px-3 py-1.5 rounded-[8px] text-sm border transition ${
                  typography === opt
                    ? "border-[#1a6b5a] bg-[#f0f7f5] text-[#1a6b5a] font-medium"
                    : "border-[#e8e8e4] text-gray-500 hover:bg-gray-50"
                }`}
              >
                {VALUE_LABELS[opt]}
              </button>
            ))}
          </div>
        </div>

        {/* Estilo de imagem */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Estilo de imagem</label>
          <div className="flex gap-1.5 flex-wrap">
            {IMAGE_STYLE_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => setImageStyle(opt === imageStyle ? "" : opt)}
                className={`px-3 py-1.5 rounded-[8px] text-sm border transition ${
                  imageStyle === opt
                    ? "border-[#1a6b5a] bg-[#f0f7f5] text-[#1a6b5a] font-medium"
                    : "border-[#e8e8e4] text-gray-500 hover:bg-gray-50"
                }`}
              >
                {VALUE_LABELS[opt]}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
