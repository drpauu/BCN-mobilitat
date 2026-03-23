import { NextRequest, NextResponse } from "next/server";
import { contextSummary } from "@/data/mobility";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY no configurada. Afegeix-la al fitxer .env.local" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: contextSummary,
          },
          ...messages,
        ],
        max_tokens: 500,
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return NextResponse.json({ error: err.error?.message || "Error de l'API" }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "No he pogut obtenir resposta.";
    return NextResponse.json({ content });
  } catch (error) {
    console.error("OpenAI error:", error);
    return NextResponse.json(
      { error: "Error de connexió amb l'API d'OpenAI" },
      { status: 500 }
    );
  }
}
