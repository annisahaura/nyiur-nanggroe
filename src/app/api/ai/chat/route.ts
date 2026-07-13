import { NextRequest, NextResponse } from "next/server";
import { AIService } from "@/lib/services/ai/ai.service";
import { getAuthUser } from "@/lib/utils/auth-helpers";
import { badRequest, handleError } from "@/lib/utils/api-response";

// POST /api/ai/chat
// Menyediakan obrolan streaming context-aware dengan Nyai Nyiur
export async function POST(req: NextRequest) {
  try {
    const { user } = await getAuthUser();

    const body = await req.json();
    const { messages, pathname = "/" } = body;

    if (!messages || !Array.isArray(messages)) {
      return badRequest("Daftar pesan wajib dilampirkan.");
    }

    // Panggil layanan obrolan AI utama
    const result = await AIService.chat({
      messages,
      pathname,
      userId: user?.id,
    });

    const encoder = new TextEncoder();
    let replyText = "";

    // Bangun readable stream untuk efek ketikan real-time (streaming response)
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          if (result.provider === "openai") {
            const openAIStream = result.stream as any;
            for await (const chunk of openAIStream) {
              const text = chunk.choices[0]?.delta?.content ?? "";
              if (text) {
                replyText += text;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
              }
            }
          } else {
            // Jalur stream Google Gemini
            const geminiStream = result.stream as any;
            for await (const chunk of geminiStream) {
              const text = chunk.text();
              if (text) {
                replyText += text;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
              }
            }
          }

          // Catat interaksi ke log setelah stream selesai tanpa menghambat respons
          const latency = Date.now() - result.startTime;
          AIService.log({
            user_id: user?.id,
            type: "chat",
            input: messages[messages.length - 1]?.content?.slice(0, 500),
            output: replyText.slice(0, 500),
            model: result.model,
            latency_ms: latency,
          }).catch(() => {});

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (streamError) {
          console.error("[AI Chat Stream Error]", streamError);
          controller.close();
        }
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
