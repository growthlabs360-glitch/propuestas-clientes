"use client";

import { useState } from "react";
import { Form } from "@/components/Form";
import { Proposal } from "@/components/Proposal";
import { defaultData, ProposalData } from "@/components/types";

export default function Page() {
  const [data, setData] = useState<ProposalData>(defaultData);
  const [view, setView] = useState<"split" | "full">("split");

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `propuesta-${data.clientName.toLowerCase().replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        setData({ ...defaultData, ...parsed });
      } catch {
        alert("Archivo JSON inválido");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="no-print sticky top-0 z-50 border-b border-brand-line bg-brand-black/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-brand-orange shadow-glow" />
            <span className="font-display text-base font-bold tracking-tight">
              Generador de propuestas
            </span>
            <span className="ml-2 hidden text-xs uppercase tracking-widest text-brand-soft sm:inline">
              negro · naranja · premium
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setView((v) => (v === "split" ? "full" : "split"))
              }
              className="rounded-full border border-brand-line px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white hover:border-brand-orange"
            >
              {view === "split" ? "Solo preview" : "Editar"}
            </button>
            <label className="cursor-pointer rounded-full border border-brand-line px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white hover:border-brand-orange">
              Importar
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] && handleImportJson(e.target.files[0])
                }
              />
            </label>
            <button
              type="button"
              onClick={handleExportJson}
              className="rounded-full border border-brand-line px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white hover:border-brand-orange"
            >
              Exportar JSON
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-full bg-brand-orange px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-orange-400"
            >
              Imprimir / PDF
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-[1600px] px-6 py-6">
        <div
          className={
            view === "split"
              ? "grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]"
              : "grid gap-6"
          }
        >
          {view === "split" && (
            <aside className="no-print h-[calc(100vh-110px)] overflow-y-auto rounded-2xl border border-brand-line bg-brand-gray/30 p-5">
              <Form data={data} onChange={setData} />
            </aside>
          )}

          <section className="rounded-2xl border border-brand-line bg-brand-black overflow-hidden">
            <Proposal data={data} />
          </section>
        </div>
      </main>
    </div>
  );
}
