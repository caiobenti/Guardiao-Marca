export const dynamic = "force-dynamic";
import { supabase } from "@/lib/supabase";
import { CURRENT_USER_CODE } from "@/lib/config";
import { CriarLayout } from "@/components/criar/CriarLayout";

export default async function CriarPage() {
  const { data: icps } = await supabase
    .from("DB3 - icp_archetypes")
    .select("*")
    .eq("user_code", CURRENT_USER_CODE)
    .eq("status", "ativo")
    .order("created_at", { ascending: true });

  const { data: brandParams } = await supabase
    .from("DB2 - brand_parameters")
    .select("*")
    .eq("user_code", CURRENT_USER_CODE)
    .maybeSingle();

  return <CriarLayout icps={icps ?? []} brandParams={brandParams ?? undefined} />;
}
