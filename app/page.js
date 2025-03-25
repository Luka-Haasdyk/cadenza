"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Welcome to Cadenza</h1>
        <a
          href="/api/auth"
          className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition duration-300"
        >
          Connect Spotify
        </a>
      </div>
    </div>
  );
}
