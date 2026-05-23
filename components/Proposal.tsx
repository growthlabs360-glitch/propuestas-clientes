"use client";

import { ProposalData } from "./types";

const fmt = (n: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

export function Proposal({ data }: { data: ProposalData }) {
  const installationTotal = data.services
    .filter((s) => s.priceMode === "installation")
    .reduce((a, b) => a + b.price, 0);

  const monthlyTotal = data.services
    .filter((s) => s.priceMode === "monthly")
    .reduce((a, b) => a + b.price, 0);

  const discountAmount = Math.round(
    (installationTotal * data.discountPct) / 100,
  );
  const installationFinal = installationTotal - discountAmount;

  const monthlyPlan =
    data.monthlyPlanPct > 0
      ? Math.round((installationFinal * data.monthlyPlanPct) / 100)
      : 0;

  return (
    <div className="print-area bg-brand-black text-white">
      {/* COVER */}
      <section className="print-page relative min-h-[760px] overflow-hidden p-12">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-orange/20 blur-3xl" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-brand-orange shadow-glow" />
              <span className="font-display text-lg font-bold tracking-tight">
                {data.brandName}
              </span>
            </div>
            <span className="text-xs uppercase tracking-[0.25em] text-brand-soft">
              {new Date().toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="mt-16">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-brand-orange">
              {data.brandTagline}
            </p>
            <h1 className="font-display text-5xl font-bold leading-[1.05] sm:text-6xl">
              Propuesta para
              <br />
              <span className="gradient-text">{data.clientName}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-brand-soft">
              Diseñada para resolver retos específicos en {data.industry}.
              Plan claro, KPIs medibles, ROI desde el primer mes.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-brand-line pt-6">
            <Pill label="Industria" value={data.industry} />
            <Pill label="Timing" value={data.timing} />
            <Pill label="Servicios" value={`${data.services.length} módulos`} />
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="print-page border-t border-brand-line p-12">
        <SectionLabel n="01" title="El problema" />
        <h2 className="font-display mt-4 text-3xl font-bold leading-tight sm:text-4xl">
          Lo que está bloqueando crecimiento en{" "}
          <span className="gradient-text">{data.clientName}</span>
        </h2>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-brand-soft">
          {data.problem}
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            ["Tiempo perdido", "Procesos manuales saturan al equipo"],
            ["Revenue fugado", "Leads sin nurturing se enfrían"],
            ["Sin visibilidad", "Métricas dispersas, sin un único panel"],
          ].map(([title, sub]) => (
            <div
              key={title}
              className="rounded-2xl border border-brand-line bg-brand-gray/40 p-5"
            >
              <div className="mb-2 h-1 w-8 rounded-full bg-brand-orange" />
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="mt-1 text-sm text-brand-soft">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="print-page border-t border-brand-line p-12">
        <SectionLabel n="02" title="La solución" />
        <h2 className="font-display mt-4 text-3xl font-bold sm:text-4xl">
          Los módulos que vamos a implementar
        </h2>
        <p className="mt-3 max-w-2xl text-brand-soft">
          Cada módulo entrega un resultado medible. Combínalos según
          prioridades y presupuesto.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data.services.map((s, i) => (
            <div
              key={i}
              className="card-hover relative flex flex-col rounded-2xl border border-brand-line bg-brand-gray/40 p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="font-display text-2xl font-bold text-brand-orange">
                  0{i + 1}
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
                    s.priceMode === "monthly"
                      ? "bg-brand-orange/15 text-brand-orange"
                      : "bg-white/5 text-white"
                  }`}
                >
                  {s.priceMode === "monthly" ? "Mensual" : "Instalación"}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold leading-snug">
                {s.name}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-soft">
                {s.benefit}
              </p>
              <div className="mt-6 border-t border-brand-line pt-4">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-3xl font-bold text-white">
                    {fmt(s.price)}
                  </span>
                  <span className="text-xs text-brand-soft">
                    {s.priceMode === "monthly" ? "/ mes" : "una vez"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="print-page border-t border-brand-line p-12">
        <SectionLabel n="03" title="Timeline" />
        <h2 className="font-display mt-4 text-3xl font-bold sm:text-4xl">
          Cómo se ejecuta semana a semana
        </h2>

        <div className="relative mt-12">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-brand-line md:block" />
          <div className="grid gap-6 md:grid-cols-4">
            {data.timeline.map((p, i) => (
              <div key={i} className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-brand-orange bg-brand-black font-display font-bold text-brand-orange">
                    {i + 1}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-brand-orange">
                    {p.duration}
                  </div>
                </div>
                <div className="font-display text-lg font-bold">{p.phase}</div>
                <div className="mt-2 text-sm text-brand-soft leading-relaxed">
                  {p.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING BREAKDOWN */}
      <section className="print-page border-t border-brand-line p-12">
        <SectionLabel n="04" title="Inversión" />
        <h2 className="font-display mt-4 text-3xl font-bold sm:text-4xl">
          Desglose de la inversión
        </h2>

        <div className="mt-10 overflow-hidden rounded-2xl border border-brand-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-gray/60">
              <tr>
                <th className="px-5 py-4 font-semibold uppercase tracking-widest text-brand-soft text-[11px]">
                  Servicio
                </th>
                <th className="px-5 py-4 font-semibold uppercase tracking-widest text-brand-soft text-[11px]">
                  Tipo
                </th>
                <th className="px-5 py-4 text-right font-semibold uppercase tracking-widest text-brand-soft text-[11px]">
                  Precio
                </th>
              </tr>
            </thead>
            <tbody>
              {data.services.map((s, i) => (
                <tr
                  key={i}
                  className="border-t border-brand-line bg-brand-black/40"
                >
                  <td className="px-5 py-4 font-medium text-white">
                    {s.name}
                  </td>
                  <td className="px-5 py-4 text-brand-soft">
                    {s.priceMode === "monthly" ? "Mensual" : "Instalación"}
                  </td>
                  <td className="px-5 py-4 text-right font-semibold text-white">
                    {fmt(s.price)}
                    <span className="ml-1 text-xs text-brand-soft">
                      {s.priceMode === "monthly" ? "/mes" : ""}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <SummaryBox
            label="Instalación (one-time)"
            value={fmt(installationTotal)}
            sub={
              data.discountPct > 0
                ? `Descuento ${data.discountPct}% = -${fmt(discountAmount)}`
                : undefined
            }
          />
          <SummaryBox
            label="Mensualidad recurrente"
            value={`${fmt(monthlyTotal)} / mes`}
            sub={monthlyTotal > 0 ? "Servicios suscritos" : "Sin servicios mensuales"}
          />
        </div>
      </section>

      {/* TOTAL + MONTHLY */}
      <section className="print-page border-t border-brand-line p-12">
        <SectionLabel n="05" title="Total" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-brand-orange bg-gradient-to-br from-brand-orange/15 via-brand-black to-brand-black p-8 glow-orange">
            <div className="text-xs font-bold uppercase tracking-widest text-brand-orange">
              Total instalación
            </div>
            <div className="mt-2 font-display text-5xl font-bold text-white">
              {fmt(installationFinal)}
            </div>
            {data.discountPct > 0 && (
              <div className="mt-1 text-sm text-brand-soft">
                <span className="line-through">{fmt(installationTotal)}</span>{" "}
                · {data.discountPct}% off aplicado
              </div>
            )}
            {monthlyPlan > 0 && (
              <div className="mt-6 rounded-xl border border-brand-line bg-brand-black/60 p-4">
                <div className="text-[11px] font-bold uppercase tracking-widest text-brand-soft">
                  Plan mensual opcional
                </div>
                <div className="mt-1 font-display text-xl font-bold">
                  {fmt(monthlyPlan)} / mes
                </div>
                <div className="text-xs text-brand-soft">
                  Equivalente al {data.monthlyPlanPct}% mensual del total de instalación.
                </div>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-brand-line bg-brand-gray/40 p-8">
            <div className="text-xs font-bold uppercase tracking-widest text-brand-soft">
              Mensualidad recurrente
            </div>
            <div className="mt-2 font-display text-5xl font-bold text-white">
              {fmt(monthlyTotal)}
              <span className="text-2xl text-brand-soft"> / mes</span>
            </div>
            <p className="mt-4 text-sm text-brand-soft leading-relaxed">
              Cubre operación, mantenimiento e iteración continua de los servicios
              marcados como mensuales. Cancelable con 30 días de aviso.
            </p>
            <div className="mt-6 border-t border-brand-line pt-4 text-sm">
              <div className="flex justify-between py-1">
                <span className="text-brand-soft">Año 1 (instalación + 12 meses)</span>
                <span className="font-semibold">
                  {fmt(installationFinal + monthlyTotal * 12)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="print-page relative overflow-hidden border-t border-brand-line p-12">
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-brand-orange/20 blur-3xl" />
        <div className="relative z-10">
          <SectionLabel n="06" title="Siguiente paso" />
          <h2 className="font-display mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            ¿Listos para <span className="gradient-text">empezar</span>?
          </h2>
          <p className="mt-4 max-w-2xl text-brand-soft">
            Reserva una call de 30 minutos para validar el alcance y firmar.
            Sin compromiso.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${data.contactEmail}?subject=Propuesta ${encodeURIComponent(
                data.clientName,
              )}`}
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 font-semibold text-black transition hover:bg-orange-400"
            >
              {data.ctaText}
              <span aria-hidden>→</span>
            </a>
            <a
              href={`mailto:${data.contactEmail}`}
              className="inline-flex items-center gap-2 rounded-full border border-brand-line px-6 py-3 font-semibold text-white transition hover:border-brand-orange"
            >
              {data.contactEmail}
            </a>
          </div>

          <div className="mt-14 grid gap-6 border-t border-brand-line pt-8 sm:grid-cols-3">
            <Contact label="Contacto" value={data.contactName} />
            <Contact label="Email" value={data.contactEmail} />
            <Contact label="Teléfono" value={data.contactPhone} />
          </div>

          <p className="mt-12 text-xs text-brand-soft">
            © {new Date().getFullYear()} {data.brandName}. Propuesta válida 30 días.
          </p>
        </div>
      </section>
    </div>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-brand-soft">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}

function SectionLabel({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-brand-orange">
      <span className="rounded-full border border-brand-orange/40 px-2 py-0.5">
        {n}
      </span>
      <span>{title}</span>
    </div>
  );
}

function SummaryBox({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-brand-line bg-brand-gray/40 p-6">
      <div className="text-xs font-bold uppercase tracking-widest text-brand-soft">
        {label}
      </div>
      <div className="mt-2 font-display text-3xl font-bold">{value}</div>
      {sub && <div className="mt-1 text-xs text-brand-soft">{sub}</div>}
    </div>
  );
}

function Contact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-brand-soft">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-white">{value}</div>
    </div>
  );
}
