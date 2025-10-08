'use client'

import {useEffect, useState} from "react";
import Recorder from "@/components/Recorder";
import RubricCards from "@/components/RubricCards";
import {getAssignment, updateSubmission} from "@/utils/firestore";
import {Button} from "@/components/base/buttons/button";
import {Check, ChevronDown, ChevronUp, HelpCircle, MagicWand02} from "@untitledui/icons";
import clsx from "clsx";
import {Dropdown} from "@/components/base/dropdown/dropdown";
import Modal from "@/components/Modal";
import Markdown from "react-markdown";
import {LoadingIndicator} from "@/components/application/loading-indicator/loading-indicator";
import {Tooltip, TooltipTrigger} from "@/components/base/tooltip/tooltip";
import FeedbackSummary from "@/components/FeedbackSummary";

export default function GradingRubric({ submission, assignmentId, studentName, currentFile, setCurrentFile }) {
    const [assignment, setAssignment] = useState(null);
    const [collapsed, setCollapsed] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcript, setTranscript] = useState(null);
    const [summary, setSummary] = useState(null);
    const [isSummarized, setIsSummarized] = useState(false);

    useEffect(() => {
        async function load() {
            const data = await getAssignment(assignmentId);
            setAssignment(data);
        }
        load();
    }, []);

    const getRubricString = (rubric) => {
        if (!rubric) return '';
        let arr = Object.keys(rubric).map((key, i) => {
            return `${i + 1}. ${key}: ${rubric[key].criteria} (${rubric[key].maxPoints} points)`
        });
        return arr.join('\n');
    }

    const submitFeedback = async (audioUrl) => {
        // const cloudinaryURL =
        //     "https://api.cloudinary.com/v1_1/dkg091hsa/video/upload";
        // const formData = new FormData();
        // formData.append("file", audioFile);
        // formData.append("upload_preset", "gradeflow");
        //
        // // Upload the audio file to Cloudinary
        // const response = await fetch(cloudinaryURL, {
        //     method: "POST",
        //     body: formData,
        // });
        // const data = await response.json();

        setIsTranscribing(true);
        await handleTranscribe(audioUrl);
        setIsTranscribing(false);
    };

    const handleTranscribe = async (audioUrl) => {
        // Summarize the audio using the API
        const res = await fetch("/api/summarize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                audioUrl,
                rubric: getRubricString(assignment?.rubric),
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

        setTranscript(data.text);
        setSummary(data.summary);
        setIsSummarized(true);
    };

    if (!assignment) return null;

    return <div className={clsx([
        "flex flex-col fixed z-20 top-20 right-2 shadow-md rounded-lg bg-white max-w-lg transition-all duration-300",
        collapsed ? "h-16 overflow-hidden" : "h-auto"
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
        <div className="px-4">
            <RubricCards rubric={assignment.rubric} />
        </div>
        <div className="p-4">
            {isTranscribing ?
                <div className="text-center flex items-center justify-center gap-2">
                    <LoadingIndicator type="line-simple" size="sm" /> Transcribing...
                </div>
                :
                <Recorder onEndRecording={submitFeedback} />
            }
            {isSummarized &&
                <Modal
                    open={isSummarized}
                    onClose={() => setIsSummarized(false)}
                    title="Feedback summary"
                >
                    <FeedbackSummary submission={submission} />
                </Modal>
            }
        </div>
    </div>
}

