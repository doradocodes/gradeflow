"use client";

import { db } from "@/utils/firebase";
import { collection, addDoc } from "firebase/firestore";
import {CheckIcon, MicrophoneIcon} from "@heroicons/react/16/solid";
import Button from "@/components/Button";
import {useState, useEffect} from "react";
import {useRecorder} from "@/hooks/recorderHooks";
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/react"; // your hook

export default function Recorder({}) {
    const {start, pause, resume, stop, status} = useRecorder();
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioURL, setAudioURL] = useState(null);
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState(null);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcript, setTranscript] = useState(null);
    const [summary, setSummary] = useState(null);

    // Get list of audio input devices
    useEffect(() => {
        async function loadDevices() {
            const allDevices = await navigator.mediaDevices.enumerateDevices();
            const mics = allDevices.filter((d) => d.kind === "audioinput");
            setDevices(mics);
            if (mics.length > 0) setSelectedDeviceId(mics[0].deviceId);
        }

        loadDevices();
        navigator.mediaDevices.addEventListener("devicechange", loadDevices);
        return () => {
            navigator.mediaDevices.removeEventListener("devicechange", loadDevices);
        };
    }, []);

    // Timer effect
    useEffect(() => {
        let interval;
        if (status === "recording") {
            interval = setInterval(() => {
                setRecordingTime((t) => t + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [status]);

    useEffect(() => {
        if (status === "idle") setRecordingTime(0);
    }, [status]);

    const handleStart = async () => {
        await start({deviceId: selectedDeviceId}); // pass deviceId to the hook
    };

    const handleStop = async () => {
        const blob = await stop();

        // Wrap blob in a File with a custom name
        const filename = `recording-${Date.now()}.mp3`; // you can change the naming scheme
        const file = new File([blob], filename, {type: "audio/mp3"});

        const url = URL.createObjectURL(file);
        console.log("Audio URL:", url);
        await setAudioURL(url);
    };

    function secondsToMinutesAndSeconds(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    }

    const submitFeedback = async () => {
        // Upload to Cloudinary
        const cloudinaryURL = "https://api.cloudinary.com/v1_1/dkg091hsa/video/upload";
        const formData = new FormData();
        formData.append("file", audioURL);
        formData.append("upload_preset", "gradeflow");
        
        const response = await fetch(cloudinaryURL, {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        console.log("Cloudinary response:", data);

        // save audio url to firebase db
        try {
            await addDoc(collection(db, "recordings"), {
                audioUrl,
                transcript: data.text,
                summary: data.summary,
                createdAt: new Date(),
            });
            console.log("Recording saved to Firebase ✅");
        } catch (err) {
            console.error("Error saving to Firebase:", err);
        }

        setIsTranscribing(true);
        await handleTranscribe(data.url);
        setIsTranscribing(false);
    }

    const handleTranscribe = async (audioUrl) => {
        const res = await fetch("/api/summarize", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                audioUrl,
            }),
        });

        const data = await res.json();

        setTranscript(data.text);
        setSummary(data.summary);
    };

    return (
        <div className="flex flex-col gap-4">
            {status === "idle" && !audioURL ?
                <Button
                    className="w-full"
                    onClick={handleStart}
                >Record feedback</Button>
                :
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Menu>
                            <MenuButton
                                className="inline-flex items-center text-sm/6 font-semibold shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white cursor-pointer">
                                <MicrophoneIcon className="size-4"/>
                            </MenuButton>

                            <MenuItems
                                transition
                                anchor="bottom start"
                                className="w-52 origin-top-right rounded-xl border border-white/5 bg-white shadow-md p-1 text-xs/6 transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
                            >
                                {devices.map((d) => (
                                    <MenuItem key={d.deviceId}>
                                        <button onClick={() => setSelectedDeviceId(d.deviceId)}
                                                className="group flex w-full items-center gap-2 rounded-lg px-1 py-1.5 data-focus:bg-white/10 text-center cursor-pointer">
                                            {d.label || `Microphone ${d.deviceId}`}
                                            {selectedDeviceId === d.deviceId && <CheckIcon className="size-4"/>}
                                        </button>
                                    </MenuItem>
                                ))}
                            </MenuItems>
                        </Menu>

                        <span>{secondsToMinutesAndSeconds(recordingTime)}</span>
                    </div>

                    {status === "recording" && (
                        <>
                            <Button className="text-xs" onClick={pause}>
                                Pause
                            </Button>
                            <Button className="text-xs" onClick={handleStop}>
                                Stop
                            </Button>
                        </>
                    )}
                    {status === "paused" && (
                        <>
                            <Button className="text-xs" onClick={resume}>
                                Resume
                            </Button>
                            <Button className="text-xs" onClick={handleStop}>
                                Stop
                            </Button>
                        </>
                    )}
                </div>
            }

            {status === "idle" && audioURL && !isTranscribing && (
                <>
                    <div className="flex gap-2 flex-nowrap items-center">
                        <span>Playback</span>
                        <audio controls src={audioURL} className="w-full"/>
                    </div>
                    <div>
                        <Button className="w-full cursor-pointer" onClick={submitFeedback}>Submit feedback</Button>
                        <p className="text-sm italic text-gray-400 mt-1">Your recording be saved, categorized and turned into written feedback automatically.</p>
                    </div>
                </>
            )}

            {isTranscribing ?
                <p className="text-center">Transcribing...</p>
                :
                <>
                    {transcript && <p>{transcript}</p>}
                    {summary && <p>{summary}</p>}
                </>
            }

        </div>
    );
}
