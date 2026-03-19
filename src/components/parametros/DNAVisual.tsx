"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { BrandParameters } from "@/lib/types";

const TYPOGRAPHY_OPTIONS = ["serif", "sans-serif", "monospace", "display"];
const IMAGE_STYLE_OPTIONS = ["clean", "bold", "organic", "minimal"];
const LABELS: Record<string, string> = {
  serif: "Serif", "sans-serif": "Sans-serif", monospace: "Monospace", display: "Display",
  clean: "Clean", bold: "Bold", organic: "Organic", minimal: "Minimal",
};

interface Props {
  data?: Partial<BrandParameters>;
  userCode: string;
}

type SaveStatus = "idle" | "pending" | "saving" | "saved";

export function DNAVisual({ data, userCode }: Props) {
  const [editing, setEditing] = useState(false);
  const initialPalette = data?.color_palette ?? [];
  const [palette, setPalette] = useState<string[]>(
    [...initialPalette, "", "", ""].slice(0, 3)
  );
  const [typography, setTypography] = useState(data?.typography ?? "");
  const [imageStyle, setImageStyle] = useState(data?.image_style ?? "");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [undoData, setUndoData] = useState<typeof data>(undefined);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDirty = useRef(false);

  useEffect(() => {
    if (!editing) return;
    if (!isDirty.current) { isDirty.current = true; return; }

    setSaveStatus("pending");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSaveStatus("saving");
      setUndoData(data);
      await supabase.from("DB2 - brand_parameters").upsert({
        user_code: userCode,
        color_palette: palette.filter(c => c.trim() !== ""),
        typography,
        image_style: imageStyle,
        update_at: new Date().toISOString(),
      }, { onConflict: "user_code" });
      setSaveStatus("saved");
      isDirty.current = false;
      setTimeout(() => setSaveStatus("idle"), 4000);
    }, 1500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [palette, typography, imageStyle]);

  function updatePalette(index: number, value: string) {
    const next = [...palette];
    next[index] = value;
    setPalette(next);
  }

  const cleanPalette = palette.filter(c => c.trim() !== "");
  const hasValues = cleanPalette.length > 0 || typography || imageStyle;

  return (
    <div className="bg-white rounded-[10px] border border-[#e8e8e4]" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e8e4]">
        <h2 className="text-sm font-semibold text-gray-900">DNA Visual</h2>
        <div className="flex items-center gap-3">
          {saveStatus === "pending" && <span className="text-xs text-amber-500">● não salvo</span>}
          {saveStatus === "saving" && <span className="text-xs text-gray-400">Salvando...</span>}
          {saveStatus === "saved" && (
            <span className="text-xs text-[#1a6b5a]">
              ✓ Salvo
              {undoData && (
                <button onClick={async () => {
                  await supabase.from("DB2 - brand_parameters").upsert({
                    user_code: userCode,
                    color_palette: undoData?.color_palette ?? [],
                    typography: undoData?.typography ?? "",
                    image_style: undoData?.image_style ?? "",
                    update_at: new Date().toISOString(),
                  }, { onConflict: "user_code" });
                  setPalette([...(undoData?.color_palette ?? []), "", "", ""].slice(0, 3));
                  setTypography(undoData?.typography ?? "");
                  setImageStyle(undoData?.image_style ?? "");
                  setSaveStatus("idle");
                  setUndoData(undefined);
                }} className="underline text-gray-400 hover:text-gray-600 ml-2 text-xs">desfazer</button>
              )}
            </span>
          )}
          <button onClick={() => setEditing(!editing)} className="text-xs font-medium text-[#1a6b5a] hover:underline">
            {editing ? "Fechar" : "Editar"}
          </button>
        </div>
      </div>

      {/* Summary */}
      {!editing && (
        <div className="px-5 py-4">
          {hasValues ? (
            <div className="flex flex-col gap-2">
              {cleanPalette.length > 0 && (
                <div className="flex gap-2 items-center">
                  {cleanPalette.map((cor, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full border border-[#e8e8e4]" style={{ backgroundColor: cor }} />
                      <span className="text-xs text-gray-400 font-mono">{cor}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-1.5">
                {typography && <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{LABELS[typography] ?? typography}</span>}
                {imageStyle && <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{LABELS[imageStyle] ?? imageStyle}</span>}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-300">Nenhum dado configurado ainda.</p>
          )}
        </div>
      )}

      {/* Edit mode */}
      {editing && (
        <div className="px-5 py-4 flex flex-col gap-4">
          {/* Cores */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Paleta de cores</label>
            {[0, 1, 2].map(i => (
              <div key={i} className="flex items-center gap-2">
                <input type="color" value={palette[i] || "#ffffff"} onChange={e => updatePalette(i, e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer border border-[#e8e8e4]" />
                <input type="text" placeholder={`Cor ${i + 1}`} value={palette[i] || ""}
                  onChange={e => updatePalette(i, e.target.value)}
                  className="flex-1 rounded-[8px] border border-[#e8e8e4] px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/30 focus:border-[#1a6b5a] transition placeholder:text-gray-300" />
              </div>
            ))}
          </div>

          {/* Tipografia */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tipografia</label>
            <div className="flex gap-1.5 flex-wrap">
              {TYPOGRAPHY_OPTIONS.map(opt => (
                <button key={opt} onClick={() => setTypography(opt === typography ? "" : opt)}
                  className={`px-3 py-1.5 rounded-[8px] text-sm border transition ${
                    typography === opt ? "border-[#1a6b5a] bg-[#f0f7f5] text-[#1a6b5a] font-medium" : "border-[#e8e8e4] text-gray-500 hover:bg-gray-50"
                  }`}>
                  {LABELS[opt]}
                </button>
              ))}
            </div>
          </div>

          {/* Estilo de imagem */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Estilo de imagem</label>
            <div className="flex gap-1.5 flex-wrap">
              {IMAGE_STYLE_OPTIONS.map(opt => (
                <button key={opt} onClick={() => setImageStyle(opt === imageStyle ? "" : opt)}
                  className={`px-3 py-1.5 rounded-[8px] text-sm border transition ${
                    imageStyle === opt ? "border-[#1a6b5a] bg-[#f0f7f5] text-[#1a6b5a] font-medium" : "border-[#e8e8e4] text-gray-500 hover:bg-gray-50"
                  }`}>
                  {LABELS[opt]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
