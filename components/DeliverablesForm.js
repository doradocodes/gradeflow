'use client'

import Button from "@/components/Button";
import {useAuth} from "@/components/AuthProvider";
import {updateAssignment} from "@/utils/firestore";

export default function DeliverablesForm({ assignmentId, prevData }) {
    const { user, loading } = useAuth();

    if (loading) return <p>Loading...</p>;

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            deliverables: [
                ...prevData.deliverables,
                {
                    name: formData.get("name"),
                    fileType: formData.get("fileType"),
                    required: formData.get("required") === "on",
                }
            ]
        };
        await updateAssignment(assignmentId, data)
    }

    return <form onSubmit={onSubmit} className="border border-gray-300 rounded-md p-2 max-w-xl">
        <h2 className="text-xl font-bold mb-4">Add a new deliverable</h2>
        <div className="grid gap-2 grid-cols-2 p-4">
            <label htmlFor="name">Name</label>
            <input className="border border-gray-300 rounded-md" type="text" id="name" name="name" required/>
            <label htmlFor="fileType">File Type</label>
            <select className="border border-gray-300 rounded-md" id="fileType" name="fileType" required>
                <option value="pdf">PDF</option>
                <option value="url">URL</option>
                <option value="word">Word Document</option>
                <option value="excel">Excel Document</option>
                <option value="powerpoint">Powerpoint</option>
                <option value="other">Other</option>
            </select>
            <label htmlFor="required">Required?</label>
            <input className="border border-gray-300 rounded-md" type="checkbox" id="required" name="required" required/>
        </div>
        <Button type="submit">Create Assignment</Button>
    </form>
}