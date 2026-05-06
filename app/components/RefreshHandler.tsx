"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RefreshHandler() {
  const router = useRouter();

  useEffect(() => {
    const navigationEntries =
      performance.getEntriesByType(
        "navigation"
      ) as PerformanceNavigationTiming[];

    const isReload =
      navigationEntries.length > 0 &&
      navigationEntries[0].type === "reload";

    if (isReload) {
      localStorage.removeItem("recipes");

      router.replace("/");
    }
  }, [router]);

  return null;
}