"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/app/components/Header";
import Image from "next/image";
import { recipeImages } from "@/app/data/recipeImages";
import { FaYoutube } from "react-icons/fa";
import html2pdf from "html2pdf.js";

export default function RecipeDetailsPage() {
  const params = useParams();

  const [recipe, setRecipe] = useState<any>(null);

  const recipeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("recipes");

    if (stored) {
      const recipes = JSON.parse(stored);

      const foundRecipe = recipes.find(
        (r: any) => r.id.toString() === params.id
      );

      setRecipe(foundRecipe);
    }
  }, [params.id]);

  if (!recipe) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading recipe...</p>
      </main>
    );
  }

  const handleDownload = () => {
    if (!recipeRef.current) return;

    const options = {
      margin: 0.5,
      filename: `${recipe.title.replace(/\s+/g, "-")}.pdf`,
      image: {
        type: "jpeg",
        quality: 1,
      },
      html2canvas: {
        scale: 2,
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
      },
    };

    html2pdf()
      .set(options as any)
      .from(recipeRef.current)
      .save();
  };

  const videoLinks = [
    {
      title: "Easy Recipe Tutorial",
      query: `easy ${recipe.title} recipe`,
    },
    {
      title: "Restaurant Style Recipe",
      query: `${recipe.title} restaurant style`,
    },
    {
      title: "Quick Homemade Version",
      query: `quick ${recipe.title} recipe`,
    },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 px-6 py-10">

        {/* Visible Premium UI */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 shadow-sm">

          {/* Title + Download */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

            <h1 className="text-4xl font-semibold">
              {recipe.title}
            </h1>

            <button
              onClick={handleDownload}
              className="bg-purple-600 hover:bg-purple-700 transition text-white px-5 py-3 rounded-2xl cursor-pointer"
            >
              Download Recipe
            </button>

          </div>

          {/* Hero Image */}
          <div className="relative w-full h-[350px] rounded-3xl overflow-hidden mb-8">
            <Image
              src={
                recipeImages[recipe.image?.toLowerCase()] ||
                recipeImages.default
              }
              alt={recipe.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Time */}
          <p className="text-gray-500 mb-8">
            ⏱ {recipe.time}
          </p>

          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            {recipe.description}
          </p>

          {/* Ingredients */}
          <div className="mb-10">

            <h2 className="text-2xl font-semibold mb-4">
              Ingredients
            </h2>

            <ul className="space-y-2">
              {recipe.ingredients.map(
                (item: string, index: number) => (
                  <li
                    key={index}
                    className="bg-purple-50 text-purple-700 px-4 py-2 rounded-xl"
                  >
                    {item}
                  </li>
                )
              )}
            </ul>

          </div>

          {/* Instructions */}
          <div>

            <h2 className="text-2xl font-semibold mb-4">
              Instructions
            </h2>

            <div className="space-y-5">

              {recipe.steps.map(
                (step: string, index: number) => (
                  <div
                    key={index}
                    className="flex gap-4 items-start bg-gray-50 p-4 rounded-2xl"
                  >

                    <div className="min-w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>

                    <p className="text-gray-700 leading-relaxed">
                      {step}
                    </p>

                  </div>
                )
              )}

            </div>

          </div>

          {/* Video Tutorials */}
          <div className="mt-12">

            <h2 className="text-2xl font-semibold mb-4">
              Video Tutorials
            </h2>

            <p className="text-gray-600 mb-6">
              For better understanding, you can watch these recipe videos.
            </p>

            <div className="space-y-4">

              {videoLinks.map((video, index) => (
                <a
                  key={index}
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(video.query)}`}
                  target="_blank"
                  className="flex items-center gap-4 bg-purple-50 hover:bg-purple-100 transition p-5 rounded-2xl group"
                >

                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    <FaYoutube className="text-red-600 text-2xl" />
                  </div>

                  <div>

                    <p className="font-medium group-hover:text-red-600 transition">
                      {video.title}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Learn visually on YouTube
                    </p>

                  </div>

                </a>
              ))}

            </div>

          </div>

        </div>

        {/* Hidden Printable PDF Version */}
        <div className="hidden">

          <div
            ref={recipeRef}
            className="bg-white text-black p-8"
          >

            <h1 className="text-3xl font-bold mb-4">
              {recipe.title}
            </h1>

            <p className="mb-6">
              Cooking Time: {recipe.time}
            </p>

            <h2 className="text-2xl font-semibold mb-3">
              Ingredients
            </h2>

            <ul className="mb-8">
              {recipe.ingredients.map(
                (item: string, index: number) => (
                  <li key={index} className="mb-2">
                    • {item}
                  </li>
                )
              )}
            </ul>

            <h2 className="text-2xl font-semibold mb-3">
              Instructions
            </h2>

            <ol>
              {recipe.steps.map(
                (step: string, index: number) => (
                  <li key={index} className="mb-4">
                    {index + 1}. {step}
                  </li>
                )
              )}
            </ol>

          </div>

        </div>

      </main>
    </>
  );
}