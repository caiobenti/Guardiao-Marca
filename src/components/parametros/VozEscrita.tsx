"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { BrandParameters } from "@/lib/types";

const SENTENCE_LENGTH_OPTIONS = [
  { value: "curtas", label: "Curtas" },
  { value: "medias", label: "Médias" },
  { value: "longas", label: "Longas" },
];
const FORMALITY_OPTIONS = [
  { value: "informal", label: "Informal" },
  { value: "neutro", label: "Neutro" },
  { value: "formal", label: "Formal" },
];
const JARGON_OPTIONS = [
  { value: "simples", label: "Simples" },
  { value: "moderado", label: "Moderado" },
  { value: "tecnico", label: "Técnico" },
];
const EMOTIONAL_TONE_OPTIONS = [
  { value: "inspirador", label: "Inspirador" },
  { value: "educativo", label: "Educativo" },
  { value: "direto", label: "Direto" },
  { value: "humoristico", label: "Humorístico" },
];
const CTA_INTENSITY_OPTIONS = [
  { value: "suave", label: "Suave" },
  { value: "moderado", label: "Moderado" },
  { value: "intenso", label: "Intenso" },
];

interface Props {
  data?: Partial<BrandParameters>;
  userCode: string;
}

function SelectField({
  label,
  description,
  value,
  onChange,
  options,
}: {
  label: string;
  description: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-800">{label}</label>
      <p className="text-xs text-gray-400 -mt-1">{description}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[8px] border border-[#e8e8e4] bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/30 focus:border-[#1a6b5a] transition"
      >
        <option value="" disabled>Selecione...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export function VozEscrita({ data, userCode }: Props) {
  const [sentenceLength, setSentenceLength] = useState(data?.sentence_length ?? "");
  const [formalityLevel, setFormalityLevel] = useState(data?.formality_level ?? "");
  const [jargonLevel, setJargonLevel] = useState(data?.jargon_level ?? "");
  const [emotionalTone, setEmotionalTone] = useState(data?.emotional_tone ?? "");
  const [ctaIntensity, setCtaIntensity] = useState(data?.cta_intensity ?? "");
  const [brandKeywords, setBrandKeywords] = useState(data?.brand_keywords ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    const payload = {
      user_code: userCode,
      sentence_length: sentenceLength,
      formality_level: formalityLevel,
      jargon_level: jargonLevel,
      emotional_tone: emotionalTone,
      cta_intensity: ctaIntensity,
      brand_keywords: brandKeywords,
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
        <h2 className="text-base font-semibold text-gray-900">Voz e Escrita</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          Tom, estilo e personalidade da comunicação da marca.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <SelectField
          label="Tamanho de Frase"
          description="Comprimento preferido das frases no conteúdo."
          value={sentenceLength}
          onChange={setSentenceLength}
          options={SENTENCE_LENGTH_OPTIONS}
        />
        <SelectField
          label="Nível de Formalidade"
          description="Grau de formalidade da linguagem."
          value={formalityLevel}
          onChange={setFormalityLevel}
          options={FORMALITY_OPTIONS}
        />
        <SelectField
          label="Nível de Jargão Técnico"
          description="Quanto vocabulário especializado é usado."
          value={jargonLevel}
          onChange={setJargonLevel}
          options={JARGON_OPTIONS}
        />
        <SelectField
          label="Tom Emocional"
          description="Qual sentimento o conteúdo deve evocar."
          value={emotionalTone}
          onChange={setEmotionalTone}
          options={EMOTIONAL_TONE_OPTIONS}
        />
        <SelectField
          label="Intensidade do CTA"
          description="Quão direta é a chamada para ação."
          value={ctaIntensity}
          onChange={setCtaIntensity}
          options={CTA_INTENSITY_OPTIONS}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-800">Palavras-chave da Marca</label>
          <p className="text-xs text-gray-400 -mt-1">
            Palavras que devem aparecer frequentemente no conteúdo.
          </p>
          <textarea
            value={brandKeywords}
            onChange={(e) => setBrandKeywords(e.target.value)}
            rows={3}
            placeholder="Ex: inovação, confiança, resultado..."
            className="w-full rounded-[8px] border border-[#e8e8e4] bg-white px-3 py-2 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/30 focus:border-[#1a6b5a] transition placeholder:text-gray-300"
          />
        </div>

        <div className="pt-2 border-t border-[#e8e8e4] flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-[8px] bg-[#1a6b5a] text-white text-sm font-medium hover:bg-[#155a4a] transition disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar Voz e Escrita"}
          </button>
          {saved && (
            <span className="text-sm text-[#1a6b5a] font-medium">✓ Salvo</span>
          )}
        </div>
      </div>
    </div>
  );
}
