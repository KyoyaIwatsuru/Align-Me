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
      content: chat.content,
    }));

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        ...messages,
        {
          role: "user",
          content: `以下の会話に基づいて、ユーザーの興味やスキルに合ったいくつかの職種をリスト形式で提案してください。
          出力形式は以下のようにしてください：
          職種1
          職種2
          職種3
          それ以外の情報を含めず、リスト形式でのみ返答してください。`
        },
      ],
    });

    const fullResponse = completion.choices[0].message.content;

    const jobSuggestions = fullResponse
      ? fullResponse
          .split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('-') && !line.includes('。'))
      : [];
    console.log(jobSuggestions);

    return NextResponse.json({ message: fullResponse, jobs: jobSuggestions });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message });
  }
}
