"use client"; // because we’re using hooks + fetch

import { useState } from "react";

export default function HomePage() {
    const [transcript, setTranscript] = useState(null);
    const [summary, setSummary] = useState(null);

    async function handleTranscribe() {
        const res = await fetch("/api/summarize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                audioUrl: "https://assembly.ai/wildfires.mp3", // or user-uploaded audio
            }),
        });

        const data = await res.json();
        setTranscript(data.text);
        setSummary(data.summary);
    }

    return (
        <div>
            <h1>AssemblyAI Test</h1>
            <button className="rounded-full bg-black text-white" onClick={handleTranscribe}>Transcribe</button>
            {transcript && <p>Transcript: {transcript}</p>}
            {summary && <p>Summary: {summary}</p>}
        </div>
    );
}
