import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { ingredients } = await req.json();

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { error: "No ingredients provided" },
        { status: 400 }
      );
    }

    const prompt = `
Generate 5 different recipes using these ingredients: ${ingredients.join(", ")}

STRICT RULES:
- Return ONLY valid JSON
- No markdown
- No explanation text
- No extra characters
- Generate detailed cooking steps (8-9 steps)

Format:
[
  {
    "id": 1,
    "title": "string",
    "time": "string",
    "description": "2 sentence detailed description",
    "image": "ONLY one keyword from: pasta, pizza, curry, smoothie, noodles, burger, salad, soup, dessert",
    "ingredients": ["string"],
    "steps": ["string"]
  }
]
`;

    const response = await client.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const result = response.choices[0].message.content;

    return NextResponse.json({
      data: result,
    });

  } catch (error: any) {
    console.error("API ERROR:", error);

    // Optional fallback data
    return NextResponse.json({
      data: JSON.stringify([
        {
          id: 1,
          title: "Potato Onion Curry",
          time: "25 mins",
          description: "A simple and flavorful homemade curry.",
          ingredients: ["Potato", "Onion", "Oil", "Spices"],
          steps: [
            "Chop onions and potatoes",
            "Heat oil in a pan",
            "Cook onions until golden",
            "Add potatoes and spices",
            "Cook until soft"
          ]
        },
        {
          id: 2,
          title: "Onion Pancakes",
          time: "20 mins",
          description: "Crispy savory pancakes with onion flavor.",
          ingredients: ["Flour", "Onion", "Salt", "Water"],
          steps: [
            "Mix flour and water",
            "Add chopped onions",
            "Heat pan",
            "Cook pancakes both sides"
          ]
        },
        {
          id: 3,
          title: "Potato Flatbread",
          time: "30 mins",
          description: "Soft flatbread stuffed with potatoes.",
          ingredients: ["Potato", "Flour", "Salt"],
          steps: [
            "Boil potatoes",
            "Prepare dough",
            "Stuff potatoes inside",
            "Cook on pan"
          ]
        },
        {
          id: 4,
          title: "Garlic Potato Stir Fry",
          time: "15 mins",
          description: "Quick stir-fried potatoes with garlic.",
          ingredients: ["Potato", "Garlic", "Oil"],
          steps: [
            "Slice potatoes",
            "Heat oil",
            "Add garlic",
            "Cook potatoes until crispy"
          ]
        },
        {
          id: 5,
          title: "Creamy Onion Soup",
          time: "35 mins",
          description: "Warm and comforting onion soup.",
          ingredients: ["Onion", "Butter", "Milk"],
          steps: [
            "Slice onions",
            "Cook in butter",
            "Add milk",
            "Simmer and serve"
          ]
        }
      ]),
    });
  }
}