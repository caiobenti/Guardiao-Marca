"use client";

import { useState, useRef } from "react";
import { saveRecord } from "@/lib/db";
import { BrandParameters } from "@/lib/types";

// ─── Opções ────────────────────────────────────────────────────────────────
const OPTIONS: Record<string, string[]> = {
  sentence_length: ["curtas", "medias", "longas"],
  formality_level: ["informal", "neutro", "formal"],
  jargon_level: ["simples", "moderado", "tecnico"],
  emotional_tone: ["inspirador", "educativo", "direto", "humoristico"],
  cta_intensity: ["suave", "moderado", "intenso"],
};

const FIELD_LABELS: Record<string, string> = {
  sentence_length: "Tamanho de frase",
  formality_level: "Formalidade",
  jargon_level: "Jargão técnico",
  emotional_tone: "Tom emocional",
  cta_intensity: "Intensidade do CTA",
};

const VALUE_LABELS: Record<string, string> = {
  curtas: "Curtas", medias: "Médias", longas: "Longas",
  informal: "Informal", neutro: "Neutro", formal: "Formal",
  simples: "Simples", moderado: "Moderado", tecnico: "Técnico",
  inspirador: "Inspirador", educativo: "Educativo", direto: "Direto", humoristico: "Humorístico",
  suave: "Suave", intenso: "Intenso",
};

// ─── Tipos ─────────────────────────────────────────────────────────────────
type SaveStatus = "idle" | "saving" | "saved" | "error";

interface Props {
  data?: Partial<BrandParameters>;
  userCode: string;
  userId: string;
}

// ─── Componente ────────────────────────────────────────────────────────────
export function VozEscrita({ data, userCode, userId }: Props) {
  const [sentenceLength, setSentenceLength] = useState(data?.sentence_length ?? "");
  const [formalityLevel, setFormalityLevel] = useState(data?.formality_level ?? "");
  const [jargonLevel, setJargonLevel] = useState(data?.jargon_level ?? "");
  const [emotionalTone, setEmotionalTone] = useState(data?.emotional_tone ?? "");
  const [ctaIntensity, setCtaIntensity] = useState(data?.cta_intensity ?? "");
  const [keywords, setKeywords] = useState<string[]>(
    data?.brand_keywords
      ? data.brand_keywords.split(",").map(s => s.trim()).filter(Boolean)
      : []
  );
  const [keywordInput, setKeywordInput] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [isDirty, setIsDirty] = useState(false);
  const isSaving = useRef(false);
  const isFirstRender = useRef(true);

  function makeSetter<T>(setter: (v: T) => void) {
    return (v: T) => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
      }
      setter(v);
      setIsDirty(true);
    };
  }

  const setSD = makeSetter(setSentenceLength);
  const setFL = makeSetter(setFormalityLevel);
  const setJL = makeSetter(setJargonLevel);
  const setET = makeSetter(setEmotionalTone);
  const setCI = makeSetter(setCtaIntensity);

  function settersForField(field: string): (v: string) => void {
    const map: Record<string, (v: string) => void> = {
      sentence_length: setSD,
      formality_level: setFL,
      jargon_level: setJL,
      emotional_tone: setET,
      cta_intensity: setCI,
    };
    return map[field];
  }

  // ─── Save ───────────────────────────────────────────────────────────────
  async function handleSave() {
    if (isSaving.current) return;
    isSaving.current = true;
    setSaveStatus("saving");

    const { error } = await saveRecord("DB2 - brand_parameters", "user_code", userCode, {
      user_code: userCode,
      user_id: userId,
      sentence_length: sentenceLength,
      formality_level: formalityLevel,
      jargon_level: jargonLevel,
      emotional_tone: emotionalTone,
      cta_intensity: ctaIntensity,
      brand_keywords: keywords.join(", "),
    });

    isSaving.current = false;
    setSaveStatus(error ? "error" : "saved");
    if (!error) setIsDirty(false);
    setTimeout(() => setSaveStatus("idle"), 3000);
  }

  // ─── Keywords ──────────────────────────────────────────────────────────
  function addKeyword() {
    const kw = keywordInput.trim();
    if (kw && !keywords.includes(kw)) {
      isFirstRender.current = false;
      setKeywords([...keywords, kw]);
      setIsDirty(true);
    }
    setKeywordInput("");
  }

  // ─── Render ────────────────────────────────────────────────────────────
  const currentValues: Record<string, string> = {
    sentence_length: sentenceLength,
    formality_level: formalityLevel,
    jargon_level: jargonLevel,
    emotional_tone: emotionalTone,
    cta_intensity: ctaIntensity,
  };

  return (
    <div className="bg-white rounded-[10px] border border-[#e8e8e4]" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

      {/* Cabeçalho */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e8e4]">
        <h2 className="text-sm font-semibold text-gray-900">Voz e Escrita</h2>
        <div className="flex items-center gap-3">
          {isDirty && saveStatus === "idle" && (
            <span className="text-xs text-amber-500">● alterações não salvas</span>
          )}
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

        {/* Seletores */}
        {Object.entries(OPTIONS).map(([field, opts]) => (
          <div key={field} className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              {FIELD_LABELS[field]}
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {opts.map(opt => {
                const isActive = currentValues[field] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => settersForField(field)(isActive ? "" : opt)}
                    className={`px-3 py-1.5 rounded-[8px] text-sm border transition ${
                      isActive
                        ? "border-[#1a6b5a] bg-[#f0f7f5] text-[#1a6b5a] font-medium"
                        : "border-[#e8e8e4] text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {VALUE_LABELS[opt] ?? opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Keywords — 1 por 1 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Palavras-chave</label>
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
              className="px-3 py-2 rounded-[8px] border border-[#e8e8e4] text-sm text-gray-500 hover:bg-gray-50 transition whitespace-nowrap"
            >
              + Adicionar
            </button>
          </div>
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {keywords.map(kw => (
                <span key={kw} className="flex items-center gap-1 text-sm bg-[#f0f7f5] text-[#1a6b5a] px-2.5 py-1 rounded-full">
                  {kw}
                  <button
                    onClick={() => {
                      isFirstRender.current = false;
                      setKeywords(keywords.filter(k => k !== kw));
                      setIsDirty(true);
                    }}
                    className="opacity-50 hover:opacity-100 leading-none ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
