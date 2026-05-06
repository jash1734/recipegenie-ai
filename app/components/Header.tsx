"use client";

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    <header className="w-full flex justify-between items-center px-8 py-5 shadow-md ">
      <h1
        onClick={() => router.push("/")}
        className="text-4xl font-semibold tracking-tight cursor-pointer"
      >
        <span className="text-gray-900">Recipe</span>
        <span className="text-purple-600">Genie</span>
      </h1>
    </header>
  );
}