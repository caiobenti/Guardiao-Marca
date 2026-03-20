"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
  DEFAULT_SYSTEM_PROMPT_TXT,
  DEFAULT_USER_TEMPLATE_TXT,
  DEFAULT_SYSTEM_PROMPT_IMG,
  DEFAULT_USER_TEMPLATE_IMG,
} from "@/lib/prompts";
import { IAConfig } from "@/lib/types";

const MODELS = [
  "llama-3.3-70b-versatile",
  "llama3-8b-8192",
  "mixtral-8x7b-32768",
  "gemma2-9b-it",
];

const COPY_GERADA = "{{copy_gerada}}";

const AVAILABLE_VARS = [
  "{{canal}}",
  "{{formato}}",
  "{{estilo}}",
  "{{objetivo}}",
  "{{tema}}",
  "{{persona_nome}}",
  "{{persona_dores}}",
  "{{persona_valor}}",
  "{{voz_tom}}",
  "{{voz_personalidade}}",
  "{{voz_linguagem}}",
  "{{voz_arquetipo}}",
  "{{voz_keywords}}",
  "{{voz_avoid}}",
  "{{dna_cores}}",
  "{{dna_tipografia}}",
  "{{dna_estilo_imagem}}",
  COPY_GERADA,
];

const SYSTEM_VAR_PICK = [
  "{{voz_tom}}",
  "{{voz_personalidade}}",
  "{{voz_linguagem}}",
  "{{voz_arquetipo}}",
  "{{voz_keywords}}",
  "{{voz_avoid}}",
  "{{dna_cores}}",
  "{{dna_tipografia}}",
  "{{dna_estilo_imagem}}",
];

type VarTarget = "txt_system" | "txt_user" | "img_system" | "img_user";

interface Props {
  userId: string;
  userCode: string;
  initialConfig: Partial<IAConfig> | null;
}

