'use client'

import {useAuth} from "@/components/AuthProvider";
import {Input} from "@/components/base/input/input";
import {Button} from "@/components/base/buttons/button";
import {LoadingIndicator} from "@/components/application/loading-indicator/loading-indicator";
import {useRef, useState} from "react";
import {Plus, XClose} from "@untitledui/icons";
import {Badge} from "@/components/base/badges/badges";
import DeliverablesForm from "@/components/forms/DeliverablesForm";
import {ButtonUtility} from "@/components/base/buttons/button-utility";

export default function AssignmentsForm({defaultValue, onClose, onSubmit}) {
    const {user, loading} = useAuth();

    if (loading) return <LoadingIndicator type="line-simple" size="sm"/>;

    const formRef = useRef(null);
    const [isAddingDeliverable, setIsAddingDeliverable] = useState(false);
    const [errors, setErrors] = useState({});

    const [deliverables, setDeliverables] = useState(defaultValue?.deliverables || []);

    const validateForm = () => {
        const newErrors = {};
        const courseName = formRef.current.elements.courseName.value.trim();
        const title = formRef.current.elements.title.value.trim();
        const description = formRef.current.elements.description.value.trim();
        const dueDate = formRef.current.elements.dueDate.value;

        // Validate course name
        if (!courseName) {
            newErrors.courseName = 'Course name is required.';
        } else if (courseName.length < 2) {
            newErrors.courseName = 'Course name must be at least 2 characters.';
        }

        // Validate title
        if (!title) {
            newErrors.title = 'Title is required.';
        } else if (title.length < 2) {
            newErrors.title = 'Title must be at least 2 characters.';
        }

        // Validate description
        if (!description) {
            newErrors.description = 'Description is required.';
        } else if (description.length < 10) {
            newErrors.description = 'Description must be at least 10 characters.';
        }

        // Validate due date
        if (!dueDate) {
            newErrors.dueDate = 'Due date is required.';
        } else {
            const selectedDate = new Date(dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                newErrors.dueDate = 'Due date cannot be in the past.';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const onSubmitForm = async (e) => {
        console.log('onSubmitForm');
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const data = {
            userId: user.uid,
            courseName: formRef.current.elements.courseName.value.trim(),
            title: formRef.current.elements.title.value.trim(),
            description: formRef.current.elements.description.value.trim(),
            dueDate: formRef.current.elements.dueDate.value,
            deliverables,
        };
        if (defaultValue) {
            data.id = defaultValue.id;
        }
        console.log(data);
        setErrors({});
        await onSubmit(data);
        onClose();
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

    const addDeliverable = (data) => {
        console.log(data);
        setDeliverables([...deliverables, data]);
        setIsAddingDeliverable(false);
    }

    const removeDeliverable = (index) => {
        const newDeliverables = [...deliverables];
        newDeliverables.splice(index, 1);
        setDeliverables(newDeliverables);
    }

    return <>
        <form ref={formRef} onSubmit={onSubmitForm}>
            <div className="grid gap-4 mb-4">
                <Input 
                    isRequired 
                    isInvalid={!!errors.courseName}
                    label="Course name" 
                    placeholder="Course name" 
                    tooltip="The name of the course."
                    name="courseName" 
                    type="text" 
                    defaultValue={defaultValue?.courseName}
                    onChange={() => handleInputChange('courseName')}
                />
                <Input 
                    isRequired 
                    isInvalid={!!errors.title}
                    label="Title" 
                    placeholder="Title" 
                    tooltip="The title of the assignment." 
                    name="title"
                    type="text" 
                    defaultValue={defaultValue?.title}
                    onChange={() => handleInputChange('title')}
                />
                <Input 
                    isRequired 
                    isInvalid={!!errors.description}
                    label="Description" 
                    placeholder="Description"
                    tooltip="The description of the assignment." 
                    name="description" 
                    type="text"
                    defaultValue={defaultValue?.description}
                    onChange={() => handleInputChange('description')}
                />
                <Input 
                    isRequired 
                    isInvalid={!!errors.dueDate}
                    label="Due date" 
                    placeholder="Due date" 
                    tooltip="The due date of the assignment."
                    name="dueDate" 
                    type="date" 
                    defaultValue={defaultValue?.dueDate}
                    onChange={() => handleInputChange('dueDate')}
                />
            </div>

            <div className="mb-4">
                <h3 className="text-sm font-medium text-secondary mb-2">Deliverables</h3>
                <ol style={{listStyle: 'decimal'}}>
                    {deliverables.map((d, index) => (
                        <li key={index} className="flex items-center gap-2 mb-2">
                            <span>{index + 1}. {d.name}</span> <Badge type="color" color="brand"
                                                                      size="sm">{d.type}</Badge>
                            {d.required && <Badge type="color" color="brand" size="sm">Required</Badge>}
                            <ButtonUtility size="xs" color="tertiary" tooltip="Remove" icon={XClose}
                                           onClick={() => removeDeliverable(index)}/>
                        </li>
                    ))}
                </ol>
                {isAddingDeliverable ?
                    <div className="border border-gray-300 p-4 rounded-lg">
                        <DeliverablesForm onSubmit={addDeliverable}/>
                    </div>
                    :
                    <Button color="secondary" size="sm" onClick={() => setIsAddingDeliverable(true)} iconLeading={Plus}>Add
                        deliverable</Button>
                }
            </div>
            <Button color="primary" size="sm"
                    type="submit">{defaultValue ? 'Update assignment' : 'Create new assignment'}</Button>
        </form>
    </>;
}