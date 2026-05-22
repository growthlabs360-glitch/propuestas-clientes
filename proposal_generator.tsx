import { useState } from "react";

const BRAND = {
  bg: "#0a0a0a",
  card: "#111111",
  border: "#1e1e1e",
  orange: "#FF6B00",
  orangeLight: "#FF8C33",
  text: "#ffffff",
  muted: "#888888",
  subtle: "#333333",
};

const InputField = ({ label, value, onChange, placeholder, type = "text", hint }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ display: "block", color: BRAND.muted, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>{label}</label>
    {hint && <p style={{ color: "#555", fontSize: 11, marginBottom: 6, marginTop: 0 }}>{hint}</p>}
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%", background: BRAND.card, border: `1px solid ${BRAND.border}`,
        borderRadius: 8, padding: "10px 14px", color: BRAND.text, fontSize: 13,
        outline: "none", boxSizing: "border-box",
        fontFamily: "inherit",
      }}
    />
  </div>
);

const ServiceInput = ({ idx, val, onChange }) => (
  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
    <input placeholder={`Servicio ${idx + 1}`} value={val.name} onChange={e => onChange(idx, "name", e.target.value)}
      style={{ background: BRAND.card, border: `1px solid ${BRAND.border}`, borderRadius: 8, padding: "9px 12px", color: BRAND.text, fontSize: 12, outline: "none", fontFamily: "inherit" }} />
    <input placeholder="Precio €" value={val.price} onChange={e => onChange(idx, "price", e.target.value)}
      style={{ background: BRAND.card, border: `1px solid ${BRAND.border}`, borderRadius: 8, padding: "9px 12px", color: BRAND.text, fontSize: 12, outline: "none", fontFamily: "inherit" }} />
    <input placeholder="Semanas" value={val.weeks} onChange={e => onChange(idx, "weeks", e.target.value)}
      style={{ background: BRAND.card, border: `1px solid ${BRAND.border}`, borderRadius: 8, padding: "9px 12px", color: BRAND.text, fontSize: 12, outline: "none", fontFamily: "inherit" }} />
  </div>
);

