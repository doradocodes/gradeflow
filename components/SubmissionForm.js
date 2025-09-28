'use client'

import Button from "@/components/Button";
import {createSubmission, getAssignment, getAssignments} from "@/utils/firestore";
import {useEffect, useState} from "react";
import {Description, Dialog, DialogPanel, DialogTitle} from "@headlessui/react";
import Input from "@/components/Input";

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
                    value: value,
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

    const getInputPicker = (name, type) => {
        switch(type) {
            case 'file':
                return <>
                    <label htmlFor={`deliverables-${name}`}>{name}</label>
                    <div>
                        <input type="file" name={`deliverables-${name}`} required hidden />
                        <Button>Upload</Button>
                    </div>
                </>
            case 'url':
                return <div className={"flex items-center gap-2 w-full"}>
                    <Input type={"text"} name={`deliverables-${name}`} label={name} required />
                </div>
            default:
                return;
        }
    }

    return <div >
        <form onSubmit={onSubmit} className="flex flex-col gap-4 p-4 max-w-2xl bg-white rounded-lg">
            <h2 className="font-bold text-xl">New Submission</h2>
            <div className="flex flex-col gap-4">
                <Input type={"text"} name={"studentName"} label={"Student Name"} required />
                <Input type={"email"} name={"studentEmail"} label={"Student Email"} required />
                <h2 className="font-bold">Deliverables</h2>
                <div className="grid gap-2">
                    {assignment?.deliverables.map((d) => getInputPicker(d.name, d.fileType))}
                </div>
            </div>

            <Button type={"submit"}>Submit</Button>
            {error && <p className="text-red-500">{error}</p>}
        </form>
        <Dialog open={isSubmitted} onClose={() => {}} className="relative z-50">
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
                    <DialogTitle className="font-bold">Thank you for your submission!</DialogTitle>
                    <Description>Your files were submitted at {submittedAt?.toLocaleString()}</Description>
                    <p>You can now close this page.</p>
                </DialogPanel>
            </div>
        </Dialog>

    </div>
}