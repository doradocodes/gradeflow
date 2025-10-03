'use client'

import {createSubmission, getAssignment, getAssignments} from "@/utils/firestore";
import {useEffect, useState} from "react";
import {Input, InputBase} from "@/components/base/input/input";
import {Button} from "@/components/base/buttons/button";
import {FileUploadProgressBar} from "@/components/FileUploadProgressBar";
import {Badge, BadgeIcon} from "@/components/base/badges/badges";
import {Check, CheckCircle} from "@untitledui/icons";
import Modal from "@/components/Modal";
import {InputGroup} from "@/components/base/input/input-group";

export default function SubmissionForm({ assignmentId }) {
    const [assignment, setAssignment] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submittedAt, setSubmittedAt] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            const data = await getAssignment(assignmentId);
            setAssignment(data);
        }
        load();
    }, []);

    const formatURL = (url) => {
        if (url.startsWith('http')) {
            return url;
        } else {
            return `https://${url}`;
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        // convert formData to an object
        const currentDate = new Date();
        const data = {
            assignmentId: assignmentId,
            status: currentDate.getTime() < new Date(assignment.dueDate).getTime() ? 'on_time' : 'late',
            deliverables: [],
            submittedAt: new Date(),
        };
        formData.forEach((value, key) => {
            if (key.startsWith('deliverables-')) {
                data.deliverables.push({
                    name: key.replace('deliverables-', ''),
                    value: formatURL(value),
                    required: assignment.deliverables.find(d => d.name === key.replace('deliverables-', '')).required,
                    type: assignment.deliverables.find(d => d.name === key.replace('deliverables-', '')).fileType,
                })
            } else {
                data[key] = value;
            }
        });
        console.log(data);
        try {
            await createSubmission(data);
            setIsSubmitted(true);
            setSubmittedAt(data.submittedAt);
        } catch (e) {
            setError(e);
        }
    }

    const getInputPicker = (name, type, index) => {
        switch(type) {
            case 'file':
                return [
                    <div className="flex items-center gap-1">
                        <CheckCircle size={20} className="opacity-25"/>
                        <span className="text-sm">{name}</span>
                        {/*<Badge type="color" color="brand" size="sm">{type}</Badge>*/}
                    </div>,
                    <FileUploadProgressBar />
                ]
            case 'url':
                return [
                    <div className="flex items-center gap-1">
                        <CheckCircle size={20} data-icon className="opacity-25"/>
                        <span className="text-sm">{name}</span>
                        {/*<Badge type="color" color="brand" size="sm">{type}</Badge>*/}
                    </div>,
                    <InputGroup isRequired >
                        <InputBase
                            type={"text"} name={`deliverables-${name}`} required
                            data-filetype="url"
                        />
                    </InputGroup>
                ]
            default:
                return;
        }
    }

    return <div className="bg-white rounded-lg w-full">
        <form onSubmit={onSubmit} className="p-4">
            <div className="grid grid-cols-[1.5fr_2fr] gap-8">
                <div className="flex flex-col gap-2">
                    <h2 className="font-bold mb-4">Student Information</h2>
                    <Input type={"text"} name={"studentName"} label={"Student Name"} required />
                    <Input type={"email"} name={"studentEmail"} label={"Student Email"} required />
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="font-bold mb-4">Deliverables</h2>
                    {assignment?.deliverables.map((d, index) => (
                        <div key={d.name} className="flex flex-col gap-1.5">{getInputPicker(d.name, d.fileType, index)}</div>
                    ))}
                </div>
            </div>
            <Button className="w-full" type={"submit"}>Submit</Button>
            {error && <p className="text-red-500">{error}</p>}
        </form>
        <Modal
            open={isSubmitted}
            onClose={() => setIsSubmitted(false)}
            title={"Submission successful!"}
        >
            <div className="w-full h-full flex flex-col justify-center items-center">
                <h1 className="text-center font-bold text-3xl mb-4">Thank you for your submission!</h1>
                <p className="text-center">Your files were submitted at {submittedAt?.toLocaleString()}</p>
                <p className="text-center">You can now close this page.</p>
            </div>
        </Modal>
    </div>
}