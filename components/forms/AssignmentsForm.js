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

    const [deliverables, setDeliverables] = useState(defaultValue?.deliverables || []);

    const onSubmitForm = async (e) => {
        e.preventDefault();
        const data = {
            userId: user.uid,
            courseName: e.target.elements.courseName.value,
            title: e.target.elements.title.value,
            description: e.target.elements.description.value,
            dueDate: e.target.elements.dueDate.value,
            deliverables,
        };
        if (defaultValue) {
            data.id = defaultValue.id;
        }
        console.log(data);
        await onSubmit(data);
        onClose();
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
                <Input isRequired label="Course name" placeholder="Course name" tooltip="The name of the course."
                       name="courseName" type="text" defaultValue={defaultValue?.courseName}/>
                <Input isRequired label="Title" placeholder="Title" tooltip="The title of the assignment." name="title"
                       type="text" defaultValue={defaultValue?.title}/>
                <Input isRequired label="Description" placeholder="Description"
                       tooltip="The description of the assignment." name="description" type="text"
                       defaultValue={defaultValue?.description}/>
                <Input isRequired label="Due date" placeholder="Due date" tooltip="The due date of the assignment."
                       name="dueDate" type="date" defaultValue={defaultValue?.dueDate}/>
            </div>

            <div className="mb-4">
                <h3 className="font-bold">Deliverables</h3>
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