"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/shared/SplashScreen";
import { getActiveSession } from "@/lib/auth";
import { SPLASH_DELAY_MS } from "@/lib/constants";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const session = getActiveSession();
      router.replace(session ? "/dashboard" : "/login");
    }, SPLASH_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}
