import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY, // don’t hardcode keys
});

export async function POST(req) {
    const jsonHeaders = { "Content-Type": "application/json" };

    if (!process.env.ASSEMBLYAI_API_KEY) {
        console.error("Missing ASSEMBLYAI_API_KEY");
        return new Response(JSON.stringify({ error: "Server not configured" }), { status: 500, headers: jsonHeaders });
    }

    let body;
    try {
        body = await req.json();
    } catch (err) {
        console.error("Invalid JSON body:", err);
        return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: jsonHeaders });
    }

    if (!body?.audioUrl) {
        return new Response(JSON.stringify({ error: "Missing `audioUrl` in request body" }), { status: 400, headers: jsonHeaders });
    }

    const params = {
        audio: body.audioUrl, // frontend will send audio file URL
        speech_model: "universal",
    };

    // Step 1: Transcribe an audio file.
    let transcript;
    try {
        transcript = await client.transcripts.transcribe(params);
    } catch (err) {
        console.error("Transcription failed:", err);
        return new Response(JSON.stringify({ error: "Transcription failed" }), { status: 502, headers: jsonHeaders });
    }

    if (!transcript?.id) {
        console.error("Invalid transcript response:", transcript);
        return new Response(JSON.stringify({ error: "Invalid transcript response" }), { status: 502, headers: jsonHeaders });
    }

    // Step 2: Define a summarization prompt.
    const prompt = body.rubric ? `
    I am a teacher evaluating a student's project presentation. Summarize the following transcript by categorizing the content under the given grading rubric: ${body.rubric}
    
    For each rubric category, I want a short summary (2–3 sentences) and estimate the points earned for that category.
    If a category is not addressed in the transcript, explicitly state "Not addressed.". 
    The summary should be written from the perspective of the teacher, who is writing feedback to the student. The summary should be in the tone of the speaker from the audio.
    The category name should match exactly as given in the rubric.
    The summary should be in JSON format with the following structure:
    {[
        {
            "category": "Category name",
            "estimated_points": 10,
            "max_points": 10,
            "summary": "The summary of the category"
        }
        ...
    ]}
    ` : 'Create a summary of the following transcript:';

    // Step 3: Send transcript to LLM Gateway.
    let llmResponse;
    try {
        const res = await fetch("https://llm-gateway.assemblyai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": process.env.ASSEMBLYAI_API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                messages: [
                    {
                        role: "user",
                        content: `${prompt}\n\n${transcript.text}`,
                    },
                ],
                max_tokens: 2000,
            }),
        });

        if (!res.ok) {
            const errBody = await res.text();
            throw new Error(`LLM Gateway returned ${res.status}: ${errBody}`);
        }

        llmResponse = await res.json();
    } catch (err) {
        console.error("LLM Gateway summarization failed:", err);
        return new Response(JSON.stringify({
            error: "Summarization failed",
            details: err.message,
        }), { status: 502, headers: jsonHeaders });
    }

    const responseText = llmResponse?.choices?.[0]?.message?.content;
    if (!responseText) {
        console.error("Empty LLM Gateway response:", llmResponse);
        return new Response(JSON.stringify({
            error: "Empty summarization response",
            details: llmResponse
        }), { status: 502, headers: jsonHeaders });
    }

    const formattedResponse = responseText.replace('```json', '').replace('```', '').trim();

    let parsedResponse;
    try {
        parsedResponse = JSON.parse(formattedResponse);
    } catch (err) {
        console.error("Failed to parse summarization JSON:", err, "raw:", formattedResponse);
        return new Response(
            JSON.stringify({ error: "Failed to parse summarization JSON", raw_summary: formattedResponse }),
            { status: 502, headers: jsonHeaders }
        );
    }

    return new Response(
        JSON.stringify({
            text: transcript.text ?? "",
            summary: parsedResponse,
        }),
        { status: 200, headers: jsonHeaders }
    );
}
