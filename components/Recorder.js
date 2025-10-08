"use client";

import { db } from "@/utils/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useState, useEffect, useRef } from "react";
import { useRecorder } from "@/hooks/recorderHooks";
import Markdown from "react-markdown";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import {
    Check,
    ChevronDown,
    Microphone01,
    PauseSquare,
    StopSquare,
} from "@untitledui/icons";
import {updateSubmission} from "@/utils/firestore";
import {Input} from "@/components/base/input/input";

export default function Recorder({ onEndRecording }) {
    const { start, pause, resume, stop, status } = useRecorder();
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioURL, setAudioURL] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const analyserRef = useRef(null);
    const audioCtxRef = useRef(null);

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
        await start({ deviceId: selectedDeviceId });
        setupSpeakingDetection(selectedDeviceId);
    };

    const handleStop = async () => {
        const blob = await stop();

        if (audioCtxRef.current) {
            audioCtxRef.current.close();
            audioCtxRef.current = null;
            analyserRef.current = null;
        }

        const filename = `recording-${Date.now()}.mp3`;
        const file = new File([blob], filename, { type: "audio/mp3" });

        setAudioFile(file);
        const url = URL.createObjectURL(file);
        await setAudioURL(url);
    };

    function secondsToMinutesAndSeconds(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    }

    const setupSpeakingDetection = async (deviceId) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: { deviceId },
            });
            const audioCtx = new AudioContext();
            audioCtxRef.current = audioCtx;

            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            analyserRef.current = analyser;

            const dataArray = new Uint8Array(analyser.fftSize);

            function detect() {
                if (!analyserRef.current) return;
                analyserRef.current.getByteTimeDomainData(dataArray);
                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) {
                    sum += Math.abs(dataArray[i] - 128);
                }
                const avg = sum / dataArray.length;
                setIsSpeaking(avg > 5); // tweak threshold for sensitivity
                requestAnimationFrame(detect);
            }

            detect();
        } catch (err) {
            console.error("Mic access denied:", err);
        }
    };

    const onSubmit = async () => {
        onEndRecording(audioURL);
    };

    return (
        <div className="flex flex-col gap-4">
            {/*<input type="file" accept="audio/*" onChange={(e) => {*/}
            {/*    const url = URL.createObjectURL(e.target.files[0]);*/}
            {/*    setAudioURL(url);*/}

            {/*}} />*/}
            <Input label="Audio url" placeholder="Enter url" onChange={(value) => setAudioURL(value)} />

            {status === "idle" && !audioURL ? (
                <Button className="w-full" onClick={handleStart}>
                    Record feedback
                </Button>
            ) : (
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Microphone01
                            size={20}
                            className={`transition-opacity duration-100 ${
                                isSpeaking ? "opacity-100" : "opacity-10"
                            }`}
                        />

                        <Dropdown.Root>
                            <Button
                                className="group"
                                color="secondary"
                                iconTrailing={ChevronDown}
                            >
                                {devices.find((d) => d.deviceId === selectedDeviceId)?.label ||
                                    "Select microphone"}
                            </Button>

                            <Dropdown.Popover>
                                <Dropdown.Menu>
                                    {devices?.map((d) => (
                                        <Dropdown.Item
                                            key={d.deviceId}
                                            onClick={() => setSelectedDeviceId(d.deviceId)}
                                            icon={selectedDeviceId === d.deviceId ? Check : null}
                                        >
                                          <span className="text-left">
                                            {d.label || `Microphone ${d.deviceId}`}
                                          </span>
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown.Popover>
                        </Dropdown.Root>

                        <span>{secondsToMinutesAndSeconds(recordingTime)}</span>
                    </div>

                    {status === "recording" && (
                        <div className="flex flex-nowrap items-center">
                            <Button
                                color="tertiary"
                                size="md"
                                iconLeading={<PauseSquare data-icon />}
                                aria-label="Pause"
                                onClick={pause}
                            />
                            <Button
                                color="tertiary"
                                size="md"
                                iconLeading={<StopSquare data-icon />}
                                aria-label="Stop"
                                onClick={handleStop}
                            />
                        </div>
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
            )}

            {status === "idle" && audioURL && (
                <>
                    <div className="flex gap-2 flex-nowrap items-center">
                        <span>Playback</span>
                        <audio controls src={audioURL} className="w-full" />
                    </div>
                    <div>
                        <Button className="w-full cursor-pointer" onClick={onSubmit}>
                            End recording
                        </Button>
                        <p className="text-sm italic text-gray-400 mt-1">
                            Your recording be saved, categorized and turned into written
                            feedback automatically.
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
