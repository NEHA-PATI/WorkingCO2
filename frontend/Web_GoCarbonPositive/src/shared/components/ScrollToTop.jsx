import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const SCROLL_CONTAINER_SELECTORS = [
  ".admin-layout-content",
  ".main-content",
  ".user-layout",
  ".org-layout",
  "[data-scroll-container='true']",
];

function resetScrollPosition() {
  if (typeof window === "undefined") return;

  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  const candidateSet = new Set();
  const rootCandidates = [
    document.scrollingElement,
    document.documentElement,
    document.body,
  ].filter(Boolean);
  rootCandidates.forEach((node) => candidateSet.add(node));

  SCROLL_CONTAINER_SELECTORS.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => candidateSet.add(node));
  });

  // Catch custom scroll shells that are not in known selectors.
  document.querySelectorAll("div, main, section").forEach((node) => {
    const style = window.getComputedStyle(node);
    const canScroll =
      ["auto", "scroll"].includes(style.overflowY) ||
      ["auto", "scroll"].includes(style.overflow);
    if (canScroll && node.scrollHeight > node.clientHeight + 2) {
      candidateSet.add(node);
    }
  });

  candidateSet.forEach((node) => {
    try {
      node.scrollTop = 0;
      if (typeof node.scrollTo === "function") {
        node.scrollTo(0, 0);
      }
    } catch {
      // Ignore non-scrollable targets.
    }
  });
}

export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    if (!("scrollRestoration" in window.history)) return undefined;

    const previousValue = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousValue;
    };
  }, []);

  useLayoutEffect(() => {
    const active = document.activeElement;
    if (active instanceof HTMLElement && active !== document.body) {
      active.blur();
    }

    resetScrollPosition();
    const rafId = window.requestAnimationFrame(resetScrollPosition);
    const timeout50 = window.setTimeout(resetScrollPosition, 50);
    const timeout160 = window.setTimeout(resetScrollPosition, 160);
    const timeout320 = window.setTimeout(resetScrollPosition, 320);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeout50);
      window.clearTimeout(timeout160);
      window.clearTimeout(timeout320);
    };
  }, [location.key, location.pathname, location.search, location.hash]);

  return null;
}
