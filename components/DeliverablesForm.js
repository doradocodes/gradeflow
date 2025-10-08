'use client'

import {useAuth} from "@/components/AuthProvider";
import {updateAssignment} from "@/utils/firestore";
import {Button} from "@/components/base/buttons/button";
import {Select} from "@/components/base/select/select";
import {Input} from "@/components/base/input/input";
import {LoadingIndicator} from "@/components/application/loading-indicator/loading-indicator";
import {useState} from "react";
import {Checkbox} from "@/components/base/checkbox/checkbox";

export const FILE_TYPES = [
    {
        label: 'URL',
        id: 'url',
    },
    {
        label: 'PDF',
        id: 'pdf',
    }
]

export default function DeliverablesForm({ onSubmit }) {
    const [name , setName] = useState(null);
    const [fileType, setFileType] = useState(null);
    const [required, setRequired] = useState(null);

    const onSubmitForm = async (e) => {
        e.preventDefault();
        const data = {
            name,
            fileType,
            required: required || false,
        };
        onSubmit(data);
    }

    return <form onSubmit={onSubmitForm} className="">
        <h2 className="text-xl font-bold mb-4">Add a new deliverable</h2>
        <div className="flex flex-col gap-4">
            <Input isRequired label="Deliverable name" hint="Choose a name to describe the deliverable." placeholder="Deliverable name" tooltip="The name of the deliverable." name="name" type="text" onChange={value => setName(value)}/>
            <Select
                isRequired
                label="File type"
                tooltip="The type of file that students will submit for this deliverable."
                hint="Choose a file type for this deliverable."
                placeholder="Select a file type"
                items={FILE_TYPES}
                onSelectionChange={(value) => setFileType(value)}
            >
                {(item) => (
                    <Select.Item id={item.id} supportingText={item.supportingText} isDisabled={item.isDisabled} icon={item.icon} avatarUrl={item.avatarUrl}>
                        {item.label}
                    </Select.Item>
                )}
            </Select>
            <Checkbox label="Required deliverable?" size="md" onChange={value => setRequired(value)}/>
        </div>
        <Button color="primary" size="sm" type="submit">Create new deliverable</Button>
    </form>
}