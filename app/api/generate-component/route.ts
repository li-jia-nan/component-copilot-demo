import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { LLM_Response } from "../../interface";
import { baseSystemPrompt, buildUserPrompt } from "@/app/utils";

export const dynamic = "force-dynamic";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.MOONSHOT_API_KEY,
  baseURL: "https://api.moonshot.cn/v1",
});

export const POST = async (request: Request) => {
  const { prompt } = await request.json();

  if (!prompt.trim()) {
    return NextResponse.json<LLM_Response>({
      success: false,
      data: null,
      error: "Invalid prompt",
    });
  }

  try {
    const stream = await client.chat.completions.create({
      model: "kimi-k2-0905-preview",
      messages: [
        { role: "system", content: baseSystemPrompt() },
        { role: "user", content: buildUserPrompt(prompt.trim()) },
      ],
      temperature: 0.6,
      stream: false,
    });
    const responseText = stream.choices[0]?.message?.content || "";
    return NextResponse.json<LLM_Response>({
      success: true,
      data: responseText,
      error: null,
    });
  } catch (e) {
    return NextResponse.json<LLM_Response>({
      success: false,
      data: null,
      error: (e as Error).message || "Error generating response",
    });
  }
};
