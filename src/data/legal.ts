/* ---------------------------------------------------------------------------
   Policies from theblooclub.com/policies/* (captured 2026-06-10), translated
   to Spanish for UX. The official English documents govern — each policy
   links to its source. Contact data is real (Shopify policy pages).
--------------------------------------------------------------------------- */

export const LEGAL_CONTACT = {
  email: "info@theblooclub.com",
  legalEmail: "minerva@theblooclub.com",
  company: "The Bloo Club LLC",
  address: "11970 SW 14th Place, Davie, FL 33325, Estados Unidos",
};

export interface PolicySection {
  h: string;
  p: string[];
}

export interface Policy {
  id: string;
  title: string;
  short: string;
  officialUrl: string;
  sections: PolicySection[];
}

export const POLICIES: Policy[] = [
  {
    id: "envios",
    title: "Política de envíos",
    short: "Envíos",
    officialUrl: "https://theblooclub.com/policies/shipping-policy",
    sections: [
      {
        h: "Procesamiento",
        p: [
          "Preparar y empacar tu pedido toma de 1 a 2 días hábiles. En temporadas pico puede haber demoras adicionales.",
        ],
      },
      {
        h: "Tiempos de entrega",
        p: [
          "Los pedidos nacionales suelen llegar en 3 a 7 días hábiles. Pueden ocurrir retrasos por clima o por la paquetería, fuera de nuestro control.",
        ],
      },
      {
        h: "Rastreo",
        p: [
          "Al enviarse tu pedido recibirás un número de rastreo por correo. Da unas horas para que el sistema de la paquetería se actualice.",
        ],
      },
      {
        h: "Costos",
        p: [
          "El envío se calcula por peso, dimensiones y destino, y se muestra antes de completar la compra.",
        ],
      },
      {
        h: "Cambios de dirección",
        p: [
          "Una vez realizado el pedido, no es posible modificar la dirección ni el método de envío. Verifica tus datos al comprar.",
          "Si un paquete regresa por dirección incorrecta o intentos de entrega fallidos, te contactaremos para reenviarlo (puede aplicar un costo adicional de envío).",
        ],
      },
    ],
  },
  {
    id: "devoluciones",
    title: "Política de devoluciones y reembolsos",
    short: "Devoluciones",
    officialUrl: "https://theblooclub.com/policies/refund-policy",
    sections: [
      {
        h: "Plazos",
        p: [
          "Contáctanos dentro de los 10 días siguientes a recibir tu compra, por el chat o a info@theblooclub.com.",
          "Una vez reportado el caso, tienes un total de 30 días desde la fecha de compra para enviarnos el artículo de vuelta.",
        ],
      },
      {
        h: "Condiciones",
        p: [
          "El artículo debe estar sin usar, en su empaque original y en condición de reventa. Por higiene, asegúrate de que tu mascota no lo haya usado.",
        ],
      },
      {
        h: "Pedidos personalizados",
        p: [
          "Si el error en tu pedido personalizado fue nuestro, escríbenos y lo resolvemos. En los demás casos, los pedidos personalizados no son elegibles para devolución, reembolso o cambio.",
        ],
      },
      {
        h: "Reembolsos",
        p: [
          "Se reembolsa el monto original de la compra menos los gastos de envío. Los costos de envío no son reembolsables.",
        ],
      },
      {
        h: "Cambios",
        p: [
          "Puedes cambiar por otra talla o diseño, sujeto a disponibilidad. Los pedidos personalizados no admiten cambios.",
        ],
      },
      {
        h: "Envío de la devolución",
        p: [
          "El costo del envío de regreso corre por tu cuenta, salvo que la devolución sea por un error nuestro (artículo incorrecto o dañado).",
          "Recomendamos usar un método con rastreo: no nos hacemos responsables por devoluciones extraviadas.",
        ],
      },
    ],
  },
  {
    id: "privacidad",
    title: "Política de privacidad",
    short: "Privacidad",
    officialUrl: "https://theblooclub.com/policies/privacy-policy",
    sections: [
      {
        h: "Qué información se recopila",
        p: [
          "Datos de contacto (nombre, dirección, teléfono, correo), información de pedidos (direcciones de facturación y envío, confirmación de pago), datos de cuenta (usuario, contraseña), actividad de compra (artículos vistos, carrito) y datos de uso mediante cookies y tecnologías similares.",
          "También puede recibirse información de terceros como procesadores de pago.",
        ],
      },
      {
        h: "Para qué se usa",
        p: [
          "Para entregar productos y servicios, comunicaciones de marketing, prevención de fraude y soporte al cliente.",
        ],
      },
      {
        h: "Cookies",
        p: [
          "La mayoría de los navegadores aceptan cookies por defecto; puedes configurarlo para rechazarlas o eliminarlas desde los controles del navegador.",
        ],
      },
      {
        h: "Con quién se comparte",
        p: [
          "Con proveedores, procesadores de pago y socios de negocio (incluido Shopify) que dan soporte a la operación.",
        ],
      },
      {
        h: "Menores",
        p: [
          "No se recopila de forma consciente información personal de menores de edad.",
        ],
      },
      {
        h: "Tus derechos",
        p: [
          "Según tu ubicación, puedes solicitar acceso, eliminación, corrección, portabilidad o restricciones de procesamiento de tus datos.",
          `Contacto: ${"minerva@theblooclub.com"} · The Bloo Club LLC, 11970 SW 14th Place, Davie, FL 33325.`,
        ],
      },
    ],
  },
  {
    id: "terminos",
    title: "Términos de servicio",
    short: "Términos",
    officialUrl: "https://theblooclub.com/policies/terms-of-service",
    sections: [
      {
        h: "Aceptación",
        p: [
          "Al visitar el sitio o comprar, aceptas los términos y condiciones. Debes ser mayor de edad. El incumplimiento de los términos resulta en la terminación inmediata del servicio.",
        ],
      },
      {
        h: "Condiciones generales",
        p: [
          "Se reserva el derecho de rehusar el servicio a cualquier persona. La información de tarjetas siempre viaja cifrada. No puedes reproducir ni explotar el servicio sin permiso escrito.",
        ],
      },
      {
        h: "Precios y productos",
        p: [
          "Los precios y servicios pueden cambiar sin previo aviso. Los productos tienen cantidades limitadas y pueden descontinuarse. No se garantiza que los colores se vean exactos en tu pantalla.",
          "Se pueden rechazar pedidos o limitar cantidades; debes mantener tus datos de cuenta actualizados y correctos.",
        ],
      },
      {
        h: "Usos prohibidos",
        p: [
          "Quedan prohibidos los usos ilegales, el acoso, transmitir malware y extraer contenido del sitio (scraping).",
        ],
      },
      {
        h: "Responsabilidad",
        p: [
          "El servicio se ofrece «tal cual». The Bloo Club no es responsable por daños directos o indirectos derivados del uso del servicio, en la máxima medida permitida por la ley.",
          "Aceptas indemnizar a la empresa frente a reclamos de terceros derivados de tu uso del servicio.",
        ],
      },
      {
        h: "Ley aplicable y cambios",
        p: [
          "Estos términos se rigen por las leyes de Estados Unidos. Pueden actualizarse; el uso continuado del sitio implica aceptación de los cambios.",
          `Contacto: ${"minerva@theblooclub.com"} · The Bloo Club LLC, 11970 SW 14th Place, Davie, FL 33325.`,
        ],
      },
    ],
  },
];

export function getPolicy(id: string): Policy | null {
  return POLICIES.find((p) => p.id === id) ?? null;
}
