# Generador de Propuestas Comerciales

App Next.js para crear propuestas comerciales premium en HTML interactivo.
Diseño minimalista negro + naranja, listo para imprimir como PDF, exportar/importar como JSON y desplegar en Vercel.

## Stack

- **Next.js 14** (App Router)
- **React 18** + **TypeScript**
- **Tailwind CSS** con tema personalizado (negro + naranja)
- Sin backend → 100% estático, perfecto para Vercel

## Funcionalidades

- Formulario en vivo con preview lateral
- 3–5 servicios configurables
- Toggle por servicio: **Instalación** (one-time) o **Mensualidad** (recurrente)
- Timeline editable
- Descuento global + plan mensual sobre instalación opcional
- Total instalación + Mensualidad recurrente + Año 1 calculados
- CTA con mailto auto-generado
- Imprimir / Exportar a PDF (window.print con estilos `@media print`)
- Exportar/Importar configuración como `.json`

## Ejecutar en local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Build de producción

```bash
npm run build
npm start
```

## Desplegar en Vercel

### Opción A — CLI

```bash
npm i -g vercel
vercel
vercel --prod
```

### Opción B — Git + Dashboard (recomendado)

1. Crea un repo en GitHub/GitLab/Bitbucket y haz push:
   ```bash
   git init
   git add .
   git commit -m "init: generador de propuestas"
   git branch -M main
   git remote add origin <TU_REPO_URL>
   git push -u origin main
   ```
2. Entra en [vercel.com/new](https://vercel.com/new) e importa el repo.
3. Vercel detecta Next.js automáticamente. Pulsa **Deploy**.
4. URL en producción lista en ~60 s.

> No hay variables de entorno ni APIs externas: deploy directo.

## Estructura

```
propuesta-generator/
├── app/
│   ├── globals.css         ← tema oscuro + estilos print
│   ├── layout.tsx
│   └── page.tsx            ← UI principal (form + preview)
├── components/
│   ├── Form.tsx            ← inputs editables
│   ├── Proposal.tsx        ← documento de 6 secciones
│   └── types.ts            ← contratos + defaults
├── package.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── vercel.json
└── .gitignore
```

## Las 6 secciones de la propuesta

1. **Cover** — branding, cliente, industria, timing
2. **Problem statement** — qué bloquea crecimiento + 3 dolores tipo
3. **Service cards** — 3-5 módulos con beneficio + precio (instalación o mensual)
4. **Timeline** — fases con duración y detalle
5. **Pricing breakdown** — tabla + totales separados (one-time vs recurrente)
6. **Total + monthly + CTA** — cierre con call-to-action mailto

## Personalización rápida

- **Colores**: edita `tailwind.config.ts` (`brand.orange`, `brand.black`, …)
- **Fuentes**: cambia los imports de Google Fonts en `app/globals.css`
- **Defaults**: ajusta `components/types.ts` → `defaultData` para que cada nueva propuesta arranque con tus valores
- **Branding fijo**: si siempre usas el mismo nombre de marca/contacto, cambia los valores por defecto y oculta esos inputs en `Form.tsx`

## Imprimir a PDF

Pulsa **Imprimir / PDF** → diálogo de impresión del navegador → **Guardar como PDF**.
Los estilos `@media print` ocultan el formulario y la barra superior, dejando solo el documento limpio.

## Licencia

Uso libre para tus propuestas. No se proveen garantías.
