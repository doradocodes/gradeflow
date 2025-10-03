'use client'

import {useAuth} from "@/components/AuthProvider";
import {updateAssignment} from "@/utils/firestore";
import {Button} from "@/components/base/buttons/button";
import {Select} from "@/components/base/select/select";
import {Input} from "@/components/base/input/input";

const FILE_TYPES = [
    {
        label: 'URL',
        id: 'url',
    },
    {
        label: 'PDF',
        id: 'pdf',
    }
]

export default function DeliverablesForm({ assignmentId, prevData }) {
    const { user, loading } = useAuth();

    if (loading) return <LoadingIndicator type="line-simple" size="sm" />;

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
            <Input isRequired label="Deliverable name" hint="Choose a name to describe the deliverable." placeholder="Deliverable name" tooltip="The name of the deliverable." name="name" type="text" />
            <Select
                isRequired
                label="File type"
                tooltip="The type of file that students will submit for this deliverable."
                hint="Choose a file type for this deliverable."
                placeholder="Select a file type"
                items={FILE_TYPES}
            >
                {(item) => (
                    <Select.Item id={item.id} supportingText={item.supportingText} isDisabled={item.isDisabled} icon={item.icon} avatarUrl={item.avatarUrl}>
                        {item.label}
                    </Select.Item>
                )}
            </Select>
            <div className={"flex gap-2 mb-4"}>
                <label htmlFor="required">Required?</label>
                <input className="border border-gray-300 rounded-md" type="checkbox" id="required" name="required" required/>
            </div>
        </div>
        <Button color="primary" size="sm" type="submit">Create new deliverable</Button>
    </form>
}