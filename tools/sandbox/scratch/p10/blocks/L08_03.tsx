// src/app/RouteAccessibility.tsx
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";   // React Router v7 exports hooks from "react-router"; v6 used "react-router-dom"

export function RouteAccessibility({ titleFor }: { titleFor: (pathname: string) => string }) {
  const location = useLocation();
  const [announcement, setAnnouncement] = useState("");
  const isFirstRender = useRef(true);

  useEffect(() => {
    const title = titleFor(location.pathname);
    document.title = title;

    if (isFirstRender.current) {            // do not steal focus on the initial page load
      isFirstRender.current = false;
      return;
    }

    // Move focus to the main heading (or main region) of the new page.
    const target =
      document.querySelector<HTMLElement>("main h1") ??
      document.querySelector<HTMLElement>("main");
    if (target) {
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: false });
    }
    setAnnouncement(`Navigated to ${title}`);   // belt-and-braces; see notes (localize in real apps)
  }, [location.pathname, titleFor]);

  return (
    <div role="status" aria-live="polite" className="visually-hidden">
      {announcement}
    </div>
  );
}
