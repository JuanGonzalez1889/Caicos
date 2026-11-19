// Contenido ilustrativo de la demo. Reemplazar por servicios y fotografías reales de CAICOS.
export type Service = {
  slug: "eventos-infantiles" | "eventos-sociales" | "eventos-empresariales";
  name: string;
  short: string;
  eyebrow: string;
  description: string;
  image: string;
  galleryIsIllustrative?: boolean;
  gallery: { src: string; alt: string }[];
};

export const services: Service[] = [
  {
    slug: "eventos-infantiles",
    name: "Eventos Infantiles",
    eyebrow: "01 / CELEBRACIONES",
    short: "Momentos para imaginar, jugar y celebrar.",
    description:
      "Propuestas para festejos infantiles, pensadas para acompañar los momentos que quedan en la memoria.",
    image: "/images/infantil1.png",
    galleryIsIllustrative: false,
    gallery: Array.from({ length: 13 }, (_, index) => ({
      src: `/images/infantil/${index + 3}.jpg`,
      alt: `Espacio de eventos infantiles de CAICOS, foto ${index + 1}`,
    })),
  },
  {
    slug: "eventos-sociales",
    name: "Eventos sociales",
    eyebrow: "02 / CELEBRACIONES",
    short: "Un día único, infinitas maneras de vivirlo y sentirlo.",
    description:
      "Una propuesta visual y de ambientación para imaginar cómo querés celebrar una ocasión especial.",
    image: "/images/social.png",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=85",
        alt: "Decoración de una celebración de casamiento",
      },
      {
        src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85",
        alt: "Mesa preparada para una boda",
      },
      {
        src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=85",
        alt: "Ambientación de una recepción",
      },
    ],
  },
  {
    slug: "eventos-empresariales",
    name: "Eventos empresariales",
    eyebrow: "03 / CELEBRACIONES",
    short: "Un espacio para crear tu propia experiencia.",
    description:
      "Un punto de partida para organizar celebraciones y encuentros de distintas características.",
    image: "/images/empresa.png",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1800&q=85",
        alt: "Salón preparado para un evento",
      },
      {
        src: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1200&q=85",
        alt: "Espacio amplio ambientado para una celebración",
      },
      {
        src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85",
        alt: "Detalles de una recepción en un salón",
      },
    ],
  },
];

export const findService = (slug: string) =>
  services.find((s) => s.slug === slug);
