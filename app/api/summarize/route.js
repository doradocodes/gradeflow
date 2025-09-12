// app/api/transcribe/route.js
import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY, // don’t hardcode keys
});

export async function POST(req) {
    const body = await req.json();

    const params = {
        audio: body.audioUrl, // frontend will send audio file URL
        speech_model: "universal",
    };

    // Step 1: Transcribe an audio file.
    const transcript = await client.transcripts.transcribe(params);

    // Step 2: Define a summarization prompt.
    const prompt = "Summarize as if you were a college professor speaking to an undergraduate student.";

    // Step 3: Apply LeMUR.
    const { response } = await client.lemur.task({
        transcript_ids: [transcript.id],
        prompt,
        final_model: "anthropic/claude-sonnet-4-20250514",
    });

    return Response.json({
        text: transcript.text,
        summary: response,
    });
}
