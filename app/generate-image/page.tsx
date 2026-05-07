"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Header from "../components/Header";

export default function GenerateImagePage() {
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [imageBase64, setImageBase64] = useState("");

  const [loading, setLoading] = useState(false);

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setSelectedImage(imageUrl);

    // Convert image to base64
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      const base64String = reader.result as string;

      const base64Data = base64String.split(",")[1];

      setImageBase64(base64Data);
    };
  };

  const handleGenerateRecipes = async () => {
    try {
      setLoading(true);

      // STEP 1 — Detect ingredients from image
      const imageRes = await fetch("/api/generate-from-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imageBase64,
        }),
      });

      const imageData = await imageRes.json();

      let ingredients = [];

      // If Gemini works
      if (imageData.data) {
        const cleaned = imageData.data
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        ingredients = JSON.parse(cleaned);
      } else {
        // Fallback ingredients
        ingredients = [
          "Tomato",
          "Onion",
          "Cheese",
          "Garlic",
          "Bread",
        ];
      }

      // STEP 2 — Generate recipes
      const recipeRes = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients,
        }),
      });

      const recipeData = await recipeRes.json();

      const cleanedRecipes = recipeData.data
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsedRecipes = JSON.parse(cleanedRecipes);

      // STEP 3 — Save recipes
      localStorage.setItem(
        "recipes",
        JSON.stringify(parsedRecipes)
      );

      // STEP 4 — Redirect
      router.push("/recipes");

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header/>
    <main className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="max-w-3xl mx-auto">

        {/* Heading */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-semibold mb-3">
            ✨ Generate Recipes 
            <span className="text-purple-600"> From Image</span>
          </h1>

          <p className="text-gray-600 text-lg">
            Upload a food or ingredient image and let AI create recipes automatically.
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-3xl shadow-sm p-8">

          {/* Upload Area */}
          {!selectedImage && (
            <div
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed border-purple-300 rounded-3xl p-14 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50 transition"
            >
              <div className="text-5xl mb-4">📸</div>

              <h2 className="text-2xl font-medium mb-2">
                Upload Image
              </h2>

              <p className="text-gray-500 text-center">
                Drag & drop or click to upload a food image
              </p>
            </div>
          )}

          {/* Hidden Input */}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />

          {/* Preview */}
          {selectedImage && (
            <div>

              <div className="relative w-full h-[400px] rounded-3xl overflow-hidden mb-6">
                <Image
                  src={selectedImage}
                  alt="Uploaded"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">

                <button
                  onClick={() => {
                  setSelectedImage(null);
                  setImageBase64("");
                  if (inputRef.current) {
                    inputRef.current.value = "";
                  }
                  }}
                  className="flex-1 border border-gray-300 py-3 rounded-2xl hover:bg-gray-100 transition cursor-pointer"
                >
                  Remove Image
                </button>

                <button
                  onClick={handleGenerateRecipes}
                  disabled={loading}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-2xl hover:bg-purple-700 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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
          )}

        </div>

      </div>

    </main>
    </>
  );
}