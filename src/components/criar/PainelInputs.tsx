'use client'

import { BrandParameters, ICPArchetype } from '@/lib/types'

interface Props {
  canal: string
  formato: string
  estilo: string
  objetivo: string
  tema: string
  personaId: string
  icps: ICPArchetype[]
  onCanalChange: (v: string) => void
  onFormatoChange: (v: string) => void
  onEstiloChange: (v: string) => void
  onObjetivoChange: (v: string) => void
  onTemaChange: (v: string) => void
  onPersonaIdChange: (v: string) => void
}

export function PainelInputs({
  canal,
  formato,
  estilo,
  objetivo,
  tema,
  personaId,
  icps,
  onCanalChange,
  onFormatoChange,
  onEstiloChange,
  onObjetivoChange,
  onTemaChange,
  onPersonaIdChange,
}: Props) {
  return (
    <aside className="w-[320px] shrink-0 h-screen sticky top-0 bg-white border-r border-[#e8e8e4] flex flex-col overflow-y-auto">
      <div className="px-6 py-6 border-b border-[#e8e8e4]">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
          Configurações
        </h2>
      </div>
      <div className="flex-1 p-6 flex flex-col gap-4">

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Canal</label>
          <input
            type="text"
            value={canal}
            onChange={e => onCanalChange(e.target.value)}
            placeholder="Ex: Instagram, LinkedIn"
            className="rounded-[8px] border border-[#e8e8e4] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/30 focus:border-[#1a6b5a] transition placeholder:text-gray-300"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Formato</label>
          <input
            type="text"
            value={formato}
            onChange={e => onFormatoChange(e.target.value)}
            placeholder="Ex: post, stories, carrossel"
            className="rounded-[8px] border border-[#e8e8e4] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/30 focus:border-[#1a6b5a] transition placeholder:text-gray-300"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Estilo</label>
          <input
            type="text"
            value={estilo}
            onChange={e => onEstiloChange(e.target.value)}
            placeholder="Ex: educativo, inspirador"
            className="rounded-[8px] border border-[#e8e8e4] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/30 focus:border-[#1a6b5a] transition placeholder:text-gray-300"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Objetivo</label>
          <input
            type="text"
            value={objetivo}
            onChange={e => onObjetivoChange(e.target.value)}
            placeholder="Ex: gerar leads, engajamento"
            className="rounded-[8px] border border-[#e8e8e4] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/30 focus:border-[#1a6b5a] transition placeholder:text-gray-300"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Tema / Assunto</label>
          <textarea
            value={tema}
            onChange={e => onTemaChange(e.target.value)}
            rows={3}
            placeholder="Descreva o tema do conteúdo..."
            className="rounded-[8px] border border-[#e8e8e4] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/30 focus:border-[#1a6b5a] transition placeholder:text-gray-300 resize-none"
          />
        </div>

        {icps.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Persona</label>
            <select
              value={personaId}
              onChange={e => onPersonaIdChange(e.target.value)}
              className="rounded-[8px] border border-[#e8e8e4] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/30 focus:border-[#1a6b5a] transition"
            >
              <option value="">Nenhuma persona</option>
              {icps.map(icp => (
                <option key={icp.id} value={icp.id}>{icp.name ?? icp.id}</option>
              ))}
            </select>
          </div>
        )}

      </div>
    </aside>
  )
}
