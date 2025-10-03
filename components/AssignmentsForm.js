'use client'

import {useAuth} from "@/components/AuthProvider";
import {createAssignment} from "@/utils/firestore";
import {Input} from "@/components/base/input/input";
import {Button} from "@/components/base/buttons/button";

export default function AssignmentsForm() {
    const { user, loading } = useAuth();

    if (loading) return <LoadingIndicator type="line-simple" size="sm" />;

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

    return <form onSubmit={onSubmit} className="">
        <div className="grid gap-4 mb-4">
            <Input isRequired label="Course name" placeholder="Course name" tooltip="The name of the course." name="courseName" type="text" />
            <Input isRequired label="Title" placeholder="Title" tooltip="The title of the assignment." name="title" type="text" />
            <Input isRequired label="Description" placeholder="Description" tooltip="The description of the assignment." name="description" type="text" />
            <Input isRequired label="Due date" placeholder="Due date" tooltip="The due date of the assignment." name="dueDate" type="date" />
        </div>
        <Button color="primary" size="sm" type="submit">Create new assignment</Button>
    </form>
}