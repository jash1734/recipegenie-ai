"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "./components/Header";
export default function Home() {
  const router = useRouter();
  return (
    <main className="h-screen flex flex-col bg-gray-50 text-gray-900">
      
      <Header/>
      <section className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-3 items-center">
          
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-semibold leading-tight mb-4">
              Turn ingredients into{" "}
              <span className="text-purple-600">delicious recipes</span>
            </h2>

            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Just enter what you have in your kitchen and let AI create
              simple, tasty recipes in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              
              <button onClick={() => router.push("/generate")} className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition hover:shadow-md active:scale-95 cursor-pointer">
                Generate from Ingredients
              </button>

              <button onClick={() => router.push("/generate-name")} className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition hover:shadow-md active:scale-95 cursor-pointer">
                Generate by Dish Name
              </button>

              <button onClick={() => router.push("/generate-image")} className="relative px-6 py-3 rounded-xl font-medium text-gray-900 border border-purple-600 bg-white overflow-hidden group hover:shadow-md active:scale-95">
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 blur-md transition cursor-pointer"></span>
                <span className="relative z-10">
                  Generate from Image ✨
                </span>
              </button>

            </div>
          </div>

          <div className="flex justify-center">
            <Image
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061"
              alt="Food"
              width={400}
              height={400}
              className="rounded-2xl shadow-sm object-cover"/>
          </div>

        </div>
      </section>

    </main>
  );
}