"use client";

import { useEffect, useState } from "react";

function readThemeFromDom(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export default function ThemeHeadIcons() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(readThemeFromDom());

    const observer = new MutationObserver(() => {
      setTheme(readThemeFromDom());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const icon = theme === "dark" ? "/icon_d.svg" : "/icon.svg";

  return (
    <>
      <link rel="icon" href={icon} />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    </>
  );
}
