'use client'

import { useState } from 'react'
import { BrandParameters, ICPArchetype } from '@/lib/types'

interface Props {
  canal: string
  formato: string
  estilo: string
  objetivo: string
  tema: string
  personaId: string
  icps: ICPArchetype[]
  brandParams: BrandParameters | null
}

export function PainelOutput({
  canal,
  formato,
  estilo,
  objetivo,
  tema,
  personaId,
  icps,
  brandParams,
}: Props) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGerar() {
    setLoading(true)
    setError('')
    setContent('')

    const res = await fetch('/api/gerar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ canal, formato, estilo, objetivo, tema, personaId, icps, brandParams }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok || data.error) {
      setError(data.error ?? 'Erro ao gerar conteúdo')
    } else {
      setContent(data.content)
    }
  }

  return (
    <section className="flex-1 bg-[#f9f9f7] p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Criar Conteúdo
          </h1>
          <button
            onClick={handleGerar}
            disabled={loading}
            className="px-5 py-2 rounded-[10px] text-sm font-semibold bg-[#1a6b5a] text-white hover:bg-[#155a4a] transition disabled:opacity-50"
          >
            {loading ? 'Gerando…' : 'Gerar conteúdo'}
          </button>
        </div>

        {/* output card */}
        <div
          className="w-full bg-white rounded-[10px] p-6 min-h-[400px]"
          style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        >
          {loading && (
            <div className="flex items-center justify-center h-40">
              <span className="text-sm text-gray-400">Gerando conteúdo…</span>
            </div>
          )}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 rounded-[8px] p-4">
              {error}
            </div>
          )}
          {!loading && !error && content && (
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
              {content}
            </pre>
          )}
          {!loading && !error && !content && (
            <div className="flex items-center justify-center h-40">
              <span className="text-sm text-gray-300">
                Preencha as configurações e clique em &quot;Gerar conteúdo&quot;
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
