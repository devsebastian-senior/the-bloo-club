# The Bloo Club · Plan de comida para tu perro

Web app (mobile-first) que recomienda **qué comida fresca** necesita un perro y
**cuántos gramos al día**, según raza, edad, peso, actividad y notas de salud.
Pensada para [theblooclub.com](https://theblooclub.com) — _Real Food for Real Dogs_.

## Stack (liviano + animaciones)

- **Vite 5 + React 18 + TypeScript** — SPA, sin backend (por ahora).
- **framer-motion** — transiciones entre pasos, micro-interacciones, count-up.
- **Tailwind CSS v4** (`@tailwindcss/vite`) — tokens de marca en `src/index.css`.
- **lucide-react** — íconos.

Bundle: ~100 KB JS gzip · ~5 KB CSS gzip.

## Cómo correr

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + bundle a dist/
npm run preview  # sirve el build
```

## Flujo

1. **Intro** → 2. **Wizard de 4 pasos**:
   1. Raza (o "mestizo" → tamaño) + nombre
   2. Edad → etapa de vida (cachorro / adulto / senior)
   3. Peso + condición corporal + actividad + esterilizado
   4. Proteína favorita, alergias a evitar, notas de salud
3. **Resultado**: receta recomendada + plan (X-Small…Large/Puppy) +
   gramos/día + comidas + porqués + segunda opción.

## Motor de nutrición (`src/lib/calc.ts`)

- `RER = 70 × kg^0.75`
- `MER = factor × RER` (factor según etapa, esterilización, actividad, condición)
- `gramos/día = MER ÷ densidad de la receta (kcal/g)`
- Selección de receta: respeta alergias, favorito, y pistas de salud
  (sensible → pavo/cordero, sobrepeso → magro, muy activo → res).

> Estimaciones de inicio de plan, no prescripción médica. La UI lo aclara y
> remite al veterinario para casos especiales.

## Datos reales (theblooclub.com · Shopify, USD)

Capturados 2026-06-10 vía `products.json` + páginas de recetas.

**Planes por tamaño** (`src/data/plans.ts`) — peso real en libras:

| Plan | Peso | Precio/mes | Suscríbete | Handle |
|---|---|---|---|---|
| X-Small | 2–10 lb | $129 | $109 | `xsmallbreedmeals` |
| Small | 11–19 lb | $189 | $149 | `smallbreedmeals` |
| Medium | 20–49 lb | $319 | $299 | `mediumbreedmeals` |
| Large | 50–90 lb | $469 | $449 | `largebreedmeals` |
| Puppy | crías | $369 | — | `mediumpuppymeals` |

- **Trial "Sniff Us First"** $89 = 18 comidas (6 res · 6 cordero · 6 pollo).
- **Recetas** (`src/data/recipes.ts`): Pollo / Res / Cordero ordenables + blends
  (Half-Half, Equal Parts). Pavo es receta destacada (no en el builder estándar).
  Ingredientes reales, ~240 kcal/sobre de 8 oz, análisis garantizado 20/11/3/72.
- **Plan tiers** reales por condición corporal: Subir de Peso / Balanceado /
  Control de Peso.
- Claims reales: grado humano, AAFCO, USDA, enviado congelado, entrega local
  gratis. Fundadora: Minerva Bustillo.
- El sitio ya tiene su propio "Meal Plan Calculator" en `/pages/start-meal-plan`
  (pide nombre/raza/edad/peso actual+objetivo/esterilización/actividad/alergias).

## Estructura

```
src/
  types.ts            # DogProfile, Recommendation
  data/breeds.ts      # razas + tamaño + peso típico
  data/recipes.ts     # 4 recetas (Cordero/Pollo/Res/Pavo) + kcal/g
  lib/calc.ts         # motor RER/MER + selección de receta
  lib/motion.ts       # variantes framer-motion
  components/
    ui.tsx            # Button, OptionCard, Chip, StepHeader
    steps.tsx         # StepBreed/StepAge/StepBody/StepNotes
    Wizard.tsx        # stepper + progreso + validación
    Result.tsx        # resultado animado + count-up
  App.tsx             # intro → wizard → result
```

## Próxima fase (pendiente)

- Handoff del lead: botón **"Pedir por WhatsApp"** (hoy deshabilitado) que
  pre-rellene raza/edad/peso/receta/gramos/notas, o backend para guardar leads.
- Conectar recetas/planes reales y precios de The Bloo Club.
