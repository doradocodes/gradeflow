import {useEffect, useRef, useState} from "react";
import {ChevronDown, ChevronUp, MagicWand02, Pencil01, Save01, Share06, Voicemail} from "@untitledui/icons";
import clsx from "clsx";
import {Button} from "@/components/base/buttons/button";
import {Tabs} from "@/components/application/tabs/tabs";
import {Breadcrumbs} from "@/components/application/breadcrumbs/breadcrumbs";
import {TextArea} from "@/components/base/textarea/textarea";
import {Input} from "@/components/base/input/input";
import {getSubmission, updateSubmission} from "@/utils/firestore";
import {NativeSelect} from "@/components/base/select/select-native";

export default function FeedbackSummary({submissionId, assignment}) {
    const [openTranscript, setOpenTranscript] = useState(false);
    const [feedback, setFeedback] = useState({});
    const [studentName, setStudentName] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [selectedTabIndex, setSelectedTabIndex] = useState("summary");

    const load = async () => {
        const submission = await getSubmission(submissionId);
        setStudentName(submission.studentName || '');
        setStudentEmail(submission.studentEmail || '');
        setFeedback(submission.feedback || {});
    };

    useEffect(() => {
        if (!submissionId) return;
        load();
    }, [submissionId]);

    const onSubmit = async (data) => {
        await updateSubmission(submissionId, data);
        await load();
    }

    const handleEdit = (updatedValues, index) => {
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
    }

    const formatSummary = (summary) => {
        return summary.map((item, index) => {
            return <Category data={item} onSave={(updatedValues) => handleEdit(updatedValues, index)}/>;
        });
    }

    const getFinalPoints = (summary) => {
        return summary.reduce((acc, item) => {
            return acc + parseInt(item.estimated_points);
        }, 0)
    }

    const onShareFeedback = (summary) => {
        // convert summary to plain text that can be copy/pasted into an email
        const formatSummaryEmail = () => {
            let emailText = `Feedback for ${studentName}:\n\n`
            summary.forEach((item) => {
                emailText += `${item.category} (${item.estimated_points}${item.max_points ? `/${item.max_points}` : ''} points)\n\n`;
                emailText += `${item.summary}\n\n`;
            });
            emailText += `${assignment.title} Final Score: ${getFinalPoints(summary)} points\n`;
            return emailText;
        }
        // copy to clipboard
        navigator.clipboard.writeText(formatSummaryEmail());
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    }

    if (!feedback) {
        return null;
    }


    const tabs = [
        {
            id: "summary", label: "Summary",
        },
        {
            id: "transcript", label: "Transcript",
        },
    ];

    return <>
        <Breadcrumbs className="mb-4" items={[
            { label: assignment.title, href: `/assignments/${assignment.id}` },
            { label: `${studentName} (${studentEmail})` },
        ]} />

        <div className="mb-4 flex items-center justify-between">
            <NativeSelect
                aria-label="Tabs"
                value={selectedTabIndex}
                onChange={(event) => setSelectedTabIndex(event.target.value)}
                options={tabs.map((tab) => ({label: tab.label, value: tab.id}))}
                className="w-80 md:hidden"
            />
            <Tabs selectedKey={selectedTabIndex} onSelectionChange={(key) => {
                setSelectedTabIndex(key);
            }} className="w-max max-md:hidden">
                <Tabs.List type="button-border" items={tabs}>
                    {(tab) => <Tabs.Item {...tab} />}
                </Tabs.List>
            </Tabs>
        </div>

        {/*Transcript*/}
        {selectedTabIndex === "transcript" && (<div className="border border-gray-200 rounded-xl p-6">
            <p className="italic text-gray-400">{feedback.transcript}</p>
        </div>)}

        {/*Summary*/}
        {selectedTabIndex === "summary" && (<div className="border border-gray-200 rounded-xl p-6">
            {feedback.summary && <>
                <div className="flex flex-col gap-4">{formatSummary(feedback.summary)}</div>
                <div className="flex justify-between border-t border-gray-300 py-4">
                    <p className="text-xl font-bold">Final score</p>
                    <p className="text-xl font-bold text-right">{getFinalPoints(feedback.summary)} points</p>
                </div>
            </>
            }

            <div className="">
                <Button
                    className="w-full mb-2"
                    color="primary"
                    size="lg"
                    iconLeading={<Share06 data-icon/>}
                    onClick={() => onShareFeedback(feedback.summary)}
                >Share with student</Button>
                {isCopied && <p className="text-center text-gray-400">Copied to clipboard!</p>}
            </div>
        </div>)}
    </>
}

function Category({data, onSave}) {
    const [isEditing, setIsEditing] = useState(false);

    const formRef = useRef(null);

    const handleSave = (e) => {
        e.preventDefault();

        const editedValues = {
            category: formRef.current.elements.category.value,
            estimated_points: formRef.current.elements.estimated_points.value,
            summary: formRef.current.elements.summary.value,
        }
        console.log(editedValues);
        onSave(editedValues);
        setIsEditing(false);
    };

    const handleEdit = (e) => {
        e.preventDefault();
        setIsEditing(true);
    }

    return <form ref={formRef} key={data?.category} className="">
        <div className="flex items-center justify-between mb-2">
            <div className="flex gap-2 w-full">
                {isEditing ?
                    <>
                        <Input name="category" type="text" size="sm" className="w-full" defaultValue={data.category}/>
                        <div className="flex gap-2">
                            <Input name="estimated_points" type="number" size="sm"
                                   defaultValue={data.estimated_points}/>
                            <Button
                                type="submit"
                                className="w-full"
                                color="tertiary"
                                size="sm"
                                iconLeading={<Save01 data-icon/>}
                                onClick={handleSave}
                            ></Button>
                        </div>
                    </>
                    :
                    <>
                        <p className="font-bold text-xl w-full">{data.category}</p>
                        <div className="flex gap-2 items-center">
                            <p className="font-bold text-xl whitespace-nowrap">{data.estimated_points} {data.max_points && `/ ${data.max_points}`} points</p>
                            <Button
                                type="button"
                                color="tertiary"
                                size="sm"
                                iconLeading={<Pencil01 data-icon/>}
                                onClick={handleEdit}
                            ></Button>
                        </div>
                    </>
                }
            </div>
        </div>
        {isEditing ?
            <TextArea name="summary" rows={5} defaultValue={data.summary}/>
            :
            <p className="text-md min-h-20">{data.summary}</p>
        }
    </form>
}