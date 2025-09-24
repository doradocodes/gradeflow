import { useState, useRef } from "react";

export function useRecorder() {
    const [status, setStatus] = useState("idle"); // idle | recording | paused
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const start = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (e) =>
            chunksRef.current.push(e.data);

        mediaRecorderRef.current.start();
        setStatus("recording");
    };

    const pause = () => {
        if (mediaRecorderRef.current?.state === "recording") {
            mediaRecorderRef.current.pause();
            setStatus("paused");
        }
    };

    const resume = () => {
        if (mediaRecorderRef.current?.state === "paused") {
            mediaRecorderRef.current.resume();
            setStatus("recording");
        }
    };

    const stop = () =>
        new Promise((resolve) => {
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                chunksRef.current = [];
                setStatus("idle");
                resolve(blob);
            };
            mediaRecorderRef.current.stop();
        });

    return { start, pause, resume, stop, status };
}
