"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase";
import { DEFAULT_SYSTEM_PROMPT, DEFAULT_USER_TEMPLATE } from "@/lib/prompts";
import { IAConfig } from "@/lib/types";

const MODELS = [
  "llama-3.3-70b-versatile",
  "llama3-8b-8192",
  "mixtral-8x7b-32768",
  "gemma2-9b-it",
];

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
];

interface Props {
  userId: string;
  userCode: string;
  initialConfig: IAConfig | null;
}

export default function ParametroIAClient({
  userId,
  userCode,
  initialConfig,
}: Props) {
  const [systemPrompt, setSystemPrompt] = useState(
    initialConfig?.system_prompt ?? DEFAULT_SYSTEM_PROMPT
  );
  const [userTemplate, setUserTemplate] = useState(
    initialConfig?.user_template ?? DEFAULT_USER_TEMPLATE
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
  }, [systemPrompt, userTemplate, model, temperature, maxTokens]);

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    const payload = {
      user_code: userCode,
      user_id:   userId,
      system_prompt: systemPrompt,
      user_template: userTemplate,
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
    setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
    setUserTemplate(DEFAULT_USER_TEMPLATE);
    setModel("llama-3.3-70b-versatile");
    setTemperature(0.72);
    setMaxTokens(2048);
  }

  function insertVar(v: string, target: "system" | "user") {
    if (target === "system") setSystemPrompt((p) => p + " " + v);
    else setUserTemplate((p) => p + "\n" + v);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-stone-800">Parâmetro IA</h1>
          <p className="text-sm text-stone-400 mt-0.5">
            Configure o comportamento da inteligência artificial
          </p>
        </div>
        <div className="flex items-center gap-3">
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
            onClick={handleReset}
            className="text-xs text-stone-400 hover:text-stone-600 underline"
          >
            restaurar padrão
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="px-4 py-1.5 rounded-lg text-sm font-medium bg-[#1a6b5a] text-white disabled:opacity-40 hover:bg-[#145a4b] transition-colors"
          >
            {saving ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* System Prompt */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
            Prompt do Sistema
          </label>
          <p className="text-xs text-stone-400 mb-3">
            Instruções permanentes que definem a personalidade e as regras da IA.
            Pode usar <code className="bg-stone-100 px-1 rounded text-[#1a6b5a]">{"{{variavel}}"}</code> para incluir dados da marca.
          </p>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={10}
            className="w-full text-sm text-stone-700 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-[#1a6b5a] focus:ring-1 focus:ring-[#1a6b5a] font-mono leading-relaxed"
            placeholder="Você é um especialista em..."
          />
          <div className="mt-3">
            <p className="text-xs text-stone-400 mb-2">Inserir variável no sistema:</p>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_VARS.filter((v) =>
                ["{{voz_tom}}", "{{voz_personalidade}}", "{{voz_linguagem}}", "{{voz_arquetipo}}", "{{voz_keywords}}", "{{voz_avoid}}", "{{dna_cores}}", "{{dna_tipografia}}", "{{dna_estilo_imagem}}"].includes(v)
              ).map((v) => (
                <button
                  key={v}
                  onClick={() => insertVar(v, "system")}
                  className="text-xs bg-stone-100 hover:bg-[#e8f3f0] hover:text-[#1a6b5a] text-stone-500 px-2 py-0.5 rounded font-mono transition-colors"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Template */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
            Template da Mensagem
          </label>
          <p className="text-xs text-stone-400 mb-3">
            Estrutura do pedido enviado à IA a cada geração. Use{" "}
            <code className="bg-stone-100 px-1 rounded text-[#1a6b5a]">{"{{variavel}}"}</code>{" "}
            para inserir dados do formulário e da marca.
          </p>
          <textarea
            value={userTemplate}
            onChange={(e) => setUserTemplate(e.target.value)}
            rows={16}
            className="w-full text-sm text-stone-700 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-[#1a6b5a] focus:ring-1 focus:ring-[#1a6b5a] font-mono leading-relaxed"
            placeholder="Crie um conteúdo para {{canal}}..."
          />
          <div className="mt-4">
            <p className="text-xs text-stone-400 mb-2 font-medium">
              Variáveis disponíveis — clique para inserir:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_VARS.map((v) => (
                <button
                  key={v}
                  onClick={() => insertVar(v, "user")}
                  className="text-xs bg-stone-100 hover:bg-[#e8f3f0] hover:text-[#1a6b5a] text-stone-500 px-2 py-0.5 rounded font-mono transition-colors"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-5">
            Configurações do Modelo
          </label>

          <div className="space-y-5">
            {/* Model */}
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

            {/* Temperature */}
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

            {/* Max Tokens */}
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
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-40 text-sm text-stone-700 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#1a6b5a]"
              />
              <p className="text-xs text-stone-400 mt-1">
                Quanto maior, mais longa a resposta. Máx Groq gratuito: 4000
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