export default function App() {
  const [step, setStep] = useState("form"); // form | loading | proposal
  const [form, setForm] = useState({
    client: "",
    industry: "",
    problem: "",
    timing: "",
    contact: "",
  });
  const [services, setServices] = useState([
    { name: "", price: "", weeks: "" },
    { name: "", price: "", weeks: "" },
    { name: "", price: "", weeks: "" },
  ]);
  const [proposal, setProposal] = useState(null);
  const [error, setError] = useState("");

  const updateService = (idx, field, val) => {
    const updated = [...services];
    updated[idx][field] = val;
    setServices(updated);
  };

  const addService = () => {
    if (services.length < 5) setServices([...services, { name: "", price: "", weeks: "" }]);
  };

  const removeService = (idx) => {
    if (services.length > 2) setServices(services.filter((_, i) => i !== idx));
  };

  const generate = async () => {
    if (!form.client || !form.industry) { setError("Completa al menos el nombre del cliente e industria."); return; }
    const filledServices = services.filter(s => s.name);
    if (filledServices.length < 2) { setError("Añade al menos 2 servicios."); return; }
    setError("");
    setStep("loading");

    const servicesText = filledServices.map(s => `- ${s.name}: ${s.price ? s.price + "€" : "precio a definir"}, ${s.weeks ? s.weeks + " semanas" : ""}`).join("\n");

    const prompt = `Eres consultor comercial senior. Genera una propuesta comercial profesional en español para:

Cliente: ${form.client}
Industria: ${form.industry}
Problema/Contexto: ${form.problem || "optimizar procesos y aumentar rentabilidad"}
Servicios: 
${servicesText}
Timing total: ${form.timing || "a definir con el cliente"}
Contacto: ${form.contact || "GrowthLabs360"}

Responde SOLO con un objeto JSON válido (sin markdown, sin backticks, sin texto adicional) con esta estructura exacta:
{
  "tagline": "frase impactante de 6-8 palabras que resume el valor",
  "problem": {
    "title": "título del problema (4-6 palabras)",
    "description": "descripción del problema en 2-3 frases directas y específicas para esta industria",
    "bullets": ["dolor 1 específico", "dolor 2 específico", "dolor 3 específico"]
  },
  "services": [
    {
      "name": "nombre del servicio",
      "benefit": "beneficio principal en 1 frase directa",
      "deliverables": ["entregable 1", "entregable 2", "entregable 3"],
      "price": "precio en €",
      "weeks": "semanas"
    }
  ],
  "timeline": [
    { "phase": "nombre fase", "weeks": "semana X-Y", "tasks": ["tarea 1", "tarea 2"] }
  ],
  "roi": "frase sobre el retorno esperado en 1-2 frases",
  "cta": "llamada a la acción urgente en 1 frase"
}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      const cleaned = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      parsed._meta = { client: form.client, industry: form.industry, contact: form.contact, services: filledServices };
      setProposal(parsed);
      setStep("proposal");
    } catch (e) {
      setError("Error generando la propuesta. Intenta de nuevo.");
      setStep("form");
    }
  };

  if (step === "loading") return (
    <div style={{ minHeight: "100vh", background: BRAND.bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
      <div style={{ width: 48, height: 48, border: `3px solid ${BRAND.subtle}`, borderTop: `3px solid ${BRAND.orange}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <p style={{ color: BRAND.muted, fontSize: 13, letterSpacing: 1 }}>GENERANDO PROPUESTA...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  if (step === "proposal" && proposal) return <ProposalView data={proposal} onBack={() => setStep("form")} />;

  return (
    <div style={{ minHeight: "100vh", background: BRAND.bg, padding: "32px 20px", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, background: BRAND.orange, borderRadius: 2 }} />
            <span style={{ color: BRAND.orange, fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>GrowthLabs360</span>
          </div>
          <h1 style={{ color: BRAND.text, fontSize: 24, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>Generador de Propuestas</h1>
          <p style={{ color: BRAND.muted, fontSize: 13, marginTop: 6 }}>Rellena los datos y la IA construye tu propuesta premium en segundos.</p>
        </div>

        {/* Form */}
        <div style={{ background: BRAND.card, border: `1px solid ${BRAND.border}`, borderRadius: 12, padding: 24, marginBottom: 16 }}>
          <p style={{ color: BRAND.orange, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 0, marginBottom: 18 }}>01 — Cliente</p>
          <InputField label="Nombre del cliente / empresa" value={form.client} onChange={v => setForm({ ...form, client: v })} placeholder="Ej: Restaurante La Paloma" />
          <InputField label="Industria" value={form.industry} onChange={v => setForm({ ...form, industry: v })} placeholder="Ej: Restauración, E-commerce, Clínica dental..." />
          <InputField label="Problema o contexto (opcional)" value={form.problem} onChange={v => setForm({ ...form, problem: v })} placeholder="Ej: No tienen sistema de captación de leads..." />
          <InputField label="Timing" value={form.timing} onChange={v => setForm({ ...form, timing: v })} placeholder="Ej: 8 semanas, antes de junio..." />
          <InputField label="Contacto / firma" value={form.contact} onChange={v => setForm({ ...form, contact: v })} placeholder="Tu nombre o email" />
        </div>

        <div style={{ background: BRAND.card, border: `1px solid ${BRAND.border}`, borderRadius: 12, padding: 24, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <p style={{ color: BRAND.orange, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>02 — Servicios</p>
            <span style={{ color: BRAND.muted, fontSize: 11 }}>{services.length}/5</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
            {["Servicio", "Precio €", "Semanas"].map(h => (
              <span key={h} style={{ color: BRAND.muted, fontSize: 10, letterSpacing: 1, textTransform: "uppercase" }}>{h}</span>
            ))}
          </div>
          {services.map((s, i) => (
            <div key={i} style={{ position: "relative" }}>
              <ServiceInput idx={i} val={s} onChange={updateService} />
              {services.length > 2 && (
                <button onClick={() => removeService(i)} style={{ position: "absolute", right: -20, top: 10, background: "none", border: "none", color: BRAND.subtle, cursor: "pointer", fontSize: 16, padding: 0 }}>×</button>
              )}
            </div>
          ))}
          {services.length < 5 && (
            <button onClick={addService} style={{ background: "none", border: `1px dashed ${BRAND.subtle}`, color: BRAND.muted, borderRadius: 8, padding: "8px 14px", fontSize: 12, cursor: "pointer", width: "100%", marginTop: 4 }}>
              + Añadir servicio
            </button>
          )}
        </div>

        {error && <p style={{ color: "#ff4444", fontSize: 12, marginBottom: 12 }}>{error}</p>}

        <button onClick={generate} style={{
          width: "100%", background: BRAND.orange, border: "none", borderRadius: 10, padding: "14px",
          color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5,
        }}>
          Generar Propuesta →
        </button>
      </div>
    </div>
  );
}

function ProposalView({ data, onBack }) {
  const total = data._meta.services.reduce((s, sv) => s + (parseFloat(sv.price) || 0), 0);
  const totalWeeks = Math.max(...data._meta.services.map(s => parseFloat(s.weeks) || 0));

  return (
    <div style={{ minHeight: "100vh", background: BRAND.bg, fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`
        @media print { .no-print { display: none !important; } }
        * { box-sizing: border-box; }
      `}</style>

      {/* Top bar */}
      <div className="no-print" style={{ background: "#0d0d0d", borderBottom: `1px solid ${BRAND.border}`, padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={onBack} style={{ background: "none", border: `1px solid ${BRAND.subtle}`, color: BRAND.muted, borderRadius: 6, padding: "6px 14px", fontSize: 12, cursor: "pointer" }}>← Nueva propuesta</button>
        <button onClick={() => window.print()} style={{ background: BRAND.orange, border: "none", color: "#fff", borderRadius: 6, padding: "6px 16px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Imprimir / PDF</button>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 60px" }}>

        {/* COVER */}
        <div style={{ minHeight: 320, display: "flex", flexDirection: "column", justifyContent: "flex-end", borderBottom: `1px solid ${BRAND.border}`, padding: "60px 0 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <div style={{ width: 6, height: 6, background: BRAND.orange, borderRadius: 1 }} />
            <span style={{ color: BRAND.orange, fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>GrowthLabs360</span>
          </div>
          <p style={{ color: BRAND.muted, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 10px" }}>Propuesta Comercial</p>
          <h1 style={{ color: BRAND.text, fontSize: 38, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.15 }}>
            {data._meta.client}
          </h1>
          <p style={{ color: BRAND.orange, fontSize: 17, fontWeight: 500, margin: "0 0 32px", maxWidth: 500 }}>{data.tagline}</p>
          <div style={{ display: "flex", gap: 24 }}>
            <Stat label="Inversión total" value={total > 0 ? `${total.toLocaleString()}€` : "A definir"} />
            <Stat label="Duración" value={totalWeeks > 0 ? `${totalWeeks} semanas` : data._meta.services[0]?.weeks || "—"} />
            <Stat label="Industria" value={data._meta.industry} />
          </div>
        </div>

        {/* PROBLEM */}
        <Section num="01" title={data.problem.title}>
          <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{data.problem.description}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data.problem.bullets.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "#141414", border: `1px solid ${BRAND.border}`, borderRadius: 8, padding: "12px 16px" }}>
                <div style={{ width: 6, height: 6, background: BRAND.orange, borderRadius: 1, marginTop: 5, flexShrink: 0 }} />
                <span style={{ color: "#ccc", fontSize: 13 }}>{b}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* SERVICES */}
        <Section num="02" title="Nuestra Solución">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
            {data.services.map((s, i) => (
              <div key={i} style={{ background: "#111", border: `1px solid ${BRAND.border}`, borderRadius: 10, padding: 20, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <span style={{ color: BRAND.orange, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase" }}>0{i + 1}</span>
                  <span style={{ color: BRAND.orange, fontWeight: 700, fontSize: 16 }}>{s.price}€</span>
                </div>
                <h3 style={{ color: BRAND.text, fontSize: 14, fontWeight: 700, margin: "0 0 8px" }}>{s.name}</h3>
                <p style={{ color: "#888", fontSize: 12, margin: "0 0 14px", lineHeight: 1.6 }}>{s.benefit}</p>
                <div style={{ marginTop: "auto" }}>
                  {s.deliverables?.map((d, j) => (
                    <div key={j} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                      <span style={{ color: BRAND.orange, fontSize: 10 }}>✓</span>
                      <span style={{ color: "#777", fontSize: 11 }}>{d}</span>
                    </div>
                  ))}
                </div>
                {s.weeks && <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${BRAND.border}`, color: BRAND.muted, fontSize: 10, letterSpacing: 1 }}>{s.weeks} SEMANAS</div>}
              </div>
            ))}
          </div>
        </Section>

        {/* TIMELINE */}
        {data.timeline?.length > 0 && (
          <Section num="03" title="Plan de Trabajo">
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {data.timeline.map((ph, i) => (
                <div key={i} style={{ display: "flex", gap: 20, paddingBottom: 24, position: "relative" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div style={{ width: 28, height: 28, background: i === 0 ? BRAND.orange : BRAND.card, border: `2px solid ${i === 0 ? BRAND.orange : BRAND.subtle}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: i === 0 ? "#fff" : BRAND.muted, fontSize: 10, fontWeight: 700 }}>{i + 1}</span>
                    </div>
                    {i < data.timeline.length - 1 && <div style={{ width: 1, flex: 1, background: BRAND.subtle, marginTop: 4 }} />}
                  </div>
                  <div style={{ paddingTop: 4 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 6 }}>
                      <h4 style={{ color: BRAND.text, fontSize: 13, fontWeight: 600, margin: 0 }}>{ph.phase}</h4>
                      <span style={{ color: BRAND.orange, fontSize: 10, background: "#1a0d00", padding: "2px 8px", borderRadius: 4 }}>{ph.weeks}</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {ph.tasks?.map((t, j) => (
                        <span key={j} style={{ color: "#777", fontSize: 11, background: "#141414", border: `1px solid ${BRAND.border}`, borderRadius: 4, padding: "3px 9px" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* PRICING */}
        <Section num="04" title="Desglose de Inversión">
          <div style={{ background: "#111", border: `1px solid ${BRAND.border}`, borderRadius: 10, overflow: "hidden" }}>
            {data._meta.services.map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: i < data._meta.services.length - 1 ? `1px solid ${BRAND.border}` : "none" }}>
                <div>
                  <p style={{ color: BRAND.text, fontSize: 13, margin: 0 }}>{s.name}</p>
                  {s.weeks && <p style={{ color: BRAND.muted, fontSize: 11, margin: "2px 0 0" }}>{s.weeks} semanas</p>}
                </div>
                <span style={{ color: BRAND.text, fontSize: 14, fontWeight: 600 }}>{s.price ? `${parseFloat(s.price).toLocaleString()}€` : "—"}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", background: "#0d0d0d", borderTop: `2px solid ${BRAND.orange}` }}>
              <span style={{ color: BRAND.text, fontSize: 15, fontWeight: 700 }}>TOTAL INVERSIÓN</span>
              <span style={{ color: BRAND.orange, fontSize: 22, fontWeight: 800 }}>{total > 0 ? `${total.toLocaleString()}€` : "A definir"}</span>
            </div>
          </div>
          {data.roi && (
            <div style={{ marginTop: 14, background: "#0d1a00", border: `1px solid #1a3300`, borderRadius: 8, padding: "14px 18px" }}>
              <p style={{ color: "#88cc44", fontSize: 12, margin: 0, lineHeight: 1.6 }}>💡 {data.roi}</p>
            </div>
          )}
        </Section>

        {/* CTA */}
        <div style={{ marginTop: 40, background: `linear-gradient(135deg, #1a0900 0%, #0d0d0d 100%)`, border: `1px solid ${BRAND.orange}22`, borderRadius: 12, padding: "36px 32px", textAlign: "center" }}>
          <p style={{ color: BRAND.muted, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginTop: 0 }}>Siguiente paso</p>
          <h2 style={{ color: BRAND.text, fontSize: 22, fontWeight: 700, margin: "0 0 12px" }}>¿Empezamos?</h2>
          <p style={{ color: "#aaa", fontSize: 13, margin: "0 0 28px", lineHeight: 1.7 }}>{data.cta}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            <div style={{ background: BRAND.orange, borderRadius: 8, padding: "12px 28px", color: "#fff", fontSize: 13, fontWeight: 700 }}>
              Aceptar propuesta
            </div>
            <div style={{ background: "transparent", border: `1px solid ${BRAND.subtle}`, borderRadius: 8, padding: "12px 28px", color: BRAND.muted, fontSize: 13 }}>
              {data._meta.contact || "GrowthLabs360"}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function Section({ num, title, children }) {
  return (
    <div style={{ padding: "40px 0", borderBottom: `1px solid ${BRAND.border}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <span style={{ color: BRAND.orange, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", opacity: 0.6 }}>{num}</span>
        <h2 style={{ color: BRAND.text, fontSize: 18, fontWeight: 700, margin: 0 }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p style={{ color: BRAND.muted, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 4px" }}>{label}</p>
      <p style={{ color: BRAND.text, fontSize: 15, fontWeight: 600, margin: 0 }}>{value}</p>
    </div>
  );
}
