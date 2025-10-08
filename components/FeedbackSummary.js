import {useState} from "react";
import {ChevronDown, ChevronUp, MagicWand02, Pencil01} from "@untitledui/icons";
import clsx from "clsx";
import {Button} from "@/components/base/buttons/button";
import {TextArea} from "@/components/base/textarea/textarea";
import {Input} from "@/components/base/input/input";
import {updateSubmission} from "@/utils/firestore";

export default function FeedbackSummary({ submission }) {
    const [openTranscript, setOpenTranscript] = useState(false);
    const [feedback, setFeedback] = useState(submission.feedback || {});
    const [isEditing, setIsEditing] = useState(false);

    const onSubmit = async () => {
        const data = {
            feedback: feedback,
        };
        await updateSubmission(submission.id, data);
    }

    const formatSummary = (summary) => {
        return summary.map((item) => {
            return <div key={item.category} className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-xl">{item.category}</p>
                    {isEditing ?
                        <Input type="number" size="sm" className="max-w-1/6" defaultValue={item.estimated_points} onChange={(value) => {
                            const newObj = summary.map(i => {
                                if (i.category === item.category) {
                                    return {
                                        ...i,
                                        estimated_points: parseInt(value),
                                    }
                                }
                                return i;
                            });
                            setFeedback({...feedback, summary: newObj});
                        }}/>
                        :
                        <p className={"font-bold text-xl flex gap-2"}><MagicWand02 className="text-gray-400" /> {item.estimated_points} points</p>
                    }
                </div>
                {isEditing ?
                    <TextArea rows={5} defaultValue={item.summary} onChange={(value) => {
                        const newObj = summary.map(i => {
                            if (i.category === item.category) {
                                return {
                                    ...i,
                                    summary: value,
                                }
                            }
                            return i;
                        });
                        setFeedback({...feedback, summary: newObj});
                    }}/>
                    :
                    <p>{item.summary}</p>
                }
            </div>
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
                <h2 className="text-xl font-bold my-4">Transcript</h2>
                {openTranscript ?
                    <ChevronUp data-icon className="text-gray-400" onClick={() => setOpenTranscript(false)}/>
                    :
                    <ChevronDown data-icon className="text-gray-400" onClick={() => setOpenTranscript(true)}/>}
            </div>
            <div className={clsx(   [
                openTranscript ? 'h-auto' : 'h-0 overflow-hidden',
                'transition-all duration-300'
            ])}>
                <p className="mb-4">{feedback.transcript}</p>
            </div>
        </div>

        {/*Summary*/}
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold my-4">Summary</h2>
            { isEditing ?
                <Button size="sm" iconLeading={<Pencil01 data-icon />} onClick={() => {
                    setIsEditing(false);
                    onSubmit();
                }}>Save</Button>
                :
                <Button size="sm" iconLeading={<Pencil01 data-icon />} onClick={() => setIsEditing(true)}>Edit</Button>
            }
        </div>
        {feedback.summary && <>
            <div>{formatSummary(feedback.summary)}</div>
            <p className="text-xl font-bold border-t border-gray-300 py-4">Final score: {getFinalPoints(feedback.summary)}</p>
        </>
        }

        <Button color="primary" className="w-full mt-4" size="lg">Share with student</Button>
    </>
}
