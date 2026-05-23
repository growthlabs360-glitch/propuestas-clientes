"use client";

import { ProposalData, Service, TimelinePhase, PriceMode } from "./types";

type Props = {
  data: ProposalData;
  onChange: (next: ProposalData) => void;
};

function update<T>(arr: T[], i: number, patch: Partial<T>): T[] {
  return arr.map((item, idx) => (idx === i ? { ...item, ...patch } : item));
}

export function Form({ data, onChange }: Props) {
  const set = <K extends keyof ProposalData>(key: K, value: ProposalData[K]) =>
    onChange({ ...data, [key]: value });

  const updateService = (i: number, patch: Partial<Service>) =>
    set("services", update(data.services, i, patch));

  const addService = () => {
    if (data.services.length >= 5) return;
    set("services", [
      ...data.services,
      {
        name: "Nuevo servicio",
        benefit: "Beneficio que recibe el cliente.",
        price: 1000,
        priceMode: "installation",
      },
    ]);
  };

  const removeService = (i: number) => {
    if (data.services.length <= 3) return;
    set(
      "services",
      data.services.filter((_, idx) => idx !== i),
    );
  };

  const updatePhase = (i: number, patch: Partial<TimelinePhase>) =>
    set("timeline", update(data.timeline, i, patch));

  const addPhase = () =>
    set("timeline", [
      ...data.timeline,
      { phase: "Nueva fase", duration: "Sem X", detail: "Detalle" },
    ]);

  const removePhase = (i: number) =>
    set(
      "timeline",
      data.timeline.filter((_, idx) => idx !== i),
    );

  return (
    <div className="space-y-6">
      <Section title="Tu marca">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nombre marca">
            <input
              value={data.brandName}
              onChange={(e) => set("brandName", e.target.value)}
            />
          </Field>
          <Field label="Subtítulo / Tagline">
            <input
              value={data.brandTagline}
              onChange={(e) => set("brandTagline", e.target.value)}
            />
          </Field>
        </div>
      </Section>

      <Section title="Cliente">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nombre cliente">
            <input
              value={data.clientName}
              onChange={(e) => set("clientName", e.target.value)}
            />
          </Field>
          <Field label="Industria">
            <input
              value={data.industry}
              onChange={(e) => set("industry", e.target.value)}
            />
          </Field>
        </div>
        <Field label="Timing / fechas">
          <input
            value={data.timing}
            onChange={(e) => set("timing", e.target.value)}
          />
        </Field>
        <Field label="Problem statement">
          <textarea
            rows={3}
            value={data.problem}
            onChange={(e) => set("problem", e.target.value)}
          />
        </Field>
      </Section>

      <Section
        title={`Servicios (${data.services.length}/5)`}
        action={
          data.services.length < 5 ? (
            <button
              type="button"
              onClick={addService}
              className="text-xs font-semibold uppercase tracking-wider text-brand-orange hover:text-orange-300"
            >
              + Añadir
            </button>
          ) : null
        }
      >
        <div className="space-y-4">
          {data.services.map((s, i) => (
            <div
              key={i}
              className="rounded-xl border border-brand-line bg-brand-gray/40 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-brand-soft">
                  Servicio {i + 1}
                </span>
                {data.services.length > 3 && (
                  <button
                    type="button"
                    onClick={() => removeService(i)}
                    className="text-xs text-brand-soft hover:text-red-400"
                  >
                    Eliminar
                  </button>
                )}
              </div>
              <Field label="Nombre del servicio">
                <input
                  value={s.name}
                  onChange={(e) => updateService(i, { name: e.target.value })}
                />
              </Field>
              <Field label="Beneficio (qué gana el cliente)">
                <textarea
                  rows={2}
                  value={s.benefit}
                  onChange={(e) =>
                    updateService(i, { benefit: e.target.value })
                  }
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Precio (€)">
                  <input
                    type="number"
                    min={0}
                    value={s.price}
                    onChange={(e) =>
                      updateService(i, { price: Number(e.target.value) || 0 })
                    }
                  />
                </Field>
                <Field label="Tipo de precio">
                  <select
                    value={s.priceMode}
                    onChange={(e) =>
                      updateService(i, {
                        priceMode: e.target.value as PriceMode,
                      })
                    }
                  >
                    <option value="installation">Instalación (one-time)</option>
                    <option value="monthly">Mensualidad (recurrente)</option>
                  </select>
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Timeline"
        action={
          <button
            type="button"
            onClick={addPhase}
            className="text-xs font-semibold uppercase tracking-wider text-brand-orange hover:text-orange-300"
          >
            + Añadir fase
          </button>
        }
      >
        <div className="space-y-3">
          {data.timeline.map((p, i) => (
            <div
              key={i}
              className="rounded-xl border border-brand-line bg-brand-gray/40 p-3 space-y-2"
            >
              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="Fase"
                  value={p.phase}
                  onChange={(e) => updatePhase(i, { phase: e.target.value })}
                />
                <input
                  placeholder="Duración"
                  value={p.duration}
                  onChange={(e) =>
                    updatePhase(i, { duration: e.target.value })
                  }
                />
              </div>
              <input
                placeholder="Detalle"
                value={p.detail}
                onChange={(e) => updatePhase(i, { detail: e.target.value })}
              />
              {data.timeline.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePhase(i)}
                  className="text-xs text-brand-soft hover:text-red-400"
                >
                  Eliminar fase
                </button>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Pricing & extras">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Descuento global (%)">
            <input
              type="number"
              min={0}
              max={100}
              value={data.discountPct}
              onChange={(e) =>
                set("discountPct", Math.max(0, Math.min(100, Number(e.target.value) || 0)))
              }
            />
          </Field>
          <Field label="Plan mensual sobre instalación (%)">
            <input
              type="number"
              min={0}
              max={100}
              value={data.monthlyPlanPct}
              onChange={(e) =>
                set("monthlyPlanPct", Math.max(0, Math.min(100, Number(e.target.value) || 0)))
              }
            />
          </Field>
        </div>
        <p className="text-[11px] text-brand-soft mt-2 leading-snug">
          El “plan mensual sobre instalación” divide el coste de instalación en cuotas
          mensuales (opcional). 0 = no se muestra.
        </p>
      </Section>

      <Section title="Contacto & CTA">
        <Field label="Nombre">
          <input
            value={data.contactName}
            onChange={(e) => set("contactName", e.target.value)}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Email">
            <input
              value={data.contactEmail}
              onChange={(e) => set("contactEmail", e.target.value)}
            />
          </Field>
          <Field label="Teléfono">
            <input
              value={data.contactPhone}
              onChange={(e) => set("contactPhone", e.target.value)}
            />
          </Field>
        </div>
        <Field label="Texto del botón CTA">
          <input
            value={data.ctaText}
            onChange={(e) => set("ctaText", e.target.value)}
          />
        </Field>
      </Section>
    </div>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-brand-line pb-2">
        <h3 className="text-sm font-bold tracking-wider uppercase text-white">
          {title}
        </h3>
        {action}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label>{label}</label>
      {children}
    </div>
  );
}
