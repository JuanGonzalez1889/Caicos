"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

export default function HashLink({ href, onClick, ...props }: Props) {
  return <Link {...props} href={href} onClick={event => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey ||
        event.shiftKey || event.altKey || event.currentTarget.hasAttribute("download") ||
        (event.currentTarget.target && event.currentTarget.target !== "_self")) return;
    const destination = new URL(event.currentTarget.href);
    if (!destination.hash || destination.href !== window.location.href) return;
    const target = document.getElementById(decodeURIComponent(destination.hash.slice(1)));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ block: "start", behavior: "auto" });
  }} />;
}
