"use client";

import { useState } from "react";

const MERCADO_OPTIONS = [
  { value: "", label: "Selecione B2B ou B2C…" },
  { value: "B2B", label: "B2B" },
  { value: "B2C", label: "B2C" },
];

const PORTE_OPTIONS = [
  { value: "", label: "Selecione o porte…" },
  { value: "Individual", label: "Individual" },
  { value: "2–10", label: "2–10" },
  { value: "11–50", label: "11–50" },
  { value: "51–200", label: "51–200" },
  { value: "201–500", label: "201–500" },
  { value: "501–1k", label: "501–1k" },
  { value: "1k–10k", label: "1k–10k" },
  { value: "10k+", label: "10k+" },
];

const CARGO_OPTIONS = [
  { value: "", label: "Selecione o cargo…" },
  { value: "CEO/Founder", label: "CEO/Founder" },
  { value: "COO", label: "COO" },
  { value: "CFO", label: "CFO" },
  { value: "CTO/CIO", label: "CTO/CIO" },
  { value: "CMO", label: "CMO" },
  { value: "Diretor Comercial", label: "Diretor Comercial" },
  { value: "Diretor de Operações", label: "Diretor de Operações" },
  { value: "Diretor de TI", label: "Diretor de TI" },
  { value: "Gerente de Processos", label: "Gerente de Processos" },
  { value: "Gerente Comercial", label: "Gerente Comercial" },
  { value: "Gerente de TI", label: "Gerente de TI" },
  { value: "Coordenador", label: "Coordenador" },
  { value: "Analista", label: "Analista" },
];

const SETOR_OPTIONS = [
  { value: "", label: "Selecione o setor…" },
  { value: "Indústria", label: "Indústria" },
  { value: "Logística & Transporte", label: "Logística & Transporte" },
  { value: "Varejo", label: "Varejo" },
  { value: "Saúde", label: "Saúde" },
  { value: "Educação", label: "Educação" },
  { value: "Financeiro & Fintechs", label: "Financeiro & Fintechs" },
  { value: "Agro", label: "Agro" },
  { value: "Construção & Engenharia", label: "Construção & Engenharia" },
  { value: "Serviços Profissionais", label: "Serviços Profissionais" },
  { value: "SaaS & Tech", label: "SaaS & Tech" },
];

const MATURIDADE_OPTIONS = [
  { value: "", label: "Selecione a maturidade digital…" },
  {
    value: "Analógico (planilha/papel)",
    label: "Analógico (planilha/papel)",
  },
  {
    value: "Digital básico (ERP, sistemas)",
    label: "Digital básico (ERP, sistemas)",
  },
  {
    value: "Digital avançado (dados, dashboards)",
    label: "Digital avançado (dados, dashboards)",
  },
  {
    value: "IA-ready (já experimenta IA)",
    label: "IA-ready (já experimenta IA)",
  },
];

const TOM_OPTIONS = [
  { value: "", label: "Selecione o tom…" },
  { value: "Cético", label: "Cético" },
  { value: "Pragmático", label: "Pragmático" },
  { value: "Curioso", label: "Curioso" },
  { value: "Entusiasta", label: "Entusiasta" },
];

const fieldClass =
  "w-full text-sm text-gray-800 bg-[#f9f9f7] border border-[#e8e8e4] rounded-[8px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a6b5a]/30 focus:border-[#1a6b5a]";

export function SimuladorPersonaClient() {
  const [mercado, setMercado] = useState("");
  const [porte, setPorte] = useState("");
  const [cargo, setCargo] = useState("");
  const [setor, setSetor] = useState("");
  const [maturidade, setMaturidade] = useState("");
  const [tom, setTom] = useState("");
  const [dorPrincipal, setDorPrincipal] = useState("");
  const [pedido, setPedido] = useState("");

  return (
    <div className="h-full overflow-y-auto bg-[#f9f9f7] py-8 px-6">
      <div className="max-w-[900px] mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Simulador de persona
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monte um perfil fictício para testar mensagens. Nada é salvo por
            enquanto.
          </p>
        </div>

        <div
          className="bg-white rounded-[10px] border border-[#e8e8e4] p-6 sm:p-8"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                1. Mercado
              </span>
              <select
                value={mercado}
                onChange={(e) => setMercado(e.target.value)}
                className={fieldClass}
              >
                {MERCADO_OPTIONS.map((o) => (
                  <option key={o.value || "placeholder"} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                2. Porte
              </span>
              <select
                value={porte}
                onChange={(e) => setPorte(e.target.value)}
                className={fieldClass}
              >
                {PORTE_OPTIONS.map((o) => (
                  <option key={o.value || "placeholder"} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                3. Cargo
              </span>
              <select
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                className={fieldClass}
              >
                {CARGO_OPTIONS.map((o) => (
                  <option key={o.value || "placeholder"} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                4. Setor
              </span>
              <select
                value={setor}
                onChange={(e) => setSetor(e.target.value)}
                className={fieldClass}
              >
                {SETOR_OPTIONS.map((o) => (
                  <option key={o.value || "placeholder"} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                5. Maturidade digital
              </span>
              <select
                value={maturidade}
                onChange={(e) => setMaturidade(e.target.value)}
                className={fieldClass}
              >
                {MATURIDADE_OPTIONS.map((o) => (
                  <option key={o.value || "placeholder"} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                6. Tom / personalidade
              </span>
              <select
                value={tom}
                onChange={(e) => setTom(e.target.value)}
                className={fieldClass}
              >
                {TOM_OPTIONS.map((o) => (
                  <option key={o.value || "placeholder"} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                7. Dor principal
              </span>
              <textarea
                value={dorPrincipal}
                onChange={(e) => setDorPrincipal(e.target.value)}
                rows={4}
                placeholder='Ex: "minha equipe perde 3h/dia preenchendo relatórios manualmente"'
                className={`${fieldClass} resize-y min-h-[100px] placeholder:text-gray-300`}
              />
            </label>

            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Pedido (campo aberto)
              </span>
              <textarea
                value={pedido}
                onChange={(e) => setPedido(e.target.value)}
                rows={5}
                placeholder="Descreva o que você quer que a marca comunique ou teste com essa persona simulada…"
                className={`${fieldClass} resize-y min-h-[120px] placeholder:text-gray-300`}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
