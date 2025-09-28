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

    return <form onSubmit={onSubmit} className="rounded-md p-4 max-w-xl">
        <h2 className="text-xl font-bold mb-4">Add a new rubric category</h2>
        <div className="grid gap-2">
            <input
                className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                type="text"
                id="categoryName"
                name="categoryName"
                required
                placeholder="Category Name"
            />
            <input
                className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                type="number"
                id="maxPoints"
                name="maxPoints"
                required
                placeholder="Max Points"
            />
            <textarea
                className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                id="criteria"
                name="criteria"
                required
                placeholder="Criteria (bullet points)"
            />
        </div>
        <Button type="submit">Create Assignment</Button>
    </form>
}