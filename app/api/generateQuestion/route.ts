import OpenAI from "openai";
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.chatHistory.map((chat: { role: string, content: string }) => ({
      role: chat.role,
      content: chat.content
    }));

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        ...messages,
      ],
    });

    return NextResponse.json({ message: completion.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message });
  }
}