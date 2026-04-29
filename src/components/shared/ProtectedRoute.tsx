"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getActiveSession } from "@/lib/auth";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const session = getActiveSession();

    if (!session) {
      router.replace("/login");
      return;
    }

    setAllowed(true);
  }, [router]);

  if (!allowed) return null;

  return <>{children}</>;
}
