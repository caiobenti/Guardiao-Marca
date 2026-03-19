import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { CURRENT_USER_CODE } from '@/lib/config'
import { DEFAULT_SYSTEM_PROMPT, DEFAULT_USER_TEMPLATE, buildPromptFromTemplate, buildVars } from '@/lib/prompts'
import { BrandParameters, ICPArchetype } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { canal, formato, estilo, objetivo, tema, personaId, icps, brandParams } = body

    const persona: ICPArchetype | null = icps?.find((p: ICPArchetype) => p.id === personaId) ?? null

    const supabase = createClient()

    // Fetch ia_config from DB4
    const { data: iaConfig } = await supabase
      .from('DB4 - ia_config')
      .select('*')
      .eq('user_code', CURRENT_USER_CODE)
      .maybeSingle()

    const systemPrompt = iaConfig?.system_prompt || DEFAULT_SYSTEM_PROMPT
    const userTemplate = iaConfig?.user_template || DEFAULT_USER_TEMPLATE
    const model = iaConfig?.model || 'llama-3.3-70b-versatile'
    const temperature = iaConfig?.temperature ?? 0.7
    const maxTokens = iaConfig?.max_tokens ?? 1000

    const vars = buildVars({ canal, formato, estilo, objetivo, tema, persona, brandParams })
    const userMessage = buildPromptFromTemplate(userTemplate, vars)

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'GROQ_API_KEY não configurada' }, { status: 500 })
    }

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature,
        max_tokens: maxTokens,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      }),
    })

    if (!groqRes.ok) {
      const errText = await groqRes.text()
      console.error('Groq error:', errText)
      return NextResponse.json({ error: `Groq: ${groqRes.status} — ${errText}` }, { status: 500 })
    }

    const groqData = await groqRes.json()
    const content = groqData.choices?.[0]?.message?.content ?? ''

    return NextResponse.json({ content })
  } catch (err: unknown) {
    console.error('Gerar error:', err)
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
