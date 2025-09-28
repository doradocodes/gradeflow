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

    return <form onSubmit={onSubmit} className="bg-white rounded-lg p-4 max-w-xl">
        <h2 className="text-xl font-bold mb-4">Add a new deliverable</h2>
        <div className="grid gap-2">
            <input
                className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                type="text"
                id="name"
                name="name"
                required
                placeholder="Name"
            />
            <select
                className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"

                id="fileType" name="fileType" required>
                <option value="pdf">PDF</option>
                <option value="url">URL</option>
                <option value="word">Word Document</option>
                <option value="excel">Excel Document</option>
                <option value="powerpoint">Powerpoint</option>
                <option value="other">Other</option>
            </select>
            <div className={"flex gap-2 mb-4"}>
                <label htmlFor="required">Required?</label>
                <input className="border border-gray-300 rounded-md" type="checkbox" id="required" name="required" required/>
            </div>
        </div>
        <Button type="submit">Create Assignment</Button>
    </form>
}