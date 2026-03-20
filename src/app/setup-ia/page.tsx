import { supabase } from "@/lib/supabase";
import { CURRENT_USER_CODE } from "@/lib/config";
import ParametroIAClient from "@/components/parametro-ia/ParametroIAClient";

export const dynamic = "force-dynamic";

export default async function SetupIAPage() {
  const { data: user } = await supabase
    .from("DB1 - users")
    .select("user_id")
    .eq("user_code", CURRENT_USER_CODE)
    .maybeSingle();

  const userId = user?.user_id ?? "";

  const { data: iaConfig } = await supabase
    .from("DB4 - ia_config")
    .select("*")
    .eq("user_code", CURRENT_USER_CODE)
    .maybeSingle();

  return (
    <div className="h-full overflow-y-auto bg-[#f9f9f7]">
      <ParametroIAClient
        userId={userId}
        userCode={CURRENT_USER_CODE}
        initialConfig={iaConfig ?? null}
      />
    </div>
  );
}
