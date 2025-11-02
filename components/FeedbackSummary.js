import {useEffect, useRef, useState} from "react";
import {ChevronDown, ChevronUp, MagicWand02, Pencil01, Save01, Share01, Share06, Voicemail} from "@untitledui/icons";
import clsx from "clsx";
import {Button} from "@/components/base/buttons/button";
import {TextArea} from "@/components/base/textarea/textarea";
import {Input} from "@/components/base/input/input";
import {getSubmission, updateSubmission} from "@/utils/firestore";

export default function FeedbackSummary({ submissionId }) {
    const [openTranscript, setOpenTranscript] = useState(false);
    const [feedback, setFeedback] = useState({});

    const load = async () => {
        const submission = await getSubmission(submissionId);
        setFeedback(submission.feedback || {});
    };

    useEffect(() => {
        load();
    }, []);

    const onSubmit = async (data) => {
        await updateSubmission(submissionId, data);
        await load();
    }

    const formatSummary = (summary) => {
        return summary.map((item, index) => {
            return <Category data={item} onSave={(updatedValues) => {
                const data = {
                    ...feedback,
                    summary: feedback.summary.map((summaryItem, summaryIndex) => {
                        if (summaryIndex === index) {
                            return {
                                ...summaryItem,
                                ...updatedValues
                            }
                        }
                        return summaryItem;
                    })
                };
                onSubmit({
                    feedback: data
                });
            }} />;
        });
    }

    const getFinalPoints = (summary) => {
        return summary.reduce((acc, item) => {
            return acc + parseInt(item.estimated_points);
        }, 0)
    }

    if (!feedback) {
        return null;
    }

    return <>
        {/*Transcript*/}
        <div className="border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold my-4"><Voicemail className=" inline-block mr-1" />Transcript</h2>
                {openTranscript ?
                    <ChevronUp data-icon className="text-gray-400" onClick={() => setOpenTranscript(false)}/>
                    :
                    <ChevronDown data-icon className="text-gray-400" onClick={() => setOpenTranscript(true)}/>}
            </div>
            <div className={clsx(   [
                openTranscript ? 'h-auto' : 'h-0 overflow-hidden',
                'transition-all duration-300'
            ])}>
                <p className="mb-4 italic text-gray-400">{feedback.transcript}</p>
            </div>
        </div>

        {/*Summary*/}
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold my-4"><MagicWand02 className=" inline-block" /> Summary</h2>
        </div>
        {feedback.summary && <>
            <div>{formatSummary(feedback.summary)}</div>
            <div className="flex justify-between border-t border-gray-300 py-4">
                <p className="text-xl font-bold">Final score</p>
                <p className="text-xl font-bold text-right">{getFinalPoints(feedback.summary)} points</p>
            </div>
        </>
        }

        <div className="mt-6">
            <div>
                <Button
                    className="w-full mb-4"
                    color="primary"
                    size="lg"
                    iconLeading={<Share06 data-icon />}
                >Share with student</Button>
            </div>
        </div>
    </>
}

function Category({ data, onSave }) {
    const [isEditing, setIsEditing] = useState(false);

    const categoryNameRef = useRef(null);
    const categoryPointsRef = useRef(null);
    const summaryRef = useRef(null);

    const getEditedValues = () => {
        return {
            category: categoryNameRef.current.value,
            estimated_points: categoryPointsRef.current.value,
            summary: summaryRef.current.textContent,
        }
    };

    const handleSave = () => {
        const editedValues = getEditedValues();
        onSave(editedValues);
    };

    return <div key={data?.category} className="mb-8">
        <div className="flex items-center justify-between mb-2">
            <div className="flex gap-2 w-full">
                {isEditing ?
                    <>
                        <Input ref={categoryNameRef} type="text" size="sm" className="w-full" defaultValue={data.category}/>
                        <div className="flex gap-2">
                            <Input ref={categoryPointsRef} type="number" size="sm" defaultValue={data.estimated_points}/>
                            <Button
                                className="w-full"
                                color="tertiary"
                                size="sm"
                                iconLeading={<Save01 data-icon />}
                                onClick={() => {
                                    setIsEditing(false);
                                    handleSave();
                                }}></Button>
                        </div>
                    </>
                    :
                    <>
                        <p className="font-bold text-xl w-full">{data.category}</p>
                        <div className="flex gap-2 items-center">
                            <p className="font-bold text-xl whitespace-nowrap">{data.estimated_points} {data.max_points && `/ ${data.max_points}`} points</p>
                            <Button
                                color="tertiary"
                                size="sm"
                                iconLeading={<Pencil01 data-icon />}
                                onClick={() => setIsEditing(true)}
                            ></Button>
                        </div>
                    </>
                }
            </div>
        </div>
        {isEditing ?
            <TextArea ref={summaryRef} rows={5} defaultValue={data.summary} />
            :
            <p className="text-md min-h-20">{data.summary}</p>
        }
    </div>
}