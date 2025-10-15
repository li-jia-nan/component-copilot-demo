import OpenAI from "openai";

export const dynamic = "force-dynamic";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.MOONSHOT_API_KEY,
  baseURL: "https://api.moonshot.cn/v1",
});

export async function POST(req: Request) {
  const { messages, temperature = 0.6, model = "kimi-k2-0905-preview" } = await req.json();

  try {
    const stream = await client.chat.completions.create({
      model,
      messages,
      temperature,
      stream: true,
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const part of stream) {
            const delta = part.choices?.[0]?.delta?.content ?? "";
            if (delta) {
              controller.enqueue(encoder.encode(delta));
            }
          }
        } catch (err) {
          controller.error(err);
          return;
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message ?? "Moonshot request failed",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
