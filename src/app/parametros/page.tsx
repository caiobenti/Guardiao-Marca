export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import { CURRENT_USER_CODE } from "@/lib/config";
import { VozEscrita } from "@/components/parametros/VozEscrita";
import { DNAVisual } from "@/components/parametros/DNAVisual";
import { ICPCard } from "@/components/parametros/ICPCard";

export default async function ParametrosPage() {
  // 1. Valida se o user_code existe no DB1
  const { data: user, error: userError } = await supabase
    .from("DB1 - users")
    .select("*")
    .eq("user_code", CURRENT_USER_CODE)
    .single();

  if (userError || !user) {
    return (
      <div className="h-full bg-[#f9f9f7] flex items-center justify-center">
        <div
          className="bg-white rounded-[10px] p-8 border border-[#e8e8e4] text-center max-w-sm"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
          <div className="text-2xl mb-2">⚠️</div>
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            Usuário não encontrado
          </h2>
          <p className="text-sm text-gray-400">
            O código <span className="font-mono text-gray-600">{CURRENT_USER_CODE}</span> não existe na base de dados.
          </p>
        </div>
      </div>
    );
  }

  // 2. Busca parâmetros de marca no DB2
  const { data: brandParams } = await supabase
    .from("DB2 - brand_parameters")
    .select("*")
    .eq("user_code", CURRENT_USER_CODE)
    .maybeSingle();

  // 3. Busca todas as personas do DB3 (múltiplas)
  const { data: icps } = await supabase
    .from("DB3 - icp_archetypes")
    .select("*")
    .eq("user_code", CURRENT_USER_CODE)
    .order("created_at", { ascending: true });

  return (
    <div className="h-full overflow-y-auto bg-[#f9f9f7] py-8 px-6">
      <div className="max-w-[900px] mx-auto flex flex-col gap-5">

        {/* Cabeçalho */}
        <div className="flex items-baseline justify-between">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Parâmetros</h1>
          <span className="text-xs text-gray-400">
            {user.user_name} ·{" "}
            <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{CURRENT_USER_CODE}</span>
          </span>
        </div>

        {/* Grid 2 colunas */}
        <div className="grid grid-cols-2 gap-4">
          <VozEscrita data={brandParams ?? undefined} userCode={CURRENT_USER_CODE} userId={user.user_id} />
          <DNAVisual data={brandParams ?? undefined} userCode={CURRENT_USER_CODE} userId={user.user_id} />
        </div>

        {/* Bloco full-width */}
        <ICPCard data={icps ?? []} userCode={CURRENT_USER_CODE} userId={user.user_id} />

      </div>
    </div>
  );
}
