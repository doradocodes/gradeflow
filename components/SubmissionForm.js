'use client'

import {createSubmission} from "@/utils/firestore";
import {useState} from "react";
import {Input, InputBase} from "@/components/base/input/input";
import {Button} from "@/components/base/buttons/button";
import {FileUploadProgressBar} from "@/components/FileUploadProgressBar";
import {CheckCircle} from "@untitledui/icons";
import Modal from "@/components/Modal";
import {InputGroup} from "@/components/base/input/input-group";
import clsx from "clsx";
import {Badge} from "@/components/base/badges/badges";

export default function SubmissionForm({ onSubmit, deliverables, isInline, defaultValues }) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submittedAt, setSubmittedAt] = useState(null);
    const [error, setError] = useState(null);

    const [studentName, setStudentName] = useState(defaultValues?.studentName || '');
    const [studentEmail, setStudentEmail] = useState(defaultValues?.studentEmail ||'');
    const [deliverablesList, setDeliverablesList] = useState(defaultValues?.deliverables || deliverables);


    const formatURL = (url) => {
        if (url.startsWith('http')) {
            return url;
        } else {
            return `https://${url}`;
        }
    }

    const onSubmitForm = async (e) => {
        e.preventDefault();
        const currentDate = new Date();
        const data = {
            studentName,
            studentEmail,
            deliverables: deliverablesList.map((d, index) => {
                return {
                    name: d.name,
                    value: e.target.elements[`deliverables-${d.name}`].value,
                    required: d.required,
                    type: d.type,
                }
            }),
            submittedAt: currentDate,
        };
        await onSubmit(data);
        if (!isInline) {
            setIsSubmitted(true);
            setSubmittedAt(data.submittedAt);
        }
    }

    const getInputPicker = (name, type, required, defaultValue) => {
        switch(type) {
            case 'url':
                return <div>
                    <div className="flex items-center gap-1">
                        <CheckCircle size={20} data-icon className="opacity-25"/>
                        <span className="text-sm text-secondary font-medium">{name}</span>
                        <Badge type="color" color="brand" size="sm">{type}</Badge>
                    </div>
                    <Input type={"text"} name={`deliverables-${name}`} required={required} data-filetype="url" defaultValue={defaultValue || ''} />
                </div>
            default:
                return <div>
                    <div className="flex items-center gap-1">
                        <CheckCircle size={20} data-icon className="opacity-25"/>
                        <span className="text-sm text-secondary font-medium">{name}</span>
                        <Badge type="color" color="brand" size="sm">{type}</Badge>
                    </div>
                    <Input type={"text"} name={`deliverables-${name}`} required={required} data-filetype={type} defaultValue={defaultValue || ''} />
                </div>
        }
    }

    return <div className="">
        <form onSubmit={onSubmitForm} className="">
            <div className={
                clsx(
                    "grid gap-8 mb-4",
                    isInline ? "grid-cols-1" : "grid-cols-[1.5fr_2fr]"
                )
            }>
                <div className="flex flex-col gap-2">
                    <h2 className="font-bold text-secondary mb-4">Student Information</h2>
                    <Input
                        type={"text"}
                        name={"studentName"}
                        label={"Student Name"}
                        required
                        onChange={(value) => setStudentName(value)}
                        defaultValue={studentName}
                    />
                    <Input
                        type={"email"}
                        name={"studentEmail"}
                        label={"Student Email"}
                        required
                        onChange={(value) => setStudentEmail(value)}
                        defaultValue={studentEmail}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="font-bold text-secondary mb-4">Deliverables</h2>
                    {deliverablesList.map((d, index) => (
                        <div
                            key={d.name}
                            className="flex flex-col gap-1.5"
                        >
                            {getInputPicker(
                                d.name,
                                d.type,
                                d.required,
                                d.value
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <Button className="w-full" type={"submit"}>Submit</Button>
            {error && <p className="text-red-500">{error}</p>}
        </form>
        <Modal
            open={isSubmitted}
            onClose={() => setIsSubmitted(false)}
        >
            <div className="w-full h-full min-h-60 flex flex-col justify-center items-center pb-4">
                <h1 className="text-center font-bold text-3xl mb-4">Thank you for your submission!</h1>
                <p className="text-center">Your files were submitted at <b>{submittedAt?.toLocaleString()}</b>.</p>
                <p className="text-center">You can now close this page.</p>
            </div>
        </Modal>
    </div>
}