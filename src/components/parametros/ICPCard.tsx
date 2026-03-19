"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { ICPArchetype } from "@/lib/types";

interface Props {
  data?: Partial<ICPArchetype>;
  userCode: string;
}

type SaveStatus = "idle" | "pending" | "saving" | "saved";

export function ICPCard({ data, userCode }: Props) {
  const [editing, setEditing] = useState(false);
  const [icpName, setIcpName] = useState(data?.icp_name ?? "");
  const [painPoints, setPainPoints] = useState<string[]>(data?.pain_points ?? []);
  const [valueProps, setValueProps] = useState<string[]>(data?.value_prop ?? []);
  const [status, setStatus] = useState(data?.status ?? "ativo");
  const [painInput, setPainInput] = useState("");
  const [valuePropInput, setValuePropInput] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [undoData] = useState<typeof data>(data);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDirty = useRef(false);

  useEffect(() => {
    if (!editing) return;
    if (!isDirty.current) { isDirty.current = true; return; }

    setSaveStatus("pending");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSaveStatus("saving");
      const payload = {
        user_code: userCode,
        icp_name: icpName,
        pain_points: painPoints,
        value_prop: valueProps,
        status,
        update_at: new Date().toISOString(),
      };
      if (data?.id) {
        await supabase.from("DB3 - icp_archetypes").update(payload).eq("id", data.id);
      } else {
        await supabase.from("DB3 - icp_archetypes").insert({ ...payload, created_at: new Date().toISOString() });
      }
      setSaveStatus("saved");
      isDirty.current = false;
      setTimeout(() => setSaveStatus("idle"), 4000);
    }, 1500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [icpName, painPoints, valueProps, status]);

  function addItem(list: string[], setList: (v: string[]) => void, input: string, setInput: (v: string) => void) {
    const val = input.trim();
    if (val && !list.includes(val)) setList([...list, val]);
    setInput("");
  }

  function removeItem(list: string[], setList: (v: string[]) => void, item: string) {
    setList(list.filter(i => i !== item));
  }

  const hasValues = icpName || painPoints.length > 0 || valueProps.length > 0;

  return (
    <div className="bg-white rounded-[10px] border border-[#e8e8e4]" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e8e4]">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-900">Personas / ICP</h2>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            status === "ativo" ? "bg-[#f0f7f5] text-[#1a6b5a]" : "bg-gray-100 text-gray-400"
          }`}>{status}</span>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus === "pending" && <span className="text-xs text-amber-500">● não salvo</span>}
          {saveStatus === "saving" && <span className="text-xs text-gray-400">Salvando...</span>}
          {saveStatus === "saved" && (
            <span className="flex items-center gap-1.5 text-xs text-[#1a6b5a]">
              ✓ Salvo
              {undoData && (
                <button onClick={async () => {
                  await supabase.from("DB3 - icp_archetypes").update({
                    icp_name: undoData?.icp_name ?? "",
                    pain_points: undoData?.pain_points ?? [],
                    value_prop: undoData?.value_prop ?? [],
                    status: undoData?.status ?? "ativo",
                    update_at: new Date().toISOString(),
                  }).eq("id", data?.id ?? "");
                  setIcpName(undoData?.icp_name ?? "");
                  setPainPoints(undoData?.pain_points ?? []);
                  setValueProps(undoData?.value_prop ?? []);
                  setStatus(undoData?.status ?? "ativo");
                  setSaveStatus("idle");
                }} className="underline text-gray-400 hover:text-gray-600 ml-1">desfazer</button>
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
              {icpName && <p className="text-sm font-medium text-gray-700">{icpName}</p>}
              {painPoints.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {painPoints.map((p, i) => (
                    <span key={i} className="text-xs bg-[#fef3f2] text-red-600 border border-red-100 px-2.5 py-1 rounded-full">{p}</span>
                  ))}
                </div>
              )}
              {valueProps.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {valueProps.map((v, i) => (
                    <span key={i} className="text-xs bg-[#f0f7f5] text-[#1a6b5a] border border-[#1a6b5a]/20 px-2.5 py-1 rounded-full">{v}</span>
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
          {/* Nome */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nome do perfil</label>
            <input type="text" value={icpName} onChange={e => setIcpName(e.target.value)}
              placeholder="Ex: Fundador Early Stage"
              className="w-full rounded-[8px] border border-[#e8e8e4] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/30 focus:border-[#1a6b5a] transition placeholder:text-gray-300" />
          </div>

          {/* Pontos de dor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pontos de dor</label>
            <div className="flex gap-2">
              <input type="text" value={painInput} onChange={e => setPainInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addItem(painPoints, setPainPoints, painInput, setPainInput)}
                placeholder="Ex: não tem tempo"
                className="flex-1 rounded-[8px] border border-[#e8e8e4] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/30 focus:border-[#1a6b5a] transition placeholder:text-gray-300" />
              <button onClick={() => addItem(painPoints, setPainPoints, painInput, setPainInput)}
                className="px-3 py-2 rounded-[8px] border border-[#e8e8e4] text-sm text-gray-500 hover:bg-gray-50 transition">
                + Adicionar
              </button>
            </div>
            {painPoints.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {painPoints.map(p => (
                  <span key={p} className="flex items-center gap-1.5 text-xs bg-[#fef3f2] text-red-600 border border-red-100 px-2.5 py-1 rounded-full">
                    {p}
                    <button onClick={() => removeItem(painPoints, setPainPoints, p)} className="hover:text-red-800">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Proposta de valor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Proposta de valor</label>
            <div className="flex gap-2">
              <input type="text" value={valuePropInput} onChange={e => setValuePropInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addItem(valueProps, setValueProps, valuePropInput, setValuePropInput)}
                placeholder="Ex: economiza 5h por semana"
                className="flex-1 rounded-[8px] border border-[#e8e8e4] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/30 focus:border-[#1a6b5a] transition placeholder:text-gray-300" />
              <button onClick={() => addItem(valueProps, setValueProps, valuePropInput, setValuePropInput)}
                className="px-3 py-2 rounded-[8px] border border-[#e8e8e4] text-sm text-gray-500 hover:bg-gray-50 transition">
                + Adicionar
              </button>
            </div>
            {valueProps.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {valueProps.map(v => (
                  <span key={v} className="flex items-center gap-1.5 text-xs bg-[#f0f7f5] text-[#1a6b5a] border border-[#1a6b5a]/20 px-2.5 py-1 rounded-full">
                    {v}
                    <button onClick={() => removeItem(valueProps, setValueProps, v)} className="hover:text-[#1a6b5a]">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
            <div className="flex gap-2">
              {["ativo", "inativo"].map(s => (
                <button key={s} onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 rounded-[8px] text-sm border capitalize transition ${
                    status === s ? "border-[#1a6b5a] bg-[#f0f7f5] text-[#1a6b5a] font-medium" : "border-[#e8e8e4] text-gray-500 hover:bg-gray-50"
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
