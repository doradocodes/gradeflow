"use client";

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { useRecorder } from "@/hooks/recorderHooks";
import { useAudioCache } from "@/hooks/useAudioCache";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import {
    AnnotationDots,
    Check, CheckCircleBroken,
    ChevronDown,
    Microphone01,
    PauseSquare, PlaySquare, Recording01,
} from "@untitledui/icons";

const Recorder = forwardRef(function Recorder({ onEndRecording, onAudioCaptured, assignmentId, submissionId }, ref) {
    const { start, pause, resume, stop, status } = useRecorder();
    const { loadFromCache } = useAudioCache();
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioURL, setAudioURL] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isCachedRecording, setIsCachedRecording] = useState(false);

    const analyserRef = useRef(null);
    const audioCtxRef = useRef(null);

    // Restore cached recording on mount
    useEffect(() => {
        if (!submissionId) return;
        async function restoreCache() {
            const cached = await loadFromCache(submissionId);
            if (cached) {
                setAudioFile(cached);
                const url = URL.createObjectURL(cached);
                setAudioURL(url);
                setIsCachedRecording(true);
                onAudioCaptured?.(cached);
            }
        }
        restoreCache();
    }, [submissionId]);

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

    const stopAndGetFile = async () => {
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
        setAudioURL(url);
        setIsCachedRecording(false);
        onAudioCaptured?.(file);

        return { file, url };
    };

    // Expose stopAndGetFile so parent can call it (e.g. on beforeunload)
    const statusRef = useRef(status);
    useEffect(() => { statusRef.current = status; }, [status]);

    useImperativeHandle(ref, () => ({
        stopAndGetFile,
        get isRecording() { return statusRef.current === "recording" || statusRef.current === "paused"; },
    }));

    const handleStop = async () => {
        await stopAndGetFile();
    };

    // Cache recording if user navigates away mid-recording
    const stopAndCacheRef = useRef(stopAndGetFile);
    useEffect(() => { stopAndCacheRef.current = stopAndGetFile; });

    useEffect(() => {
        return () => {
            if (statusRef.current === "recording" || statusRef.current === "paused") {
                stopAndCacheRef.current();
            }
        };
    }, []);

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
        onEndRecording(audioURL, audioFile);
    };

    return (
        <div className="flex flex-col gap-4">
            {status === "idle" && isCachedRecording && (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                            Recovered recording
                        </span>
                        <button
                            className="text-xs text-gray-400 hover:text-gray-600 underline"
                            onClick={() => { setAudioURL(null); setAudioFile(null); setIsCachedRecording(false); }}
                        >
                            Discard
                        </button>
                    </div>

                    <div className="flex gap-1">
                        <audio controls src={audioURL} className="w-full" />
                    </div>

                    <Button
                        size="lg"
                        color="primary-destructive"
                        className="w-full"
                        onClick={() => {
                            setAudioURL(null);
                            setAudioFile(null);
                            setIsCachedRecording(false);
                            handleStart();
                        }}
                        iconLeading={<Recording01 />}
                    >
                        Record new
                    </Button>

                    <Button size="lg" className="w-full cursor-pointer" iconLeading={<AnnotationDots data-icon />} onClick={onSubmit}>
                        Summarize feedback
                    </Button>
                </div>
            )}

            {status === "idle" && !audioURL && (
                <>
                    <Button
                        size="lg"
                        color="primary-destructive"
                        className="w-full"
                        onClick={handleStart}
                        iconLeading={<Recording01 />}
                    >
                        Record feedback
                    </Button>
                </>
            )}


            {status !== "idle" &&  (<div className="flex items-center justify-between gap-2">
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
                            <span
                                className="w-full whitespace-nowrap overflow-ellipsis overflow-hidden"
                            >
                                {devices.find((d) => d.deviceId === selectedDeviceId)?.label ||
                                    "Select microphone"}
                            </span>
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
                    <Button
                        color="tertiary"
                        size="md"
                        iconLeading={<PauseSquare data-icon />}
                        aria-label="Pause"
                        onClick={pause}
                    />
                )}
                {status === "paused" && (
                    <Button
                        color="tertiary"
                        size="md"
                        iconLeading={<PlaySquare data-icon />}
                        aria-label="Resume"
                        onClick={resume}
                    />
                )}
            </div>)}

            {status === "recording" &&
                <Button size="lg" className="w-full cursor-pointer" iconLeading={<CheckCircleBroken data-icon />} aria-label="Stop" onClick={handleStop}>
                    End recording
                </Button>
            }

            {status === "idle" && !isCachedRecording && audioURL && (
                <>
                    <div className="flex gap-2 flex-nowrap items-center">
                        <span>Playback</span>
                        <audio controls src={audioURL} className="w-full" />
                    </div>
                    <div>
                        <Button size="lg" className="w-full cursor-pointer" iconLeading={<AnnotationDots data-icon />} onClick={onSubmit}>
                            Summarize feedback
                        </Button>
                        <p className="text-sm italic text-gray-400 mt-2 text-center">
                            Your recording be saved, categorized and turned into written
                            feedback automatically.
                        </p>
                    </div>
                </>
            )}
        </div>
    );
})

export default Recorder;
