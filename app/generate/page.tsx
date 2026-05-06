"use client";
import { useState } from "react";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
const suggestionsList = [
  "Ajwain","Almond Flour","Almond Milk","Almonds","Amchur","Anchovies","Apple","Apple Juice","Apricot","Arugula","Artichoke","Asafoetida","Asparagus","Avocado","Avocado Oil",
"Bacon","Baking Powder","Baking Soda","Banana","Barbecue Sauce","Barley","Basil","Bay Leaves","Beef Steak","Beetroot","Bell Pepper","Biryani Masala","Black Beans","Black Pepper","Black Salt","Blackberry","Blueberry","Bok Choy","Bread","Bread Crumbs","Broccoli","Brown Rice","Brown Sugar","Brussels Sprouts","Bulgur","Butter","Buttermilk",
"Cabbage","Canola Oil","Capers","Cardamom","Caraway Seeds","Carrot","Cashews","Cauliflower","Celery","Cheddar","Cheese","Cherry","Chia Seeds","Chicken Breast","Chicken Thighs","Chicken Wings","Chickpeas","Chili Garlic Sauce","Chili Paste","Chili Powder","Chives","Chocolate","Cilantro","Cinnamon","Clams","Cloves","Cocoa Powder","Coconut","Coconut Flour","Coconut Milk","Coconut Oil","Coconut Water","Cod","Coffee","Condensed Milk","Corn","Corn Flour","Cornmeal","Cornstarch","Coriander","Coriander Powder","Couscous","Crab","Cranberry","Cream","Cream Cheese","Cream Of Tartar","Cucumber","Cumin","Cumin Seeds","Curry Leaves","Curry Powder",
"Dill","Dragon Fruit","Duck",
"Edamame","Egg","Eggplant","Evaporated Milk",
"Farro","Fava Beans","Fennel Seeds","Fenugreek","Feta Cheese","Fig","Fish Sauce","Flaxseeds","Flour",
"Garlic","Garam Masala","Ghee","Ginger","Ginger Garlic Paste","Goat Cheese","Granola","Gram Flour","Grape","Grapeseed Oil","Green Beans","Ground Beef","Guacamole","Guava",
"Halibut","Ham","Hazelnuts","Hemp Seeds","Hing (Asafoetida)","Hoisin Sauce","Honey","Hot Sauce","Hummus",
"Jaggery","Jaggery Powder","Jam","Jelly",
"Kale","Kasuri Methi","Kesar (Saffron strands)","Kidney Beans","Kimchi","Kiwi","Khoya",
"Ladiesfinger","Lamb","Lard","Leeks","Lemon","Lemonade","Lentils","Lettuce","Lima Beans","Lime","Lobster","Lychee",
"Macadamia Nuts","Mackerel","Maida","Mango","Maple Syrup","Margarine","Marshmallows","Mayonnaise","Methi Leaves","Methi Seeds","Milk","Millet","Mint","Miso Paste","Mozzarella","Mung Beans","Mushroom","Mustard","Mustard Oil","Mustard Seeds",
"Naan Flour","Nigella Seeds","Noodles","Nori Sheets","Nutmeg",
"Oat Milk","Oats","Octopus","Oil","Olive Oil","Olives","Onion","Orange","Orange Juice","Oregano","Oysters",
"Paneer","Papaya","Paprika","Parsley","Parmesan","Passion Fruit","Peach","Peanut Butter","Peanuts","Pear","Pecans","Pesto","Pickles","Pineapple","Pinto Beans","Pistachios","Pita Bread","Plum","Polenta","Pomegranate","Popcorn","Poppy Seeds","Pork Chop","Potato","Potato Chips","Powdered Sugar","Pumpkin","Pumpkin Seeds",
"Quinoa",
"Radish","Ranch Dressing","Raspberry","Raw Mango Powder","Red Chili Powder","Red Onion","Ricotta","Rice","Rice Flour","Rice Noodles","Ribs","Rosemary","Rye",
"Saffron","Salmon","Salsa","Salt","Sardines","Sausage","Scallops","Seaweed","Sesame Oil","Sesame Seeds","Shrimp","Smoothies","Soba Noodles","Soy Milk","Soy Sauce","Soybeans","Spaghetti","Sparkling Water","Spinach","Split Peas","Squash","Squid","Star Anise","Strawberry","Sugar","Sunflower Seeds","Sweet Potato",
"Tahini","Tamarind","Tamarind Paste","Tamarind Powder","Tandoori Masala","Tarragon","Tea","Tempeh","Thyme","Tilapia","Tofu","Tomato","Tomato Sauce","Tortilla","Tortilla Chips","Trout","Tuna","Turkey","Turnip","Tzatziki",
"Udon Noodles",
"Vanilla Extract","Vegetable Oil","Venison","Vinegar",
"Walnuts","Wasabi","Water","Watermelon","White Beans","Wild Rice",
"Yeast","Yogurt",
"Zucchini"
];
export default function GeneratePage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInput = (value: string) => {
    setInput(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    const filtered = suggestionsList.filter(
      (item) =>
      item.toLowerCase().includes(value.toLowerCase()) &&
      !tags.map((t) => t.toLowerCase()).includes(item.toLowerCase())
    );

    setSuggestions(filtered);
  };

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setInput("");
    setSuggestions([]);
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };
  const handleGenerate = async () => {
  if (tags.length === 0) {
    setError("Please add at least one ingredient");
    return;
  }

  setLoading(true);
  setError("");
  setRecipe(null);

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients: tags }),
    });

    const data = await res.json();

  const cleaned = data.data
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

  const parsed = JSON.parse(cleaned);

  localStorage.setItem("recipes", JSON.stringify(parsed));

  router.push("/recipes");
  } catch (err) {
    setError("Failed to generate recipe");
  } finally {
    setLoading(false);
  }
};
  return (
    <main className="h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header/>
      <section className="flex flex-1 items-center justify-center px-6">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-sm">
        
        <h2 className="text-2xl font-semibold mb-4">
          Generate
          <span className="text-purple-600"> Recipe</span>
        </h2>

        <p className="text-gray-600 mb-6">
          Enter ingredients you have and we’ll create a recipe for you.
        </p>

        <div className="border border-gray-200 rounded-xl p-3 flex flex-wrap gap-2">
          
          {/* Tags */}
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full flex items-center gap-2"
            >
              {tag}
              <button className="cursor-pointer" onClick={() => removeTag(tag)}>✕</button>
            </span>
          ))}

          {/* Input */}
          <input
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            className="flex-1 min-w-[120px] outline-none"
            placeholder="Type ingredients..."
          />
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="min-h-40 max-h-40 overflow-auto mt-2 border border-gray-200 rounded-xl bg-white shadow-sm">
            {suggestions.map((item) => (
              <div
                key={item}
                onClick={() => addTag(item)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {item}
              </div>
            ))}
          </div>
        )}

        {/* Button */}
        <button
  onClick={handleGenerate}
  disabled={loading}
  className="mt-6 w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
>
  {loading ? (
    <>
      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      Generating...
    </>
  ) : (
    "Generate Recipe"
  )}
</button>
{recipe && (
  <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm">
    
    <h2 className="text-2xl font-semibold mb-2">
      {recipe.title}
    </h2>

    <p className="text-gray-500 mb-4">
      ⏱ {recipe.time}
    </p>

    <div className="mb-4">
      <h3 className="font-semibold mb-2">Ingredients</h3>
      <ul className="list-disc pl-5 text-gray-700">
        {recipe.ingredients.map((item: string, i: number) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>

    <div>
      <h3 className="font-semibold mb-2">Steps</h3>
      <ol className="list-decimal pl-5 text-gray-700 space-y-1">
        {recipe.steps.map((step: string, i: number) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    </div>

  </div>
)}

      </div>
    </section>
    </main>
  );
}