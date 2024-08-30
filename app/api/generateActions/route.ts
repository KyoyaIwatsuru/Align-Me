import OpenAI from "openai";
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { selectedJobs } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "あなたは大学生のキャリアアドバイザーです。",
        },
        {
          role: "user",
          content: `以下の選択された職種に基づいて、大学1年生が取るべき具体的な行動を職種ごとにリスト形式で提案してください。出力は以下の形式で行ってください:
          {
            "スポーツイベントプランナー": [
              "関連するクラブ活動に参加する: 大学内でのスポーツ関連のクラブ（例：体育会系クラブやイベント学生団体など）に参加し、イベントの企画・運営を学ぶ。",
              "ボランティア活動に参加する: 地元のスポーツイベントや大会のボランティアに参加し、実際の運営に関わることで経験を積む。",
              "インターンシップの応募: スポーツ関連企業やイベント会社でのインターンシップに応募し、現場経験を得る。",
              "ネットワークを広げる: スポーツ関連のセミナーやワークショップに参加し、業界で働く人たちとのコネクションを作る。"
            ],
            "プロモーション・マーケティング担当": [
              "マーケティング関連の講義を履修する: マーケティングや広告に関する授業を受け、基礎知識を身につける。",
              "広告やマーケティングのクラブに参加する: 大学内のマーケティング関連のサークルに参加し、実践的なスキルを磨く。",
              "インターンシップやアルバイトを探す: 広告代理店やスポーツ関連の企業でのインターンシップやアルバイトを経験し、実務を学ぶ。",
              "SNSマーケティングに取り組む: 自身のSNSアカウントを使って、スポーツや中高のクラブ活動を紹介し、小規模なプロモーションに挑戦する。"
            ]
          }`,
        },
      ],
    });

    const actions = completion.choices[0].message.content;
    console.log(actions);

    return NextResponse.json({ actions });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message });
  }
}
