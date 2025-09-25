'use client'

import Button from "@/components/Button";
import {createSubmission, getAssignment, getAssignments} from "@/utils/firestore";
import {useEffect, useState} from "react";
import {Description, Dialog, DialogPanel, DialogTitle} from "@headlessui/react";

export default function SubmissionForm({ assignmentId }) {
    const [assignment, setAssignment] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

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
        };
        formData.forEach((value, key) => {
            data[key] = value;
        });
        await createSubmission(data);
        setIsSubmitted(true);
    }

    const getInputPicker = (name, type) => {
        switch(type) {
            case 'file':
                return <>
                    <label htmlFor={name}>{name}</label>
                    <div>
                        <input type="file" name={name} required hidden />
                        <Button>Upload</Button>
                    </div>
                </>
            case 'url':
                return <>
                    <label htmlFor={name}>{name}</label>
                    <input className="border border-gray-300 rounded-md" type="text" id="url" name="url" required/>
                </>
            default:
                return;
        }
    }

    return <>
        <form onSubmit={onSubmit}>
            <div className="flex gap-2 items-center">
                <label htmlFor="studentName">Student name</label>
                <input className="border border-gray-300 rounded-md" type="text" id="studentName" name="studentName"
                       placeholder="Your name" required/>
            </div>

            <div className="flex gap-2 items-center">
                <label htmlFor="studentEmail">Student email</label>
                <input className="border border-gray-300 rounded-md" type="email" id="studentEmail" name="studentEmail"
                       placeholder="Your email" required/>
            </div>

            <div className="p-4 border border-gray-300 rounded-md">
                <h2 className="font-bold">Required files</h2>
                <div className="grid gap-2 grid-cols-2">
                    {assignment?.deliverables.map((d) => getInputPicker(d.name, d.fileType))}
                </div>
            </div>

            <Button type={"submit"}>Submit</Button>
        </form>
        <Dialog open={false} onClose={() => {}} className="relative z-50">
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
                    <DialogTitle className="font-bold">Thank you for your submission!</DialogTitle>
                    <Description>Your files were submitted at </Description>
                </DialogPanel>
            </div>
        </Dialog>

    </>
}