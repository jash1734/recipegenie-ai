"use client";

import Header from "@/app/components/Header";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GenerateByNamePage() {
  const [dishName, setDishName] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleGenerate = async () => {
    if (!dishName.trim()) return;

    try {
      setLoading(true);

      const res = await fetch("/api/generate-by-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dishName,
        }),
      });

      const data = await res.json();

      const cleaned = data.data
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsedRecipe = JSON.parse(cleaned);

      localStorage.setItem(
        "recipes",
        JSON.stringify([parsedRecipe])
      );

      router.push(`/recipe/${parsedRecipe.id}`);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen lg:min-h-[645px] bg-gray-50 px-6 py-10 flex items-center justify-center">

        <div className="w-full max-w-2xl bg-white rounded-3xl p-8 shadow-sm">

          <h1 className="text-4xl font-semibold mb-4 text-center">
            Generate Recipe 
            <span className="text-purple-600"> By Name</span>
          </h1>

          <p className="text-gray-600 text-center mb-8">
            Enter any dish name and let AI generate a complete recipe.
          </p>

          <div className="space-y-5">

            <input
              type="text"
              placeholder="Example: Paneer Butter Masala"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-purple-500"
            />

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 transition text-white py-4 rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
    <>
      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      Generating...
    </>
  ) : (
    "Generate Recipe ✨"
  )}
            </button>

          </div>

        </div>

      </main>
    </>
  );
}