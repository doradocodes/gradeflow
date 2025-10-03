'use client'

import {useAuth} from "@/components/AuthProvider";
import {updateAssignment} from "@/utils/firestore";
import {Button} from "@/components/base/buttons/button";
import {Input} from "@/components/base/input/input";
import {TextArea} from "@/components/base/textarea/textarea";

export default function RubricForm({ assignmentId, prevData }) {
    const { user, loading } = useAuth();

    if (loading) return <LoadingIndicator type="line-simple" size="sm" />;

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

    return <form onSubmit={onSubmit} className="rounded-md p-4">
        <h2 className="text-xl font-bold mb-4">Add a new rubric category</h2>
        <div className="grid gap-2 mb-4">
            <Input isRequired label="Category Name" placeholder="Category Name" tooltip="The name of the category." name="categoryName" type="text" />
            <Input isRequired label="Max Points" placeholder="Max Points" tooltip="The maximum points for this category." name="maxPoints" type="number" />
            <TextArea isRequired placeholder="A description of the category criteria (in bullet points)." label="Description" rows={5} />
        </div>
        <Button type="submit">Create Assignment</Button>
    </form>
}