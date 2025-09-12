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

    const transcript = await client.transcripts.transcribe(params);

    return Response.json({ text: transcript.text });
}
