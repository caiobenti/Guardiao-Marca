"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { BrandParameters } from "@/lib/types";

// ─── Opções ────────────────────────────────────────────────────────────────
const OPTIONS = {
  sentence_length: ["curtas", "medias", "longas"],
  formality_level: ["informal", "neutro", "formal"],
  jargon_level: ["simples", "moderado", "tecnico"],
  emotional_tone: ["inspirador", "educativo", "direto", "humoristico"],
  cta_intensity: ["suave", "moderado", "intenso"],
};

const LABELS: Record<string, string> = {
  curtas: "Curtas", medias: "Médias", longas: "Longas",
  informal: "Informal", neutro: "Neutro", formal: "Formal",
  simples: "Simples", moderado: "Moderado", tecnico: "Técnico",
  inspirador: "Inspirador", educativo: "Educativo", direto: "Direto", humoristico: "Humorístico",
  suave: "Suave", intenso: "Intenso",
};

// ─── Tipos ─────────────────────────────────────────────────────────────────
type SaveStatus = "idle" | "pending" | "saving" | "saved" | "error";

interface Props {
  data?: Partial<BrandParameters>;
  userCode: string;
}

// ─── Componente ────────────────────────────────────────────────────────────
export function VozEscrita({ data, userCode }: Props) {
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
  const isFirstRender = useRef(true);

  // Auto-save com debounce — não roda no mount
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus("pending");

    const timer = setTimeout(async () => {
      setSaveStatus("saving");

      const { error } = await supabase.from("DB2 - brand_parameters").upsert(
        {
          user_code: userCode,
          sentence_length: sentenceLength,
          formality_level: formalityLevel,
          jargon_level: jargonLevel,
          emotional_tone: emotionalTone,
          cta_intensity: ctaIntensity,
          brand_keywords: keywords.join(", "),
          update_at: new Date().toISOString(),
        },
        { onConflict: "user_code" }
      );

      if (error) {
        console.error("[VozEscrita] Erro ao salvar:", error.message);
        setSaveStatus("error");
        return;
      }

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }, 1500);

    return () => clearTimeout(timer);
  }, [sentenceLength, formalityLevel, jargonLevel, emotionalTone, ctaIntensity, keywords, userCode]);

  // Atualizar: busca dados frescos do banco
  async function handleRefresh() {
    const { data: fresh, error } = await supabase
      .from("DB2 - brand_parameters")
      .select("*")
      .eq("user_code", userCode)
      .maybeSingle();

    if (error) {
      console.error("[VozEscrita] Erro ao atualizar:", error.message);
      return;
    }

    if (fresh) {
      isFirstRender.current = true; // evita auto-save dos dados frescos
      setSentenceLength(fresh.sentence_length ?? "");
      setFormalityLevel(fresh.formality_level ?? "");
      setJargonLevel(fresh.jargon_level ?? "");
      setEmotionalTone(fresh.emotional_tone ?? "");
      setCtaIntensity(fresh.cta_intensity ?? "");
      setKeywords(
        fresh.brand_keywords
          ? fresh.brand_keywords.split(",").map((s: string) => s.trim()).filter(Boolean)
          : []
      );
    }
  }

  function addKeyword() {
    const kw = keywordInput.trim();
    if (kw && !keywords.includes(kw)) setKeywords([...keywords, kw]);
    setKeywordInput("");
  }

  function removeKeyword(kw: string) {
    setKeywords(keywords.filter(k => k !== kw));
  }

  return (
    <div className="bg-white rounded-[10px] border border-[#e8e8e4]" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

      {/* Cabeçalho */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e8e4]">
        <h2 className="text-sm font-semibold text-gray-900">Voz e Escrita</h2>
        <div className="flex items-center gap-3">
          {saveStatus === "pending" && <span className="text-xs text-amber-500">● não salvo</span>}
          {saveStatus === "saving" && <span className="text-xs text-gray-400">Salvando...</span>}
          {saveStatus === "saved" && <span className="text-xs text-[#1a6b5a]">✓ Salvo</span>}
          {saveStatus === "error" && <span className="text-xs text-red-500">Erro ao salvar</span>}
          <button onClick={handleRefresh} className="text-xs font-medium text-[#1a6b5a] hover:underline">
            Atualizar
          </button>
        </div>
      </div>

      {/* Campos */}
      <div className="px-5 py-4 flex flex-col gap-4">

        {Object.entries(OPTIONS).map(([key, opts]) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              {key === "sentence_length" && "Tamanho de frase"}
              {key === "formality_level" && "Formalidade"}
              {key === "jargon_level" && "Jargão técnico"}
              {key === "emotional_tone" && "Tom emocional"}
              {key === "cta_intensity" && "Intensidade do CTA"}
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {opts.map(opt => {
                const currentValue = {
                  sentence_length: sentenceLength,
                  formality_level: formalityLevel,
                  jargon_level: jargonLevel,
                  emotional_tone: emotionalTone,
                  cta_intensity: ctaIntensity,
                }[key];
                const isActive = currentValue === opt;
                const setter = {
                  sentence_length: setSentenceLength,
                  formality_level: setFormalityLevel,
                  jargon_level: setJargonLevel,
                  emotional_tone: setEmotionalTone,
                  cta_intensity: setCtaIntensity,
                }[key];
                return (
                  <button
                    key={opt}
                    onClick={() => setter?.(isActive ? "" : opt)}
                    className={`px-3 py-1.5 rounded-[8px] text-sm border transition ${
                      isActive
                        ? "border-[#1a6b5a] bg-[#f0f7f5] text-[#1a6b5a] font-medium"
                        : "border-[#e8e8e4] text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {LABELS[opt] ?? opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Keywords */}
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
                  <button onClick={() => removeKeyword(kw)} className="opacity-50 hover:opacity-100 leading-none ml-0.5">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
