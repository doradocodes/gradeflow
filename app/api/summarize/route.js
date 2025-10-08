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
    const prompt = body.rubric ? `
    I am a teacher evaluating a student's project presentation. Summarize the following transcript by categorizing the content under the given grading rubric: ${body.rubric}
    
    For each rubric category, I want a short summary (2–3 sentences) and estimate the points earned for that category.
    If a category is not addressed in the transcript, explicitly state "Not addressed.". 
    The summary should be written from the perspective of the teacher, who is writing feedback to the student. The summary should be in the tone of the speaker from the audio.
    The summary should be in JSON format with the following structure:
    {[
        {
            "category": "Category name",
            "estimated_points": 10,
            "summary": "The summary of the category"
        }
        ...
    ]}
    ` : 'Create a summary of the following transcript:';

    // Step 3: Apply LeMUR.
    const { response } = await client.lemur.summary({
        transcript_ids: [transcript.id],
        final_model: "anthropic/claude-sonnet-4-20250514",
        context: prompt,
        answer_format: "json",
    })
    // const { response } = await client.lemur.task({
    //     transcript_ids: [transcript.id],
    //     prompt,
    //     final_model: "anthropic/claude-sonnet-4-20250514",
    // });
    //
    const formattedResponse = response.replace('```json', '').replace('```', '').trim();
    const parsedResponse = JSON.parse(formattedResponse);
    return Response.json({
        text: transcript.text,
        summary: parsedResponse,
    });
}
