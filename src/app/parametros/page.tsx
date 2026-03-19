import { VozEscrita } from "@/components/parametros/VozEscrita";
import { DNAVisual } from "@/components/parametros/DNAVisual";
import { ICPCard } from "@/components/parametros/ICPCard";

export default function ParametrosPage() {
  return (
    <div className="min-h-screen bg-[#f9f9f7] py-10 px-6">
      <div className="max-w-[760px] mx-auto flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Parâmetros
        </h1>
        <VozEscrita />
        <DNAVisual />
        <ICPCard />
      </div>
    </div>
  );
}
