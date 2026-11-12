"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { animate, type AnimationPlaybackControls } from "motion";
import HashLink from "./HashLink";
import { ArrowDown, ChevronLeft, ChevronRight, X } from "lucide-react";

type Photo = { src: string; alt: string };

export default function ServiceGallery({ serviceName, description, photos, illustrative = true }: { serviceName: string; description: string; photos: Photo[]; illustrative?: boolean }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationPlaybackControls | null>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 1, end: 1 });

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !photos.length) return;
    const updateRange = () => {
      const itemWidth = track.firstElementChild?.getBoundingClientRect().width;
      if (!itemWidth) return;
      setVisibleRange({
        start: Math.round(track.scrollLeft / itemWidth) + 1,
        end: Math.min(photos.length, Math.round((track.scrollLeft + track.clientWidth) / itemWidth)),
      });
    };
    const observer = new ResizeObserver(updateRange);
    observer.observe(track);
    track.addEventListener("scroll", updateRange, { passive: true });
    updateRange();
    return () => {
      animationRef.current?.stop();
      track.style.removeProperty("scroll-snap-type");
      observer.disconnect();
      track.removeEventListener("scroll", updateRange);
    };
  }, [photos.length]);

  const stopCarousel = () => {
    animationRef.current?.stop();
    trackRef.current?.style.removeProperty("scroll-snap-type");
  };

  const moveCarousel = (direction: number) => {
    const track = trackRef.current;
    if (!track) return;
    const itemWidth = track.firstElementChild?.getBoundingClientRect().width;
    if (!itemWidth) return;
    animationRef.current?.stop();
    const target = Math.max(0, Math.min(
      track.scrollWidth - track.clientWidth,
      (Math.round(track.scrollLeft / itemWidth) + direction) * itemWidth,
    ));
    track.style.scrollSnapType = "none";
    animationRef.current = animate(track.scrollLeft, target, {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (left) => track.scrollTo({ left, behavior: "instant" }),
      onComplete: () => track.style.removeProperty("scroll-snap-type"),
    });
  };

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") setActiveIndex((index) => index === null ? null : (index + photos.length - 1) % photos.length);
      if (event.key === "ArrowRight") setActiveIndex((index) => index === null ? null : (index + 1) % photos.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, photos.length]);

  if (photos.length === 0) return null;

  return <>
    <section className="bg-[#F8F6EF] px-6 pt-14 pb-10 sm:px-10 sm:pt-16 lg:px-16 lg:pt-20 lg:pb-12" aria-labelledby="service-gallery-title">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,.8fr)] lg:items-center lg:gap-16">
        <div className="min-w-0">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[.25em] text-[#3F8FB7]">{illustrative ? "Galería ilustrativa" : "Nuestro espacio"}</p>
            <h2 id="service-gallery-title" className="serif-display mt-3 text-3xl sm:text-4xl">Un vistazo a {serviceName.toLowerCase()}.</h2>
          </div>
          <div role="region" aria-roledescription="carrusel" aria-label={`Fotos de ${serviceName}`}>
            <div
              ref={trackRef}
              onPointerDown={stopCarousel}
              onWheel={stopCarousel}
              onKeyDown={stopCarousel}
              className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              tabIndex={0}
              aria-label="Desplazá las fotos horizontalmente"
            >
              {photos.map((photo, index) => (
                <div key={photo.src} className="min-w-0 shrink-0 basis-1/2 snap-start sm:basis-[33.333333%]">
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Ampliar foto ${index + 1}: ${photo.alt}`}
                className="group relative block aspect-square w-full overflow-hidden border border-[#F8F6EF] bg-[#EADCC4]"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                  className="object-contain"
                />
                <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
              </button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <span className="text-xs text-[#776451]">Seleccioná una foto para ampliarla</span>
              <div className="flex shrink-0 items-center gap-3">
              {photos.length > 1 && <>
                <button type="button" onClick={() => moveCarousel(-1)} disabled={visibleRange.start === 1} aria-label="Foto anterior del carrusel" className="rounded-full border border-[#5A4731]/25 p-2 text-[#5A4731] transition-colors hover:bg-[#EADCC4] disabled:cursor-not-allowed disabled:opacity-30">
                  <ChevronLeft aria-hidden="true" />
                </button>
                <button type="button" onClick={() => moveCarousel(1)} disabled={visibleRange.end === photos.length} aria-label="Foto siguiente del carrusel" className="rounded-full border border-[#5A4731]/25 p-2 text-[#5A4731] transition-colors hover:bg-[#EADCC4] disabled:cursor-not-allowed disabled:opacity-30">
                  <ChevronRight aria-hidden="true" />
                </button>
              </>}
              </div>
            </div>
            <p aria-live="polite" aria-atomic="true" className="mt-2 text-right text-xs text-[#776451]">{visibleRange.start}–{visibleRange.end} / {photos.length}</p>
          </div>
        </div>
        <aside className="lg:py-8">
          <p className="text-xs font-bold uppercase tracking-[.25em] text-[#3F8FB7]">La experiencia</p>
          <h2 className="serif-display mt-5 text-[clamp(2.8rem,4vw,4.5rem)] leading-[.98] tracking-[-.035em]">Momentos con <em>identidad propia.</em></h2>
          <p className="mt-7 text-lg leading-relaxed text-[#5A4731]/80">{description}</p>
          <p className="mt-5 text-xs leading-relaxed text-[#776451]">{illustrative ? "Fotografías ilustrativas. " : ""}Los detalles y prestaciones se definirán con CAICOS.</p>
          <HashLink href="#disponibilidad" className="mt-7 inline-flex items-center gap-3 border-b border-[#5A4731] pb-2 text-xs font-bold uppercase tracking-widest">Consultar una fecha <ArrowDown size={16} aria-hidden="true"/></HashLink>
        </aside>
      </div>
    </section>
    {activeIndex !== null && (
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Galería de ${serviceName}`}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-5 sm:p-10"
        onClick={(event) => {
          if (event.target === event.currentTarget) setActiveIndex(null);
        }}
      >
        <button type="button" onClick={() => setActiveIndex(null)} aria-label="Cerrar galería" className="absolute right-5 top-5 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20">
          <X />
        </button>
        <button type="button" onClick={() => setActiveIndex((activeIndex + photos.length - 1) % photos.length)} aria-label="Foto anterior" className="absolute left-3 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 sm:left-8">
          <ChevronLeft />
        </button>
        <figure className="relative h-full max-h-[85vh] w-full max-w-6xl">
          <Image src={photos[activeIndex].src} alt={photos[activeIndex].alt} fill sizes="100vw" className="object-contain" />
          <figcaption className="absolute inset-x-0 -bottom-8 text-center text-sm text-white/80">{activeIndex + 1} / {photos.length} · {photos[activeIndex].alt}</figcaption>
        </figure>
        <button type="button" onClick={() => setActiveIndex((activeIndex + 1) % photos.length)} aria-label="Foto siguiente" className="absolute right-3 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 sm:right-8">
          <ChevronRight />
        </button>
      </div>
    )}
  </>;
}
