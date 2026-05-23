export type PriceMode = "installation" | "monthly";

export type Service = {
  name: string;
  benefit: string;
  price: number;
  priceMode: PriceMode;
};

export type TimelinePhase = {
  phase: string;
  duration: string;
  detail: string;
};

export type ProposalData = {
  brandName: string;
  brandTagline: string;
  clientName: string;
  industry: string;
  problem: string;
  timing: string;
  services: Service[];
  timeline: TimelinePhase[];
  discountPct: number;
  monthlyPlanPct: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  ctaText: string;
};

export const defaultData: ProposalData = {
  brandName: "STUDIO 360",
  brandTagline: "Propuesta Comercial",
  clientName: "Empresa Cliente S.A.",
  industry: "SaaS B2B",
  problem:
    "Tu negocio pierde leads cada semana por falta de un sistema unificado de captación, nurturing y cierre. Hoy gastas en ads que llegan a un funnel desactualizado, sin tracking real ni automatizaciones que conviertan oportunidades en revenue.",
  timing: "Inicio: 1 de Junio 2026 · Duración total: 12 semanas",
  services: [
    {
      name: "Estrategia & Funnel Digital",
      benefit:
        "Auditoría completa, diseño de funnel y nuevo journey de cliente para multiplicar la tasa de conversión por 2.4x.",
      price: 3500,
      priceMode: "installation",
    },
    {
      name: "Automatización con IA",
      benefit:
        "Implementación de agentes de IA para outbound, calificación de leads y atención 24/7. Ahorra 60h/mes a tu equipo.",
      price: 850,
      priceMode: "monthly",
    },
    {
      name: "Dashboard & Reporting",
      benefit:
        "Centralizamos métricas, costes y ROI en un único dashboard en tiempo real. Decisiones basadas en datos, no en intuición.",
      price: 1200,
      priceMode: "installation",
    },
  ],
  timeline: [
    {
      phase: "Discovery",
      duration: "Sem 1-2",
      detail: "Auditoría, entrevistas y diseño de roadmap.",
    },
    {
      phase: "Build",
      duration: "Sem 3-8",
      detail: "Implementación de funnel, agentes IA y dashboard.",
    },
    {
      phase: "Launch",
      duration: "Sem 9-10",
      detail: "Go-live, training del equipo y handover.",
    },
    {
      phase: "Optimize",
      duration: "Sem 11-12",
      detail: "Iteración con datos reales y ajustes.",
    },
  ],
  discountPct: 10,
  monthlyPlanPct: 0,
  contactName: "Laurita Ortega",
  contactEmail: "hola@studio360.com",
  contactPhone: "+34 600 000 000",
  ctaText: "Reservar kickoff call",
};
