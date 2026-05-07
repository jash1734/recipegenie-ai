import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { dishName } = await req.json();

    const prompt = `
Generate a detailed recipe for this dish: ${dishName}

STRICT RULES:
- Return ONLY valid JSON
- No markdown
- No explanation text

Format:
{
  "id": number,
  "title": "string",
  "time": "string",
  "image": "string",
  "description": "string",
  "ingredients": ["string"],
  "steps": ["string"]
}
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
    console.error(error);

    // fallback recipe
    return NextResponse.json({
      data: JSON.stringify({
        id: 1,
        title: "Paneer Butter Masala",
        image: "paneer",
        time: "35 mins",
        description:
          "A rich and creamy North Indian curry made with paneer, butter, tomatoes, and aromatic spices.",
        ingredients: [
          "Paneer",
          "Butter",
          "Tomato",
          "Cream",
          "Onion",
        ],
        steps: [
          "Heat butter in a pan.",
          "Add onions and cook until golden.",
          "Add tomatoes and spices.",
          "Blend into smooth gravy.",
          "Add paneer cubes.",
          "Cook for 10 minutes.",
          "Add cream and mix well.",
          "Serve hot with naan or rice.",
        ],
      }),
    });
  }
}