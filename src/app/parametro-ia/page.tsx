import { supabase } from "@/lib/supabase";
import { CURRENT_USER_CODE } from "@/lib/config";
import ParametroIAClient from "@/components/parametro-ia/ParametroIAClient";

export const dynamic = "force-dynamic";

export default async function ParametroIAPage() {
  // Get user from DB1
  const { data: user } = await supabase
    .from("DB1 - users")
    .select("id")
    .eq("user_code", CURRENT_USER_CODE)
    .maybeSingle();

  const userId = user?.id ?? "";

  // Get ia_config from DB4
  const { data: iaConfig } = await supabase
    .from("DB4 - ia_config")
    .select("*")
    .eq("user_code", CURRENT_USER_CODE)
    .maybeSingle();

  return (
    <ParametroIAClient
      userId={userId}
      userCode={CURRENT_USER_CODE}
      initialConfig={iaConfig ?? null}
    />
  );
}
