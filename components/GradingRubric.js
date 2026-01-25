'use client'

import {useEffect, useState, useRef, useMemo, useCallback} from "react";
import Recorder from "@/components/Recorder";
import RubricCards from "@/components/RubricCards";
import {getAssignment, updateSubmission} from "@/utils/firestore";
import {Button} from "@/components/base/buttons/button";
import {AlertTriangle, Check, ChevronDown, ChevronUp, HelpCircle, MagicWand02} from "@untitledui/icons";
import clsx from "clsx";
import {Dropdown} from "@/components/base/dropdown/dropdown";
import {LoadingIndicator} from "@/components/application/loading-indicator/loading-indicator";

export default function GradingRubric({ submission, assignmentId, studentName, currentFile, setCurrentFile, onOpenSummary }) {
    const [assignment, setAssignment] = useState(null);
    const [collapsed, setCollapsed] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [error, setError] = useState(null);
    const recorderMountedRef = useRef(false);
    const assignmentRef = useRef(null);

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

    const handleTranscribe = useCallback(async (audioUrl, rubric) => {
        try {
            // Summarize the audio using the API
            const res = await fetch("/api/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    audioUrl,
                    rubric,
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
            const cloudinaryURL =
                "https://api.cloudinary.com/v1_1/dkg091hsa/video/upload";
            const formData = new FormData();
            formData.append("file", audioFile);
            formData.append("upload_preset", "gradeflow");

            // Upload the audio file to Cloudinary
            try {
                const response = await fetch(cloudinaryURL, {
                    method: "POST",
                    body: formData,
                });
                const data = await response.json();
                url = data.secure_url;
            } catch (error) {
                console.error("Error uploading audio file:", error);
                setIsTranscribing(false);
                setError(error);
                return;
            }
        }

        const rubricString = getRubricString(assignmentRef.current?.rubric);
        await handleTranscribe(url, rubricString);
    }, [handleTranscribe]);

    // Memoize the Recorder component to prevent re-renders when collapsed changes
    const recorderElement = useMemo(() => (
        <Recorder onEndRecording={submitFeedback} />
    ), [submitFeedback]);

    if (!assignment) return null;

    return <div className={clsx([
        "flex flex-col fixed z-20 top-20 right-2 shadow-md rounded-lg bg-white max-w-lg transition-all duration-300",
        collapsed ? "max-h-16 overflow-hidden" : "max-h-[800px]"
    ])}>
        <div className="p-4 border-b border-gray-200 ">
            <div className="flex gap-1 justify-between items-center">
                <h2 className="text-1xl font-bold">{assignment?.courseName} - {assignment?.title} - {studentName}</h2>
                {!collapsed ? <Button color="tertiary" size="sm" iconLeading={<ChevronDown data-icon />} aria-label="Expand" onClick={() => setCollapsed(true)} />
                    :
                    <Button color="tertiary" size="sm" iconLeading={<ChevronUp data-icon />} aria-label="Collapse" onClick={() => setCollapsed(false)} />
                }
            </div>
        </div>
        <div className={clsx("transition-opacity duration-300", collapsed ? "opacity-0 pointer-events-none" : "opacity-100")}>
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
            <div className="px-4 max-h-96 overflow-y-auto">
                <RubricCards rubric={assignment.rubric} />
            </div>
        </div>
        <div className="p-4">
            {isTranscribing ?
                <div className="text-center flex items-center justify-center gap-2">
                    <LoadingIndicator type="line-simple" size="sm" /> Transcribing...
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
                <Button color="tertiary" className="w-full color-gray-500 mt-2" onClick={() => onOpenSummary(true)}>View summary</Button>
            }
        </div>

    </div>
}

