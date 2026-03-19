"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { ICPArchetype } from "@/lib/types";

// ─── Tipos ─────────────────────────────────────────────────────────────────
type SaveStatus = "idle" | "pending" | "saving" | "saved" | "error";

interface ICPItemProps {
  icp: ICPArchetype;
  userCode: string;
}

interface Props {
  data: ICPArchetype[];
  userCode: string;
}

// ─── Item individual de ICP ────────────────────────────────────────────────
function ICPItem({ icp, userCode }: ICPItemProps) {
  const [icpName, setIcpName] = useState(icp.icp_name ?? "");
  const [painPoints, setPainPoints] = useState<string[]>(icp.pain_points ?? []);
  const [valueProps, setValueProps] = useState<string[]>(icp.value_prop ?? []);
  const [status, setStatus] = useState(icp.status ?? "ativo");
  const [painInput, setPainInput] = useState("");
  const [valuePropInput, setValuePropInput] = useState("");
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

      const { error } = await supabase
        .from("DB3 - icp_archetypes")
        .update({
          icp_name: icpName,
          pain_points: painPoints,
          value_prop: valueProps,
          status,
          update_at: new Date().toISOString(),
        })
        .eq("id", icp.id);

      if (error) {
        console.error(`[ICPItem id=${icp.id}] Erro ao salvar:`, error.message);
        setSaveStatus("error");
        return;
      }

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }, 1500);

    return () => clearTimeout(timer);
  }, [icpName, painPoints, valueProps, status, icp.id, userCode]);

  function addItem(
    list: string[],
    setList: (v: string[]) => void,
    input: string,
    setInput: (v: string) => void
  ) {
    const val = input.trim();
    if (val && !list.includes(val)) setList([...list, val]);
    setInput("");
  }

  function removeItem(list: string[], setList: (v: string[]) => void, item: string) {
    setList(list.filter(i => i !== item));
  }

  return (
    <div className="border border-[#e8e8e4] rounded-[10px] overflow-hidden">

      {/* Barra da persona */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-[#e8e8e4]">
        <input
          type="text"
          value={icpName}
          onChange={e => setIcpName(e.target.value)}
          placeholder="Nome da persona"
          className="text-sm font-medium text-gray-800 bg-transparent border-none outline-none flex-1 placeholder:text-gray-300"
        />
        <div className="flex items-center gap-3 shrink-0">
          {saveStatus === "pending" && <span className="text-xs text-amber-500">● não salvo</span>}
          {saveStatus === "saving" && <span className="text-xs text-gray-400">Salvando...</span>}
          {saveStatus === "saved" && <span className="text-xs text-[#1a6b5a]">✓ Salvo</span>}
          {saveStatus === "error" && <span className="text-xs text-red-500">Erro</span>}
          {/* Status toggle */}
          <div className="flex gap-1">
            {["ativo", "inativo"].map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-2 py-0.5 rounded-full text-xs capitalize transition ${
                  status === s
                    ? s === "ativo"
                      ? "bg-[#f0f7f5] text-[#1a6b5a] font-medium"
                      : "bg-gray-200 text-gray-500 font-medium"
                    : "text-gray-300 hover:text-gray-500"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Campos */}
      <div className="px-4 py-4 flex flex-col gap-4">

        {/* Pontos de dor */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Pontos de dor</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={painInput}
              onChange={e => setPainInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addItem(painPoints, setPainPoints, painInput, setPainInput)}
              placeholder="Ex: não tem tempo"
              className="flex-1 rounded-[8px] border border-[#e8e8e4] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/30 focus:border-[#1a6b5a] transition placeholder:text-gray-300"
            />
            <button
              onClick={() => addItem(painPoints, setPainPoints, painInput, setPainInput)}
              className="px-3 py-2 rounded-[8px] border border-[#e8e8e4] text-sm text-gray-500 hover:bg-gray-50 transition whitespace-nowrap"
            >
              + Adicionar
            </button>
          </div>
          {painPoints.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {painPoints.map(p => (
                <span key={p} className="flex items-center gap-1 text-xs bg-[#fef3f2] text-red-600 border border-red-100 px-2.5 py-1 rounded-full">
                  {p}
                  <button onClick={() => removeItem(painPoints, setPainPoints, p)} className="opacity-50 hover:opacity-100 leading-none">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Proposta de valor */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Proposta de valor</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={valuePropInput}
              onChange={e => setValuePropInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addItem(valueProps, setValueProps, valuePropInput, setValuePropInput)}
              placeholder="Ex: economiza 5h por semana"
              className="flex-1 rounded-[8px] border border-[#e8e8e4] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/30 focus:border-[#1a6b5a] transition placeholder:text-gray-300"
            />
            <button
              onClick={() => addItem(valueProps, setValueProps, valuePropInput, setValuePropInput)}
              className="px-3 py-2 rounded-[8px] border border-[#e8e8e4] text-sm text-gray-500 hover:bg-gray-50 transition whitespace-nowrap"
            >
              + Adicionar
            </button>
          </div>
          {valueProps.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {valueProps.map(v => (
                <span key={v} className="flex items-center gap-1 text-xs bg-[#f0f7f5] text-[#1a6b5a] border border-[#1a6b5a]/20 px-2.5 py-1 rounded-full">
                  {v}
                  <button onClick={() => removeItem(valueProps, setValueProps, v)} className="opacity-50 hover:opacity-100 leading-none">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── Lista de ICPs ─────────────────────────────────────────────────────────
export function ICPCard({ data, userCode }: Props) {
  const [icps, setIcps] = useState<ICPArchetype[]>(data);
  const [creating, setCreating] = useState(false);

  // Busca todas as personas do banco
  async function handleRefresh() {
    const { data: fresh, error } = await supabase
      .from("DB3 - icp_archetypes")
      .select("*")
      .eq("user_code", userCode)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[ICPCard] Erro ao atualizar:", error.message);
      return;
    }

    setIcps(fresh ?? []);
  }

  // Cria nova persona em branco
  async function handleAddPersona() {
    setCreating(true);

    const { data: newIcp, error } = await supabase
      .from("DB3 - icp_archetypes")
      .insert({
        user_code: userCode,
        icp_name: "Nova Persona",
        pain_points: [],
        value_prop: [],
        status: "ativo",
        created_at: new Date().toISOString(),
        update_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("[ICPCard] Erro ao criar persona:", error.message);
      setCreating(false);
      return;
    }

    setIcps(prev => [...prev, newIcp as ICPArchetype]);
    setCreating(false);
  }

  return (
    <div className="bg-white rounded-[10px] border border-[#e8e8e4]" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

      {/* Cabeçalho */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e8e4]">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-900">Personas / ICP</h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{icps.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleRefresh} className="text-xs font-medium text-[#1a6b5a] hover:underline">
            Atualizar
          </button>
          <button
            onClick={handleAddPersona}
            disabled={creating}
            className="text-xs font-medium px-3 py-1.5 rounded-[8px] bg-[#1a6b5a] text-white hover:bg-[#155a4a] transition disabled:opacity-50"
          >
            {creating ? "Criando..." : "+ Nova Persona"}
          </button>
        </div>
      </div>

      {/* Lista */}
      <div className="p-5 flex flex-col gap-4">
        {icps.length === 0 ? (
          <p className="text-sm text-gray-300 text-center py-4">
            Nenhuma persona criada ainda. Clique em &quot;+ Nova Persona&quot; para começar.
          </p>
        ) : (
          icps.map(icp => (
            <ICPItem key={icp.id} icp={icp} userCode={userCode} />
          ))
        )}
      </div>

    </div>
  );
}
