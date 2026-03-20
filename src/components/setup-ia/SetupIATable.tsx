"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type VehicleRuleRow = {
  channel: string;
  format: string;
  output_schema: string;
  copy_limit: string;
  critical_preview: string;
  hook: string;
  intent: string;
  prompt_guide: string;
};

interface Props {
  userId: string;
  userCode: string;
  initialRows: VehicleRuleRow[];
}

function normalizeRows(rows: VehicleRuleRow[]): VehicleRuleRow[] {
  return [...rows]
    .map((row) => ({
      channel: row.channel ?? "",
      format: row.format ?? "",
      output_schema: row.output_schema ?? "",
      copy_limit: row.copy_limit ?? "",
      critical_preview: row.critical_preview ?? "",
      hook: row.hook ?? "",
      intent: row.intent ?? "",
      prompt_guide: row.prompt_guide ?? "",
    }))
    .sort((a, b) =>
      `${a.channel}::${a.format}`.localeCompare(`${b.channel}::${b.format}`)
    );
}

export default function SetupIATable({ userId, userCode, initialRows }: Props) {
  const [rows, setRows] = useState<VehicleRuleRow[]>(() => normalizeRows(initialRows));
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const initialSnapshotRef = useRef(JSON.stringify(normalizeRows(initialRows)));

  useEffect(() => {
    const currentSnapshot = JSON.stringify(normalizeRows(rows));
    setIsDirty(currentSnapshot !== initialSnapshotRef.current);
  }, [rows]);

  const hasRows = rows.length > 0;

  const tableRows = useMemo(() => rows, [rows]);

  function updateCell(
    index: number,
    field: keyof VehicleRuleRow,
    value: string
  ) {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  }

  async function handleSave() {
    setSaving(true);
    setSaveMsg("");

    const payload = rows.map((row) => ({
      user_code: userCode,
      user_id: userId,
      channel: row.channel,
      format: row.format,
      output_schema: row.output_schema,
      copy_limit: row.copy_limit,
      critical_preview: row.critical_preview,
      hook: row.hook,
      intent: row.intent,
      prompt_guide: row.prompt_guide,
    }));

    const { error } = await supabase
      .from("DB5 - ia_vehicle_rules")
      .upsert(payload, { onConflict: "user_code,channel,format" });

    setSaving(false);

    if (error) {
      setSaveMsg("Erro: " + error.message);
      return;
    }

    initialSnapshotRef.current = JSON.stringify(normalizeRows(rows));
    setIsDirty(false);
    setSaveMsg("Salvo!");
    setTimeout(() => setSaveMsg(""), 3000);
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-stone-800">Setup IA</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Regras do Bloco B em tabela (DB5)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {isDirty && (
            <span className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded-md">
              Mudanças não salvas
            </span>
          )}
          {saveMsg && (
            <span className="text-xs text-stone-600 bg-stone-200 px-2 py-1 rounded-md">
              {saveMsg}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={!isDirty || saving}
            className="bg-[#1a6b5a] hover:bg-[#145445] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {!hasRows ? (
          <div className="p-6 text-sm text-stone-500">
            Nenhuma regra encontrada na DB5 para este usuário.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1320px] w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr className="text-left text-xs uppercase tracking-wide text-stone-500">
                  <th className="px-3 py-3">Channel</th>
                  <th className="px-3 py-3">Format</th>
                  <th className="px-3 py-3">Output schema</th>
                  <th className="px-3 py-3">Copy limit</th>
                  <th className="px-3 py-3">Critical preview</th>
                  <th className="px-3 py-3">Hook</th>
                  <th className="px-3 py-3">Intent</th>
                  <th className="px-3 py-3">Prompt guide</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, index) => (
                  <tr key={`${row.channel}-${row.format}`} className="border-b border-stone-100 align-top">
                    <td className="px-3 py-3 text-sm text-stone-700">{row.channel}</td>
                    <td className="px-3 py-3 text-sm text-stone-700">{row.format}</td>
                    <td className="px-3 py-3">
                      <input
                        value={row.output_schema}
                        onChange={(e) => updateCell(index, "output_schema", e.target.value)}
                        className="w-full text-sm border border-stone-300 rounded-lg px-2 py-1.5"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        value={row.copy_limit}
                        onChange={(e) => updateCell(index, "copy_limit", e.target.value)}
                        className="w-full text-sm border border-stone-300 rounded-lg px-2 py-1.5"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        value={row.critical_preview}
                        onChange={(e) => updateCell(index, "critical_preview", e.target.value)}
                        className="w-full text-sm border border-stone-300 rounded-lg px-2 py-1.5"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        value={row.hook}
                        onChange={(e) => updateCell(index, "hook", e.target.value)}
                        className="w-full text-sm border border-stone-300 rounded-lg px-2 py-1.5"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        value={row.intent}
                        onChange={(e) => updateCell(index, "intent", e.target.value)}
                        className="w-full text-sm border border-stone-300 rounded-lg px-2 py-1.5"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <textarea
                        value={row.prompt_guide}
                        onChange={(e) => updateCell(index, "prompt_guide", e.target.value)}
                        rows={3}
                        className="w-full text-sm border border-stone-300 rounded-lg px-2 py-1.5 resize-y min-h-[84px]"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
