'use client'

import {Button} from "@/components/base/buttons/button";
import {Select} from "@/components/base/select/select";
import {Input} from "@/components/base/input/input";
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

export default function DeliverablesForm({onSubmit}) {
    const formRef = useRef(null);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        const name = formRef.current.elements.name.value.trim();
        const type = formRef.current.elements.type.value;

        // Validate name
        if (!name) {
            newErrors.name = 'Deliverable name is required.';
        } else if (name.length < 2) {
            newErrors.name = 'Deliverable name must be at least 2 characters.';
        }

        // Validate type
        if (!type) {
            newErrors.type = 'File type is required.';
        } else if (!FILE_TYPES.some(ft => ft.id === type)) {
            newErrors.type = 'Please select a valid file type.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const onSubmitForm = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const data = {
            name: formRef.current.elements.name.value.trim(),
            type: formRef.current.elements.type.value,
            required: formRef.current.elements.required.checked,
        };
        setErrors({});
        onSubmit(data);
        
        // Reset form after successful submission
        formRef.current.reset();
    }

    const handleInputChange = (field) => {
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[field];
                return newErrors;
            });
        }
    }

    return <form ref={formRef}>
        <h2 className=" font-semibold mb-4">Add a new deliverable</h2>
        <div className="flex flex-col gap-4 mb-4">
            <Input 
                isRequired 
                isInvalid={!!errors.name}
                label="Deliverable name" 
                hint={errors.name || "Choose a name to describe the deliverable."}
                placeholder="Deliverable name" 
                tooltip="The name of the deliverable." 
                name="name" 
                type="text"
                onChange={() => handleInputChange('name')}
            />
            <Select
                name="type"
                isRequired
                isInvalid={!!errors.type}
                label="File type"
                tooltip="The type of file that students will submit for this deliverable."
                hint={errors.type || "Choose a file type for this deliverable."}
                placeholder="Select a file type"
                items={FILE_TYPES}
                onSelectionChange={() => handleInputChange('type')}
            >
                {(item) => (
                    <Select.Item id={item.id} supportingText={item.supportingText} isDisabled={item.isDisabled}
                                 icon={item.icon} avatarUrl={item.avatarUrl}>
                        {item.label}
                    </Select.Item>
                )}
            </Select>
            <Checkbox name="required" label="Required deliverable?" size="sm"/>
        </div>
        <Button color="primary" size="sm" onClick={onSubmitForm}>Create new deliverable</Button>
    </form>
}