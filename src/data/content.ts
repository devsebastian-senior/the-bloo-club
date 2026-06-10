/* ---------------------------------------------------------------------------
   Landing content. Copy uses ONLY real claims from theblooclub.com
   (AAFCO, human-grade, USDA meats, frozen shipping, free local delivery).
--------------------------------------------------------------------------- */

const CDN = "https://cdn.shopify.com/s/files/1/0269/1121/1580/files";

/** Real product photos from the client's Shopify CDN (width param = resize). */
export const PHOTOS = {
  trial: `${CDN}/gempages_576238297542558239-8e7c9ad9-b693-4b81-adc3-8c30499590f4.png?v=1756495770&width=720`,
  xs: `${CDN}/577cacee-7256-4668-8be8-a4ba266cd151.png?v=1755279403&width=720`,
  s: `${CDN}/07b89939-22b2-4978-b189-90c542504dbe.png?v=1755277608&width=720`,
  m: `${CDN}/aa07a32f-9671-414b-b86e-ee4eb29ef7b3.png?v=1753269736&width=720`,
  l: `${CDN}/7929de43-44b9-4f75-b4e4-6757f8ac1013.png?v=1756142491&width=720`,
  puppy: `${CDN}/f0c3320c-9e35-4fa7-b488-6b4e9f02aac1.png?v=1756142313&width=720`,
  lifestyle: `${CDN}/gempages_576238297542558239-c33e22d7-e9e4-44a7-8961-998f7914a1aa.jpg?v=1755285863&width=900`,
  bowl: `${CDN}/gempages_576238297542558239-ff4d9a9f-423d-4553-ae88-60d507913b03.jpg?v=1756142515&width=900`,
} as const;

export const WHY_FRESH = [
  {
    emoji: "🥩",
    title: "Ingredientes de grado humano",
    text: "Carnes USDA, vegetales frescos y superfoods. Nada de subproductos ni conservantes artificiales.",
  },
  {
    emoji: "🧪",
    title: "Nutrición completa y balanceada",
    text: "Cada receta cumple los perfiles nutricionales AAFCO para mantenimiento. Comida real, no promesas.",
  },
  {
    emoji: "👨‍🍳",
    title: "Cocinado en lotes pequeños",
    text: "Recetas artesanales preparadas con el mismo cuidado que la comida de casa, selladas al vacío.",
  },
];

export const HOW_IT_WORKS = [
  {
    step: "1",
    emoji: "📝",
    title: "Crea su plan",
    text: "Responde 4 preguntas sobre su raza, edad, peso y gustos. Te decimos receta exacta y gramos por día.",
  },
  {
    step: "2",
    emoji: "🍳",
    title: "Cocinamos fresco",
    text: "Preparamos sus comidas en sobres de 8 oz, porcionadas a su medida y selladas al vacío.",
  },
  {
    step: "3",
    emoji: "🚚",
    title: "Llega a tu puerta",
    text: "Enviado congelado con entrega local gratis. Descongela, sirve y mueve la cola.",
  },
];

/* TODO(cliente): reemplazar con testimonios reales + fotos cuando los envíe. */
export const TESTIMONIALS = [
  {
    quote:
      "Mia dejó las croquetas sin mirar atrás. Ahora corre a su plato todos los días.",
    name: "Dueña de Mia",
    detail: "Frenchie · plan Small",
  },
  {
    quote:
      "Lo que más me gustó: la porción exacta en gramos. Cero adivinanzas con el peso de Rocco.",
    name: "Dueño de Rocco",
    detail: "Labrador · plan Large",
  },
  {
    quote:
      "El plan de cachorro con 3 comidas al día nos salvó. Se nota la energía y el pelaje.",
    name: "Familia de Luna",
    detail: "Golden · plan Puppy",
  },
];

export const FAQS = [
  {
    q: "¿Cuánto cuesta realmente?",
    a: "Los planes van de $129 a $469 al mes según el tamaño de tu perro, con descuento si te suscribes. Si quieres probar antes, el paquete Sniff Us First trae 18 comidas por $89.",
  },
  {
    q: "¿Cómo paso a mi perro de croquetas a comida fresca?",
    a: "Transición gradual de 7 días: mezcla un poco de comida fresca con su comida actual y aumenta la proporción cada día. Su estómago se adapta sin sustos.",
  },
  {
    q: "¿Cómo guardo las comidas?",
    a: "Llegan congeladas y selladas al vacío en sobres de 8 oz. Congeladas duran meses; en el refrigerador, 3–4 días. Descongela la noche anterior y listo.",
  },
  {
    q: "¿Es nutricionalmente completo?",
    a: "Sí. Cada receta cumple los perfiles AAFCO para mantenimiento, con proteína mínima de 20%, vitaminas y Omega-3. Es su comida principal, no un topping.",
  },
  {
    q: "¿Y si mi perro tiene alergias o una condición médica?",
    a: "En el plan marcas qué proteínas evitar y dejas notas de salud. Para condiciones médicas serias, comparte el plan con tu veterinario antes de empezar — la nutrición es de mantenimiento, no tratamiento.",
  },
  {
    q: "¿Dónde entregan?",
    a: "Entrega local gratis en nuestra zona de cobertura, y envío congelado. Escríbenos y confirmamos tu dirección.",
  },
];

export const INSTAGRAM = "https://www.instagram.com/theblooclub";
