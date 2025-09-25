'use client'

import Button from "@/components/Button";
import {useAuth} from "@/components/AuthProvider";
import {updateAssignment} from "@/utils/firestore";

export default function RubricForm({ assignmentId, prevData }) {
    const { user, loading } = useAuth();

    if (loading) return <p>Loading...</p>;

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            rubric: {
                ...prevData.rubric,
                [formData.get("categoryName")]: {
                    maxPoints: formData.get("maxPoints"),
                    criteria: formData.get("criteria"),
                }
            }
        };
        await updateAssignment(assignmentId, data)
    }

    return <form onSubmit={onSubmit} className="border border-gray-300 rounded-md p-2 max-w-xl">
        <h2 className="text-xl font-bold mb-4">Add a new rubric category</h2>
        <div className="grid gap-2 grid-cols-2 p-4">
            <label htmlFor="categoryName">Category Name</label>
            <input className="border border-gray-300 rounded-md" type="text" id="categoryName" name="categoryName" required/>
            <label htmlFor="maxPoints">Max Points</label>
            <input className="border border-gray-300 rounded-md" type="number" id="maxPoints" name="maxPoints" required/>
            <label htmlFor="criteria">Criteria (bullet points)</label>
            <textarea className="border border-gray-300 rounded-md" id="criteria" name="criteria" required/>
        </div>
        <Button type="submit">Create Assignment</Button>
    </form>
}