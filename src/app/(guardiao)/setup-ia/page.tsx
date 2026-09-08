import { supabase } from "@/lib/supabase";
import { CURRENT_USER_CODE } from "@/lib/config";
import SetupIATable from "@/components/setup-ia/SetupIATable";

export const dynamic = "force-dynamic";

export default async function SetupIAPage() {
  const { data: user } = await supabase
    .from("DB1 - users")
    .select("user_id")
    .eq("user_code", CURRENT_USER_CODE)
    .maybeSingle();

  const userId = user?.user_id ?? "";

  const { data: vehicleRules } = await supabase
    .from("DB5 - ia_vehicle_rules")
    .select("channel, format, output_schema, copy_limit, critical_preview, hook, intent, prompt_guide")
    .eq("user_code", CURRENT_USER_CODE);

  return (
    <div className="h-full overflow-y-auto bg-[#f9f9f7]">
      <SetupIATable
        userId={userId}
        userCode={CURRENT_USER_CODE}
        initialRows={vehicleRules ?? []}
      />
    </div>
  );
}
