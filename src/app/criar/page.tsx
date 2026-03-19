import { createClient } from '@/lib/supabase'
import { CURRENT_USER_CODE } from '@/lib/config'
import { CriarLayout } from '@/components/criar/CriarLayout'

export const dynamic = 'force-dynamic'

export default async function CriarPage() {
  const supabase = createClient()

  const { data: brandParams } = await supabase
    .from('DB2 - brand_parameters')
    .select('*')
    .eq('user_code', CURRENT_USER_CODE)
    .maybeSingle()

  const { data: icps } = await supabase
    .from('DB3 - icp_archetypes')
    .select('*')
    .eq('user_code', CURRENT_USER_CODE)
    .order('created_at', { ascending: true })

  return (
    <CriarLayout
      icps={icps ?? []}
      brandParams={brandParams ?? null}
    />
  )
}
