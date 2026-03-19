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
      <div className="min-h-screen bg-[#f9f9f7] flex items-center justify-center">
        <div
          className="bg-white rounded-[10px] p-8 border border-[#e8e8e4] text-center max-w-sm"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
          <div className="text-2xl mb-2">⚠️</div>
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            Usuário não encontrado
          </h2>
          <p className="text-sm text-gray-400 mb-3">
            O código <span className="font-mono text-gray-600">{CURRENT_USER_CODE}</span> não existe na base de dados.
          </p>
          {/* DEBUG TEMPORÁRIO — remover depois */}
          <div className="text-left bg-gray-50 rounded p-3 text-xs font-mono text-gray-500 break-all">
            <p><b>URL:</b> {process.env.NEXT_PUBLIC_SUPABASE_URL ?? "❌ não definida"}</p>
            <p><b>KEY:</b> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓ definida" : "❌ não definida"}</p>
            <p><b>Erro:</b> {userError?.message ?? "sem erro (retornou vazio)"}</p>
          </div>
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

  // 3. Busca ICP ativo no DB3
  const { data: icp } = await supabase
    .from("DB3 - icp_archetypes")
    .select("*")
    .eq("user_code", CURRENT_USER_CODE)
    .eq("status", "ativo")
    .maybeSingle();

  return (
    <div className="min-h-screen bg-[#f9f9f7] py-10 px-6">
      <div className="max-w-[760px] mx-auto flex flex-col gap-6">

        {/* Cabeçalho */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Parâmetros
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Olá, <span className="text-gray-600 font-medium">{user.user_name}</span>
            {" "}·{" "}
            <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
              {CURRENT_USER_CODE}
            </span>
          </p>
        </div>

        {/* Componentes conectados ao DB */}
        <VozEscrita data={brandParams ?? undefined} userCode={CURRENT_USER_CODE} />
        <DNAVisual data={brandParams ?? undefined} userCode={CURRENT_USER_CODE} />
        <ICPCard data={icp ?? undefined} userCode={CURRENT_USER_CODE} />

      </div>
    </div>
  );
}
