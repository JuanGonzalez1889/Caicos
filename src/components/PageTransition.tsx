"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);

  useLayoutEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (pathname.startsWith("/admin")) return;

    const main = document.querySelector("main");
    if (!main) return;

    const animation = main.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 450, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
    return () => animation.cancel();
  }, [pathname]);

  return null;
}
