"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { BrandParameters } from "@/lib/types";

const TYPOGRAPHY_OPTIONS = [
  { value: "serif", label: "Serif — elegante e clássico" },
  { value: "sans-serif", label: "Sans-serif — moderno e limpo" },
  { value: "monospace", label: "Monospace — técnico e preciso" },
  { value: "display", label: "Display — expressivo e marcante" },
];

const IMAGE_STYLE_OPTIONS = [
  { value: "clean", label: "Clean — minimalista e amplo" },
  { value: "bold", label: "Bold — impactante e vibrante" },
  { value: "organic", label: "Organic — natural e autêntico" },
  { value: "minimal", label: "Minimal — espaço negativo e foco" },
];

interface Props {
  data?: Partial<BrandParameters>;
  userCode: string;
}

export function DNAVisual({ data, userCode }: Props) {
  const initialPalette = data?.color_palette ?? ["", "", ""];
  const [palette, setPalette] = useState<string[]>(
    initialPalette.length >= 3 ? initialPalette : [...initialPalette, "", "", ""].slice(0, 3)
  );
  const [typography, setTypography] = useState(data?.typography ?? "");
  const [imageStyle, setImageStyle] = useState(data?.image_style ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updatePalette(index: number, value: string) {
    const next = [...palette];
    next[index] = value;
    setPalette(next);
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    const cleanPalette = palette.filter((c) => c.trim() !== "");

    const payload = {
      user_code: userCode,
      color_palette: cleanPalette,
      typography,
      image_style: imageStyle,
      update_at: new Date().toISOString(),
    };

    await supabase
      .from("DB2 - brand_parameters")
      .upsert(payload, { onConflict: "user_code" });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div
      className="bg-white rounded-[10px] p-6 border border-[#e8e8e4]"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
    >
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-900">DNA Visual</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          Paleta de cores, tipografia e elementos visuais da marca.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Paleta de Cores */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-800">Paleta de Cores</label>
          <p className="text-xs text-gray-400 -mt-1">Cores principais da identidade visual (hex).</p>
          <div className="flex flex-col gap-2 mt-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="color"
                  value={palette[i] || "#ffffff"}
                  onChange={(e) => updatePalette(i, e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border border-[#e8e8e4]"
                />
                <input
                  type="text"
                  placeholder={`Cor ${i + 1} — ex: #1a6b5a`}
                  value={palette[i] || ""}
                  onChange={(e) => updatePalette(i, e.target.value)}
                  className="flex-1 rounded-[8px] border border-[#e8e8e4] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/30 focus:border-[#1a6b5a] transition placeholder:text-gray-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Tipografia */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-800">Tipografia</label>
          <p className="text-xs text-gray-400 -mt-1">Estilo de fonte predominante na marca.</p>
          <select
            value={typography}
            onChange={(e) => setTypography(e.target.value)}
            className="w-full rounded-[8px] border border-[#e8e8e4] bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/30 focus:border-[#1a6b5a] transition"
          >
            <option value="" disabled>Selecione...</option>
            {TYPOGRAPHY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Estilo de Imagem */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-800">Estilo de Imagem</label>
          <p className="text-xs text-gray-400 -mt-1">Estética visual das imagens e fotografias.</p>
          <div className="grid grid-cols-2 gap-2">
            {IMAGE_STYLE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-2 p-3 rounded-[8px] border cursor-pointer transition ${
                  imageStyle === opt.value
                    ? "border-[#1a6b5a] bg-[#f0f7f5]"
                    : "border-[#e8e8e4] hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="image_style"
                  value={opt.value}
                  checked={imageStyle === opt.value}
                  onChange={() => setImageStyle(opt.value)}
                  className="accent-[#1a6b5a]"
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-[#e8e8e4] flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-[8px] bg-[#1a6b5a] text-white text-sm font-medium hover:bg-[#155a4a] transition disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar DNA Visual"}
          </button>
          {saved && (
            <span className="text-sm text-[#1a6b5a] font-medium">✓ Salvo</span>
          )}
        </div>
      </div>
    </div>
  );
}
