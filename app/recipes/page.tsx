"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { recipeImages } from "@/app/data/recipeImages";
export default function RecipesPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("recipes");

    if (stored) {
      setRecipes(JSON.parse(stored));
    }
  }, []);

  return (
    <>
    <Header/>
    <main className=" bg-gray-50 px-6 py-10">
      
      <div className="max-w-6xl mx-auto">
        
        <h1 className="text-3xl font-semibold mb-8">
          Generated
          <span className="text-purple-600"> Recipes</span>
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {recipes.map((recipe) => (
            <div
  key={recipe.id}
  
  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition group"
>

  {/* Image */}
  <div className="relative w-full h-52 overflow-hidden">
  <Image
    src={
      recipeImages[recipe.image?.toLowerCase()] ||
      recipeImages.default
    }
    alt={recipe.title}
    fill
    className="object-cover group-hover:scale-105 transition duration-300"
  />
</div>

  {/* Content */}
  <div className="p-5">

    <div className="flex items-center justify-between mb-3">
      <h2 className="text-xl font-semibold">
        {recipe.title}
      </h2>

      <span className="text-sm text-gray-500">
        ⏱ {recipe.time}
      </span>
    </div>

    <p className="text-gray-600 leading-relaxed line-clamp-3">
      {recipe.description}
    </p>

    <button onClick={() => router.push(`/recipe/${recipe.id}`)} className="mt-5 text-purple-600 font-medium cursor-pointer hover:text-purple-800">
      View Recipe →
    </button>

  </div>
</div>
          ))}

        </div>

      </div>

    </main>
    </>
  );
}