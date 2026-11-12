"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";

const MINIMUM_DISPLAY_MS = 1500;
const VISITED_KEY = "caicos-welcome-seen";
const subscribe = () => () => {};
const serverVisited = () => true;
let storageFailed = false;
let visitedInMemory = false;

function hasVisited() {
  if (storageFailed) return visitedInMemory;
  try { return sessionStorage.getItem(VISITED_KEY) === "true"; }
  catch (error) {
    console.warn("[loader] Session storage unavailable; tracking the visit in memory:", error);
    storageFailed = true;
    return visitedInMemory;
  }
}

export default function NavigationLoader({ children }: { children: ReactNode }) {
  const visited = useSyncExternalStore(subscribe, hasVisited, serverVisited);
  const [finished, setFinished] = useState(false);
  const visible = !visited && !finished;

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      visitedInMemory = true;
      try { sessionStorage.setItem(VISITED_KEY, "true"); }
      catch (error) {
        console.warn("[loader] Could not persist the welcome visit:", error);
        storageFailed = true;
      }
      setFinished(true);
    }, MINIMUM_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <>
      {children}
      {visible && (
        <div role="status" aria-live="polite" className="loader-overlay">
          <span className="sr-only">Cargando página</span>
          <div id="load" aria-hidden="true">
            {"SOCIAC".split("").map((letter, index) => <div key={`${letter}-${index}`}>{letter}</div>)}
          </div>
        </div>
      )}
    </>
  );
}
