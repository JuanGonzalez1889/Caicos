"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ServiceBackButton() {
  const router = useRouter();

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/servicios");
    }
  };

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label="Volver a la pantalla anterior"
      className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#F8F6EF]/95 py-1.5 pl-1.5 pr-4 text-sm font-semibold text-[#5A4731] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
    >
      <Image src="/images/back.svg" alt="" width={32} height={32} />
      Volver
    </button>
  );
}
