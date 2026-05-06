import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const image = body.image;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
Identify the food ingredients visible in this image.

Return ONLY valid JSON array.

Example:
["Tomato", "Onion", "Cheese"]
`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: image,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = result.response.text();

    return NextResponse.json({
      data: response,
    });

  } catch (error: any) {
    console.error(error);

    // Fallback ingredients
    return NextResponse.json({
      data: JSON.stringify([
        "Tomato",
        "Onion",
        "Cheese",
        "Garlic",
        "Bread",
      ]),
    });
  }
}