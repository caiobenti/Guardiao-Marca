export function PainelOutput() {
  return (
    <section className="flex-1 bg-[#f9f9f7] p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">
          Criar Conteúdo
        </h1>

        {/* output card */}
        <div
          className="w-full bg-white rounded-[10px] p-6 min-h-[400px]"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
          {/* output virá aqui */}
        </div>
      </div>
    </section>
  );
}
