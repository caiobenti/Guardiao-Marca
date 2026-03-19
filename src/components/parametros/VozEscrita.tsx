"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { BrandParameters } from "@/lib/types";

const SENTENCE_LENGTH_OPTIONS = ["curtas", "medias", "longas"];
const FORMALITY_OPTIONS = ["informal", "neutro", "formal"];
const JARGON_OPTIONS = ["simples", "moderado", "tecnico"];
const EMOTIONAL_TONE_OPTIONS = ["inspirador", "educativo", "direto", "humoristico"];
const CTA_INTENSITY_OPTIONS = ["suave", "moderado", "intenso"];

const LABELS: Record<string, string> = {
  curtas: "Curtas", medias: "Médias", longas: "Longas",
  informal: "Informal", neutro: "Neutro", formal: "Formal",
  simples: "Simples", moderado: "Moderado", tecnico: "Técnico",
  inspirador: "Inspirador", educativo: "Educativo", direto: "Direto", humoristico: "Humorístico",
  suave: "Suave", intenso: "Intenso",
};

interface Props {
  data?: Partial<BrandParameters>;
  userCode: string;
}

type SaveStatus = "idle" | "pending" | "saving" | "saved";

export function VozEscrita({ data, userCode }: Props) {
  const [editing, setEditing] = useState(false);
  const [sentenceLength, setSentenceLength] = useState(data?.sentence_length ?? "");
  const [formalityLevel, setFormalityLevel] = useState(data?.formality_level ?? "");
  const [jargonLevel, setJargonLevel] = useState(data?.jargon_level ?? "");
  const [emotionalTone, setEmotionalTone] = useState(data?.emotional_tone ?? "");
  const [ctaIntensity, setCtaIntensity] = useState(data?.cta_intensity ?? "");
  const [keywords, setKeywords] = useState<string[]>(
    data?.brand_keywords ? data.brand_keywords.split(",").map(s => s.trim()).filter(Boolean) : []
  );
  const [keywordInput, setKeywordInput] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [undoData, setUndoData] = useState<typeof data>(undefined);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDirty = useRef(false);

  const formValues = { sentenceLength, formalityLevel, jargonLevel, emotionalTone, ctaIntensity, keywords };

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
        sentence_length: sentenceLength,
        formality_level: formalityLevel,
        jargon_level: jargonLevel,
        emotional_tone: emotionalTone,
        cta_intensity: ctaIntensity,
        brand_keywords: keywords.join(", "),
        update_at: new Date().toISOString(),
      }, { onConflict: "user_code" });
      setSaveStatus("saved");
      isDirty.current = false;
      setTimeout(() => setSaveStatus("idle"), 4000);
    }, 1500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentenceLength, formalityLevel, jargonLevel, emotionalTone, ctaIntensity, keywords]);

  function addKeyword() {
    const kw = keywordInput.trim();
    if (kw && !keywords.includes(kw)) {
      setKeywords([...keywords, kw]);
    }
    setKeywordInput("");
  }

  function removeKeyword(kw: string) {
    setKeywords(keywords.filter(k => k !== kw));
  }

  async function handleUndo() {
    if (!undoData) return;
    setSaveStatus("saving");
    await supabase.from("DB2 - brand_parameters").upsert({
      user_code: userCode,
      sentence_length: undoData.sentence_length ?? "",
      formality_level: undoData.formality_level ?? "",
      jargon_level: undoData.jargon_level ?? "",
      emotional_tone: undoData.emotional_tone ?? "",
      cta_intensity: undoData.cta_intensity ?? "",
      brand_keywords: undoData.brand_keywords ?? "",
      update_at: new Date().toISOString(),
    }, { onConflict: "user_code" });
    setSentenceLength(undoData.sentence_length ?? "");
    setFormalityLevel(undoData.formality_level ?? "");
    setJargonLevel(undoData.jargon_level ?? "");
    setEmotionalTone(undoData.emotional_tone ?? "");
    setCtaIntensity(undoData.cta_intensity ?? "");
    setKeywords(undoData.brand_keywords ? undoData.brand_keywords.split(",").map(s => s.trim()).filter(Boolean) : []);
    setSaveStatus("idle");
    setUndoData(undefined);
  }

  const hasValues = sentenceLength || formalityLevel || jargonLevel || emotionalTone || ctaIntensity || keywords.length > 0;

  return (
    <div className="bg-white rounded-[10px] border border-[#e8e8e4]" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e8e4]">
        <h2 className="text-sm font-semibold text-gray-900">Voz e Escrita</h2>
        <div className="flex items-center gap-3">
          {saveStatus === "pending" && <span className="text-xs text-amber-500">● não salvo</span>}
          {saveStatus === "saving" && <span className="text-xs text-gray-400">Salvando...</span>}
          {saveStatus === "saved" && (
            <span className="flex items-center gap-1.5 text-xs text-[#1a6b5a]">
              ✓ Salvo
              {undoData && (
                <button onClick={handleUndo} className="underline text-gray-400 hover:text-gray-600 ml-1">desfazer</button>
              )}
            </span>
          )}
          <button
            onClick={() => setEditing(!editing)}
            className="text-xs font-medium text-[#1a6b5a] hover:underline"
          >
            {editing ? "Fechar" : "Editar"}
          </button>
        </div>
      </div>

      {/* Summary */}
      {!editing && (
        <div className="px-5 py-4">
          {hasValues ? (
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-1.5">
                {[sentenceLength, formalityLevel, jargonLevel, emotionalTone, ctaIntensity].filter(Boolean).map((v, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                    {LABELS[v] ?? v}
                  </span>
                ))}
              </div>
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {keywords.map((kw, i) => (
                    <span key={i} className="text-xs bg-[#f0f7f5] text-[#1a6b5a] px-2.5 py-1 rounded-full">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-300">Nenhum dado configurado ainda.</p>
          )}
        </div>
      )}

      {/* Edit mode */}
      {editing && (
        <div className="px-5 py-4 flex flex-col gap-4">
          {/* Selects */}
          {[
            { label: "Tamanho de frase", value: sentenceLength, set: setSentenceLength, options: SENTENCE_LENGTH_OPTIONS },
            { label: "Formalidade", value: formalityLevel, set: setFormalityLevel, options: FORMALITY_OPTIONS },
            { label: "Jargão técnico", value: jargonLevel, set: setJargonLevel, options: JARGON_OPTIONS },
            { label: "Tom emocional", value: emotionalTone, set: setEmotionalTone, options: EMOTIONAL_TONE_OPTIONS },
            { label: "Intensidade do CTA", value: ctaIntensity, set: setCtaIntensity, options: CTA_INTENSITY_OPTIONS },
          ].map(({ label, value, set, options }) => (
            <div key={label} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>
              <div className="flex gap-1.5 flex-wrap">
                {options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => set(opt === value ? "" : opt)}
                    className={`px-3 py-1.5 rounded-[8px] text-sm border transition ${
                      value === opt
                        ? "border-[#1a6b5a] bg-[#f0f7f5] text-[#1a6b5a] font-medium"
                        : "border-[#e8e8e4] text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {LABELS[opt] ?? opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Keywords */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Palavras-chave</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={keywordInput}
                onChange={e => setKeywordInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addKeyword()}
                placeholder="Ex: inovação"
                className="flex-1 rounded-[8px] border border-[#e8e8e4] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/30 focus:border-[#1a6b5a] transition placeholder:text-gray-300"
              />
              <button
                onClick={addKeyword}
                className="px-3 py-2 rounded-[8px] border border-[#e8e8e4] text-sm text-gray-500 hover:bg-gray-50 transition"
              >
                + Adicionar
              </button>
            </div>
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {keywords.map(kw => (
                  <span key={kw} className="flex items-center gap-1.5 text-sm bg-[#f0f7f5] text-[#1a6b5a] px-2.5 py-1 rounded-full">
                    {kw}
                    <button onClick={() => removeKeyword(kw)} className="text-[#1a6b5a]/60 hover:text-[#1a6b5a] leading-none">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
