'use client'

import Button from "@/components/Button";
import {useAuth} from "@/components/AuthProvider";
import {createAssignment} from "@/utils/firestore";

export default function AssignmentsForm() {
    const { user, loading } = useAuth();

    if (loading) return <p>Loading...</p>;

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            userId: user.uid,
            courseName: formData.get("courseName"),
            title: formData.get("title"),
            description: formData.get("description"),
            dueDate: formData.get("dueDate"),
        };
        await createAssignment(data);
    }

    return <form onSubmit={onSubmit} className="border border-gray-300 rounded-md p-2 max-w-xl">
        <h2 className="text-xl font-bold mb-4">Add a new assignment</h2>
        <div className="grid gap-2 grid-cols-2 p-4">
            <label htmlFor="courseName">Course Name</label>
            <input className="border border-gray-300 rounded-md" type="text" id="courseName" name="courseName" required/>
            <label htmlFor="title">Title</label>
            <input className="border border-gray-300 rounded-md" type="text" id="title" name="title" required/>
            <label htmlFor="description">Description</label>
            <input className="border border-gray-300 rounded-md" type="text" id="description" name="description" required/>
            <label htmlFor="dueDate">Due Date</label>
            <input className="border border-gray-300 rounded-md"  type="date" id="dueDate" name="dueDate" required/>
        </div>
        <Button type="submit">Create Assignment</Button>
    </form>
}