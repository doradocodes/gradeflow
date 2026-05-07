'use client'

import {useEffect, useState, useRef, useMemo, useCallback} from "react";
import Recorder from "@/components/Recorder";
import RubricCards from "@/components/RubricCards";
import {getAssignment, updateSubmission} from "@/utils/firestore";
import {Button} from "@/components/base/buttons/button";
import {
    AlertTriangle,
    Check,
    CheckCircleBroken,
    ChevronDown,
    ChevronUp,
    Expand06,
    HelpCircle,
    Minimize02,
    MagicWand02
} from "@untitledui/icons";
import { usePictureInPicture } from "@/hooks/usePictureInPicture";
import { Tooltip } from "@/components/base/tooltip/tooltip";
import clsx from "clsx";
import {Dropdown} from "@/components/base/dropdown/dropdown";
import {LoadingIndicator} from "@/components/application/loading-indicator/loading-indicator";
import {useAudioCache} from "@/hooks/useAudioCache";

export default function GradingRubric({ submission, assignmentId, studentName, currentFile, setCurrentFile, onOpenSummary, onAudioCaptured, recorderRef }) {
    const [assignment, setAssignment] = useState(null);
    const [collapsed, setCollapsed] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [error, setError] = useState(null);
    const recorderMountedRef = useRef(false);
    const assignmentRef = useRef(null);
    const containerRef = useRef(null);
    const { deleteFromCache } = useAudioCache();
    const { isPip, isSupported: isPipSupported, openPip, closePip } = usePictureInPicture();

    const handleTogglePip = async () => {
        if (isPip) {
            closePip();
        } else {
            await openPip(containerRef, { width: 440, height: 800 });
        }
    };

    // Keep assignment ref in sync
    useEffect(() => {
        assignmentRef.current = assignment;
    }, [assignment]);

    // Track when recorder is first mounted
    useEffect(() => {
        if (!isTranscribing && assignment) {
            recorderMountedRef.current = true;
        }
    }, [isTranscribing, assignment]);

    useEffect(() => {
        async function load() {
            const data = await getAssignment(assignmentId);
            setAssignment(data);
        }
        load();
    }, []);

    const getRubricString = (rubric) => {
        if (!rubric) return '';
        let arr = rubric.map((r, i) => {
            return `${i + 1}. ${r.categoryName}: ${r.criteria} (${r.maxPoints} points)`
        });
        return arr.join('\n');
    }

    const handleTranscribe = useCallback(async (audioUrl, rubric, gradingScale) => {
        try {
            // Summarize the audio using the API
            const res = await fetch("/api/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    audioUrl,
                    rubric,
                    gradingScale: gradingScale ?? 'medium',
                }),
            });

            const data = await res.json();

            // Update the submission with the transcription and summary
            const updatedSubmission = {
                feedback: {
                    audioUrl: audioUrl,
                    transcript: data.text,
                    summary: data.summary,
                    createdAt: new Date(),
                }
            }
            await updateSubmission(submission.id, updatedSubmission);

            onOpenSummary(true);
        } catch (error) {
            console.error("Error during transcription and summarization:", error);
            setError(error);
        }
        setIsTranscribing(false);
    }, [submission.id, onOpenSummary]);

    const submitFeedback = useCallback(async (audioUrl, audioFile) => {
        setIsTranscribing(true);
        let url = audioUrl;
        if (audioFile) {
            const formData = new FormData();
            formData.append("file", audioFile);

            // Upload the audio file to Cloudflare R2
            try {
                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Failed to upload audio file");
                }

                const data = await response.json();
                url = data.url;

                // Upload succeeded — clear the cached recording
                await deleteFromCache(submission.id);
            } catch (error) {
                console.error("Error uploading audio file:", error);
                setIsTranscribing(false);
                setError(error);
                return;
            }
        }

        const rubricString = getRubricString(assignmentRef.current?.rubric);
        const gradingScale = assignmentRef.current?.gradingScale ?? 'medium';
        await handleTranscribe(url, rubricString, gradingScale);
    }, [handleTranscribe]);

    // Memoize the Recorder component to prevent re-renders when collapsed changes
    const recorderElement = useMemo(() => (
        <Recorder ref={recorderRef} onEndRecording={submitFeedback} onAudioCaptured={onAudioCaptured} assignmentId={assignmentId} submissionId={submission.id} />
    ), [submitFeedback, assignmentId, submission.id, onAudioCaptured, recorderRef]);

    if (!assignment) return null;

    return <div ref={containerRef} className={clsx([
        "grid grid-rows-[auto_auto_1fr_auto] z-20 shadow-md rounded-lg bg-white transition-all duration-300",
        isPip
            ? "w-full h-full max-h-full max-w-full rounded-none"
            : "fixed top-20 right-2 w-[400px]",
        !isPip && collapsed ? "max-h-16 overflow-hidden" : "h-[800px]",
    ])}>
        <div className="p-4 border-b border-gray-200 ">
            <div className="flex gap-1 justify-between items-center">
                <h2 className="text-1xl font-bold">{assignment?.courseName} - {assignment?.title} - {studentName}</h2>
                <div className="flex gap-1 items-center">
                    {isPipSupported && (
                        <Tooltip title={isPip ? "Close window" : "Open as window"} placement="top" arrow={true}>
                            <Button
                                color="tertiary"
                                size="sm"
                                iconLeading={isPip ? <Minimize02 data-icon /> : <Expand06 data-icon />}
                                aria-label={isPip ? "Close Picture-in-Picture" : "Open Picture-in-Picture"}
                                onClick={handleTogglePip}
                            />
                        </Tooltip>
                    )}
                    {!isPip && (
                        !collapsed
                            ? <Button color="tertiary" size="sm" iconLeading={<ChevronDown data-icon />} aria-label="Collapse" onClick={() => setCollapsed(true)} />
                            : <Button color="tertiary" size="sm" iconLeading={<ChevronUp data-icon />} aria-label="Expand" onClick={() => setCollapsed(false)} />
                    )}
                </div>
            </div>
        </div>
        <div className={clsx("transition-opacity duration-300", (!isPip && collapsed) ? "opacity-0 pointer-events-none" : "opacity-100")}>
            <div className="p-4 flex gap-2 items-center justify-between">
                <h3 className="font-bold text-gray-500">Viewing file</h3>
                <Dropdown.Root>
                    <Button
                        className="group"
                        color="secondary"
                        iconTrailing={ChevronDown}
                    >
                        {currentFile?.name || 'Select a file'}
                    </Button>

                    <Dropdown.Popover>
                        <Dropdown.Menu>
                            {submission?.deliverables.map((d, index) => (
                                <Dropdown.Item
                                    key={d.name}
                                    onClick={() => setCurrentFile(d)}
                                    icon={d.name === currentFile?.name ? Check : null}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">{d.name}</span>
                                    </div>
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown.Popover>
                </Dropdown.Root>
            </div>
        </div>
        <div className={clsx("transition-opacity duration-300 flex-1 overflow-y-auto max-h-[570px]", (!isPip && collapsed) ? "opacity-0 pointer-events-none" : "opacity-100")}>
            <div className="px-4">
                <RubricCards rubric={assignment.rubric} />
            </div>
        </div>
        <div className="p-4">
            {isTranscribing ?
                <div className={"flex gap-2 justify-center align-middle py-1"}>
                    <LoadingIndicator type="line-simple" size="xs" />
                    <span className={"text-gray-500 italic"}>Transcribing...</span>
                </div>
                :
                recorderElement
            }
            {error &&
                <div className="mt-2 text-sm text-red-500 text-center">
                    <AlertTriangle className="w-4 h-4 inline-block mr-2" />
                    <span className="text-center">Something went wrong: {error.message}</span>
                </div>
            }
            {!!submission.feedback &&
                <Button color="tertiary" className="w-full color-gray-500 mt-2" onClick={() => onOpenSummary(true)}>View completed summary</Button>
            }
        </div>
    </div>
}

