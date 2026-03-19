"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { ICPArchetype } from "@/lib/types";

interface Props {
  data?: Partial<ICPArchetype>;
  userCode: string;
}

export function ICPCard({ data, userCode }: Props) {
  const [icpName, setIcpName] = useState(data?.icp_name ?? "");
  const [painPointsRaw, setPainPointsRaw] = useState(
    (data?.pain_points ?? []).join(", ")
  );
  const [valuePropRaw, setValuePropRaw] = useState(
    (data?.value_prop ?? []).join(", ")
  );
  const [status, setStatus] = useState(data?.status ?? "ativo");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function parseList(raw: string): string[] {
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    const payload = {
      user_code: userCode,
      icp_name: icpName,
      pain_points: parseList(painPointsRaw),
      value_prop: parseList(valuePropRaw),
      status,
      update_at: new Date().toISOString(),
    };

    if (data?.id) {
      // Atualiza registro existente
      await supabase
        .from("icp_archetypes")
        .update(payload)
        .eq("id", data.id);
    } else {
      // Cria novo registro
      await supabase
        .from("icp_archetypes")
        .insert({ ...payload, created_at: new Date().toISOString() });
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div
      className="bg-white rounded-[10px] p-6 border border-[#e8e8e4]"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            ICP — Perfil de Cliente Ideal
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Público-alvo, dores e proposta de valor.
          </p>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            status === "ativo"
              ? "bg-[#f0f7f5] text-[#1a6b5a]"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="flex flex-col gap-5">
        {/* Nome */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-800">Nome do Perfil</label>
          <p className="text-xs text-gray-400 -mt-1">
            Como você chama internamente esse cliente ideal.
          </p>
          <input
            type="text"
            value={icpName}
            onChange={(e) => setIcpName(e.target.value)}
            placeholder="Ex: Fundador Early Stage, CMO de Scale-up..."
            className="w-full rounded-[8px] border border-[#e8e8e4] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/30 focus:border-[#1a6b5a] transition placeholder:text-gray-300"
          />
        </div>

        {/* Pontos de Dor */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-800">Pontos de Dor</label>
          <p className="text-xs text-gray-400 -mt-1">
            Principais problemas e frustrações desse perfil.
          </p>
          {parseList(painPointsRaw).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-1">
              {parseList(painPointsRaw).map((point, i) => (
                <span key={i} className="text-xs bg-[#fef3f2] text-red-600 border border-red-100 px-2.5 py-1 rounded-full">
                  {point}
                </span>
              ))}
            </div>
          )}
          <textarea
            value={painPointsRaw}
            onChange={(e) => setPainPointsRaw(e.target.value)}
            rows={3}
            placeholder="Ex: não tem tempo, difícil escalar conteúdo, sem consistência..."
            className="w-full rounded-[8px] border border-[#e8e8e4] bg-white px-3 py-2 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/30 focus:border-[#1a6b5a] transition placeholder:text-gray-300"
          />
          <p className="text-[11px] text-gray-300">Separe com vírgula para múltiplos itens.</p>
        </div>

        {/* Proposta de Valor */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-800">Proposta de Valor</label>
          <p className="text-xs text-gray-400 -mt-1">
            O que a marca entrega de único para esse perfil.
          </p>
          {parseList(valuePropRaw).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-1">
              {parseList(valuePropRaw).map((val, i) => (
                <span key={i} className="text-xs bg-[#f0f7f5] text-[#1a6b5a] border border-[#1a6b5a]/20 px-2.5 py-1 rounded-full">
                  {val}
                </span>
              ))}
            </div>
          )}
          <textarea
            value={valuePropRaw}
            onChange={(e) => setValuePropRaw(e.target.value)}
            rows={3}
            placeholder="Ex: economiza 5h por semana, conteúdo com voz própria..."
            className="w-full rounded-[8px] border border-[#e8e8e4] bg-white px-3 py-2 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/30 focus:border-[#1a6b5a] transition placeholder:text-gray-300"
          />
          <p className="text-[11px] text-gray-300">Separe com vírgula para múltiplos itens.</p>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-800">Status</label>
          <div className="flex gap-3">
            {["ativo", "inativo"].map((s) => (
              <label
                key={s}
                className={`flex items-center gap-2 px-4 py-2 rounded-[8px] border cursor-pointer transition capitalize ${
                  status === s
                    ? "border-[#1a6b5a] bg-[#f0f7f5] text-[#1a6b5a]"
                    : "border-[#e8e8e4] text-gray-500 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={s}
                  checked={status === s}
                  onChange={() => setStatus(s)}
                  className="accent-[#1a6b5a]"
                />
                <span className="text-sm font-medium">{s}</span>
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
            {saving ? "Salvando..." : "Salvar ICP"}
          </button>
          {saved && (
            <span className="text-sm text-[#1a6b5a] font-medium">✓ Salvo</span>
          )}
        </div>
      </div>
    </div>
  );
}
