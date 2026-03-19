'use client'

import { useState } from 'react'
import { PainelInputs } from './PainelInputs'
import { PainelOutput } from './PainelOutput'
import { BrandParameters, ICPArchetype } from '@/lib/types'

interface Props {
  icps: ICPArchetype[]
  brandParams: BrandParameters | null
}

export function CriarLayout({ icps, brandParams }: Props) {
  const [canal, setCan] = useState('')
  const [formato, setFormato] = useState('')
  const [estilo, setEstilo] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [tema, setTema] = useState('')
  const [personaId, setPersonaId] = useState('')

  return (
    <div className="flex h-full min-h-screen">
      <PainelInputs
        canal={canal}
        formato={formato}
        estilo={estilo}
        objetivo={objetivo}
        tema={tema}
        personaId={personaId}
        icps={icps}
        onCanalChange={setCan}
        onFormatoChange={setFormato}
        onEstiloChange={setEstilo}
        onObjetivoChange={setObjetivo}
        onTemaChange={setTema}
        onPersonaIdChange={setPersonaId}
      />
      <PainelOutput
        canal={canal}
        formato={formato}
        estilo={estilo}
        objetivo={objetivo}
        tema={tema}
        personaId={personaId}
        icps={icps}
        brandParams={brandParams}
      />
    </div>
  )
}
