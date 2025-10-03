'use client'

import {useAuth} from "@/components/AuthProvider";
import {createAssignment, updateAssignment} from "@/utils/firestore";
import {Input} from "@/components/base/input/input";
import {Button} from "@/components/base/buttons/button";
import {LoadingIndicator} from "@/components/application/loading-indicator/loading-indicator";
import {useState} from "react";

export default function AssignmentsForm({ defaultValue, onClose, onSubmit }) {
    const { user, loading } = useAuth();

    if (loading) return <LoadingIndicator type="line-simple" size="sm" />;

    const [courseName, setCourseName] = useState(defaultValue?.courseName || '');
    const [title, setTitle] = useState(defaultValue?.title || '');
    const [description, setDescription] = useState(defaultValue?.description || '');
    const [dueDate, setDueDate] = useState(defaultValue?.dueDate || '');

    const onSubmitForm = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            userId: user.uid,
            courseName: formData.get("courseName"),
            title: formData.get("title"),
            description: formData.get("description"),
            dueDate: formData.get("dueDate"),
        };
        if (defaultValue) {
            data.id = defaultValue.id;
        }
        await onSubmit(data);
        onClose();
    }

    return <form onSubmit={onSubmitForm} className="">
        <div className="grid gap-4 mb-4">
            <Input isRequired label="Course name" placeholder="Course name" tooltip="The name of the course." name="courseName" type="text" defaultValue={courseName} onChange={(e) => setCourseName(e.target.value)} />
            <Input isRequired label="Title" placeholder="Title" tooltip="The title of the assignment." name="title" type="text" defaultValue={title} onChange={(e) => setTitle(e.target.value)} />
            <Input isRequired label="Description" placeholder="Description" tooltip="The description of the assignment." name="description" type="text" defaultValue={description} onChange={(e) => setDescription(e.target.value)} />
            <Input isRequired label="Due date" placeholder="Due date" tooltip="The due date of the assignment." name="dueDate" type="date" defaultValue={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <Button color="primary" size="sm" type="submit">{defaultValue ? 'Update assignment' : 'Create new assignment'}</Button>
    </form>
}