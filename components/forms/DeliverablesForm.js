'use client'

import {useAuth} from "@/components/AuthProvider";
import {updateAssignment} from "@/utils/firestore";
import {Button} from "@/components/base/buttons/button";
import {Select} from "@/components/base/select/select";
import {Input} from "@/components/base/input/input";
import {LoadingIndicator} from "@/components/application/loading-indicator/loading-indicator";
import {useRef, useState} from "react";
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
    const formRef = useRef(null);

    const onSubmitForm = async (e) => {
        e.preventDefault();
        const data = {
            name: formRef.current.elements.name.value,
            type: formRef.current.elements.type.value,
            required: formRef.current.elements.required.checked,
        };
        onSubmit(data);
    }

    return <form ref={formRef}>
        <h2 className="text-xl font-bold mb-4">Add a new deliverable</h2>
        <div className="flex flex-col gap-4">
            <Input isRequired label="Deliverable name" hint="Choose a name to describe the deliverable." placeholder="Deliverable name" tooltip="The name of the deliverable." name="name" type="text"/>
            <Select
                name="type"
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
            <Checkbox name="required" label="Required deliverable?" size="md"/>
        </div>
        <Button color="primary" size="sm" onClick={onSubmitForm}>Create new deliverable</Button>
    </form>
}