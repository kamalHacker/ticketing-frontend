"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      if (role === "ADMIN") router.replace("/admin");
      else if (role === "SUPPORT_AGENT") router.replace("/agent");
      else router.replace("/user");

    } catch {
      router.replace("/login");
    }
  }, [router]);

  return null; // nothing to show here
}