export default function ParametroIAClient({
  userId,
  userCode,
  initialConfig,
}: Props) {
  const [systemPromptTxt, setSystemPromptTxt] = useState(
    initialConfig?.system_prompt_txt ?? DEFAULT_SYSTEM_PROMPT_TXT
  );
  const [userTemplateTxt, setUserTemplateTxt] = useState(
    initialConfig?.user_template_txt ?? DEFAULT_USER_TEMPLATE_TXT
  );
  const [systemPromptImg, setSystemPromptImg] = useState(
    initialConfig?.system_prompt_img ?? DEFAULT_SYSTEM_PROMPT_IMG
  );
  const [userTemplateImg, setUserTemplateImg] = useState(
    initialConfig?.user_template_img ?? DEFAULT_USER_TEMPLATE_IMG
  );
  const [model, setModel] = useState(
    initialConfig?.model ?? "llama-3.3-70b-versatile"
  );
  const [temperature, setTemperature] = useState(
    initialConfig?.temperature ?? 0.72
  );
  const [maxTokens, setMaxTokens] = useState(initialConfig?.max_tokens ?? 2048);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    setIsDirty(true);
    setSaveMsg("");
  }, [
    systemPromptTxt,
    userTemplateTxt,
    systemPromptImg,
    userTemplateImg,
    model,
    temperature,
    maxTokens,
  ]);

  async function handleSave() {
    setSaving(true);
    const payload = {
      user_code: userCode,
      user_id: userId,
      system_prompt_txt: systemPromptTxt,
      user_template_txt: userTemplateTxt,
      system_prompt_img: systemPromptImg,
      user_template_img: userTemplateImg,
      model,
      temperature,
      max_tokens: maxTokens,
    };

    const { data: existing } = await supabase
      .from("DB4 - ia_config")
      .select("id")
      .eq("user_code", userCode)
      .maybeSingle();

    let error;
    if (existing?.id) {
      ({ error } = await supabase
        .from("DB4 - ia_config")
        .update(payload)
        .eq("id", existing.id));
    } else {
      ({ error } = await supabase.from("DB4 - ia_config").insert(payload));
    }

    setSaving(false);
    if (error) {
      setSaveMsg("Erro: " + error.message);
    } else {
      setIsDirty(false);
      setSaveMsg("Salvo!");
      setTimeout(() => setSaveMsg(""), 3000);
    }
  }

  function handleReset() {
    setSystemPromptTxt(DEFAULT_SYSTEM_PROMPT_TXT);
    setUserTemplateTxt(DEFAULT_USER_TEMPLATE_TXT);
    setSystemPromptImg(DEFAULT_SYSTEM_PROMPT_IMG);
    setUserTemplateImg(DEFAULT_USER_TEMPLATE_IMG);
    setModel("llama-3.3-70b-versatile");
    setTemperature(0.72);
    setMaxTokens(2048);
  }

  function insertVar(v: string, target: VarTarget) {
    const append = (prev: string, lineBreak: boolean) =>
      lineBreak ? prev + "\n" + v : prev + " " + v;
    const lineBreak = target.endsWith("user");
    switch (target) {
      case "txt_system":
        setSystemPromptTxt((p) => append(p, false));
        break;
      case "txt_user":
        setUserTemplateTxt((p) => append(p, true));
        break;
      case "img_system":
        setSystemPromptImg((p) => append(p, false));
        break;
      case "img_user":
        setUserTemplateImg((p) => append(p, true));
        break;
    }
  }

  function varChipRow(
    filterFn: (v: string) => boolean,
    target: VarTarget
  ) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {AVAILABLE_VARS.filter(filterFn).map((v) => (
          <button
            key={`${target}-${v}`}
            type="button"
            onClick={() => insertVar(v, target)}
            className="text-xs bg-stone-100 hover:bg-[#e8f3f0] hover:text-[#1a6b5a] text-stone-500 px-2 py-0.5 rounded font-mono transition-colors"
          >
            {v}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-stone-800">Parâmetro IA</h1>
          <p className="text-sm text-stone-400 mt-0.5">
            Prompts separados para texto (Groq) e imagem (FLUX)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {isDirty && (
            <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
              alterações não salvas
            </span>
          )}
          {saveMsg && (
            <span
              className={`text-xs font-medium ${
                saveMsg.startsWith("Erro") ? "text-red-600" : "text-green-600"
              }`}
            >
              {saveMsg}
            </span>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-stone-400 hover:text-stone-600 underline"
          >
            restaurar padrão
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="px-4 py-1.5 rounded-lg text-sm font-medium bg-[#1a6b5a] text-white disabled:opacity-40 hover:bg-[#145a4b] transition-colors"
          >
            {saving ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Coluna texto */}
        <div className="space-y-6">
          <div className="rounded-xl border border-stone-200 bg-[#f8faf8] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#1a6b5a]">
              Texto · Groq
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Usado em <code className="text-[11px]">/api/gerar</code> (chat).
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
              system_prompt_txt
            </label>
            <p className="text-xs text-stone-400 mb-3">
              Instruções fixas da IA de texto.{" "}
              <code className="bg-stone-100 px-1 rounded text-[#1a6b5a]">
                {"{{variavel}}"}
              </code>
            </p>
            <textarea
              value={systemPromptTxt}
              onChange={(e) => setSystemPromptTxt(e.target.value)}
              rows={10}
              className="w-full text-sm text-stone-700 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 resize-y min-h-[200px] focus:outline-none focus:border-[#1a6b5a] focus:ring-1 focus:ring-[#1a6b5a] font-mono leading-relaxed"
            />
            <div className="mt-3">
              <p className="text-xs text-stone-400 mb-2">
                Inserir no sistema:
              </p>
              {varChipRow((v) => SYSTEM_VAR_PICK.includes(v), "txt_system")}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
              user_template_txt
            </label>
            <p className="text-xs text-stone-400 mb-3">
              Briefing por geração (substitui{" "}
              <code className="bg-stone-100 px-1 rounded">buildUserPrompt</code>{" "}
              quando preenchido).
            </p>
            <textarea
              value={userTemplateTxt}
              onChange={(e) => setUserTemplateTxt(e.target.value)}
              rows={14}
              className="w-full text-sm text-stone-700 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 resize-y min-h-[260px] focus:outline-none focus:border-[#1a6b5a] focus:ring-1 focus:ring-[#1a6b5a] font-mono leading-relaxed"
            />
            <div className="mt-4">
              <p className="text-xs text-stone-400 mb-2 font-medium">
                Variáveis — clique para inserir:
              </p>
              {varChipRow((v) => v !== COPY_GERADA, "txt_user")}
            </div>
          </div>
        </div>

        {/* Coluna imagem */}
        <div className="space-y-6">
          <div className="rounded-xl border border-stone-200 bg-[#f5f7fa] px-4 py-3">
            <h2 className="text-sm font-semibold text-stone-700">
              Imagem · FLUX
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Montam um único prompt (sistema + template) em{" "}
              <code className="text-[11px]">/api/gerar-imagem</code>.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
              system_prompt_img
            </label>
            <p className="text-xs text-stone-400 mb-3">
              Regras do engenheiro de prompt visual (em inglês costuma funcionar
              melhor com FLUX).
            </p>
            <textarea
              value={systemPromptImg}
              onChange={(e) => setSystemPromptImg(e.target.value)}
              rows={10}
              className="w-full text-sm text-stone-700 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 resize-y min-h-[200px] focus:outline-none focus:border-[#1a6b5a] focus:ring-1 focus:ring-[#1a6b5a] font-mono leading-relaxed"
            />
            <div className="mt-3">
              <p className="text-xs text-stone-400 mb-2">Inserir no sistema:</p>
              {varChipRow((v) => SYSTEM_VAR_PICK.includes(v), "img_system")}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
              user_template_img
            </label>
            <p className="text-xs text-stone-400 mb-3">
              Dados do briefing convertidos em descrição da cena; mesmas{" "}
              <code className="bg-stone-100 px-1 rounded text-[#1a6b5a]">
                {"{{variavel}}"}
              </code>{" "}
              do texto.
            </p>
            <textarea
              value={userTemplateImg}
              onChange={(e) => setUserTemplateImg(e.target.value)}
              rows={8}
              className="w-full text-sm text-stone-700 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 resize-y min-h-[160px] focus:outline-none focus:border-[#1a6b5a] focus:ring-1 focus:ring-[#1a6b5a] font-mono leading-relaxed"
            />
            <div className="mt-4">
              <p className="text-xs text-stone-400 mb-2 font-medium">
                Variáveis — clique para inserir:
              </p>
              {varChipRow(() => true, "img_user")}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-5">
          Configurações do modelo (texto)
        </label>

        <div className="space-y-5 max-w-xl">
          <div>
            <label className="block text-xs text-stone-500 mb-2">Modelo</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full text-sm text-stone-700 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#1a6b5a]"
            >
              {MODELS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs text-stone-500">Temperatura</label>
              <span className="text-xs font-mono text-stone-600">
                {temperature.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-[#1a6b5a]"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-stone-400">Preciso</span>
              <span className="text-xs text-stone-400">Criativo</span>
            </div>
          </div>

          <div>
            <label className="block text-xs text-stone-500 mb-2">
              Máximo de tokens
            </label>
            <input
              type="number"
              min={100}
              max={4000}
              step={100}
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
              className="w-40 text-sm text-stone-700 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#1a6b5a]"
            />
            <p className="text-xs text-stone-400 mt-1">
              Quanto maior, mais longa a resposta. Máx Groq gratuito: 4000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
