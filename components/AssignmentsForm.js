'use client'

import {useAuth} from "@/components/AuthProvider";
import {createAssignment, updateAssignment} from "@/utils/firestore";
import {Input} from "@/components/base/input/input";
import {Button} from "@/components/base/buttons/button";
import {LoadingIndicator} from "@/components/application/loading-indicator/loading-indicator";
import {useRef, useState} from "react";
import {Plus, PlusCircle, Trash01, XClose} from "@untitledui/icons";
import {Badge, BadgeIcon} from "@/components/base/badges/badges";
import {Select} from "@/components/base/select/select";
import DeliverablesForm from "@/components/DeliverablesForm";
import {FILE_TYPES} from "@/components/DeliverablesForm";
import {ButtonUtility} from "@/components/base/buttons/button-utility";

export default function AssignmentsForm({ defaultValue, onClose, onSubmit }) {
    const { user, loading } = useAuth();

    if (loading) return <LoadingIndicator type="line-simple" size="sm" />;

    const formRef = useRef(null);
    const [isAddingDeliverable, setIsAddingDeliverable] = useState(false);

    const [courseName, setCourseName] = useState(defaultValue?.courseName || '');
    const [title, setTitle] = useState(defaultValue?.title || '');
    const [description, setDescription] = useState(defaultValue?.description || '');
    const [dueDate, setDueDate] = useState(defaultValue?.dueDate || '');
    const [deliverables, setDeliverables] = useState(defaultValue?.deliverables || []);

    const onSubmitForm = async () => {
        const data = {
            userId: user.uid,
            courseName,
            title,
            description,
            dueDate,
            deliverables,
        };
        if (defaultValue) {
            data.id = defaultValue.id;
        }
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
        <form ref={formRef} onSubmit={onSubmitForm} className="">
            <div className="grid gap-4 mb-4">
                <Input isRequired label="Course name" placeholder="Course name" tooltip="The name of the course." name="courseName" type="text" defaultValue={courseName} onChange={(value) => setCourseName(value)} />
                <Input isRequired label="Title" placeholder="Title" tooltip="The title of the assignment." name="title" type="text" defaultValue={title} onChange={(value) => setTitle(value)} />
                <Input isRequired label="Description" placeholder="Description" tooltip="The description of the assignment." name="description" type="text" defaultValue={description} onChange={(value) => setDescription(value)} />
                <Input isRequired label="Due date" placeholder="Due date" tooltip="The due date of the assignment." name="dueDate" type="date" defaultValue={dueDate} onChange={(value) => setDueDate(value)} />
            </div>
        </form>
        <div className="mb-4">
            <h3 className="font-bold">Deliverables</h3>
            <ol style={{listStyle: 'decimal'}}>
                {deliverables.map((d, index) => (
                    <li key={index} className="flex items-center gap-2 mb-2">
                        <span>{index + 1}. {d.name}</span> <Badge type="color" color="brand" size="sm">{d.fileType}</Badge>
                        {d.required && <Badge type="color" color="brand" size="sm">Required</Badge>}
                        <ButtonUtility size="xs" color="tertiary" tooltip="Remove" icon={XClose} onClick={() => removeDeliverable(index)}/>
                    </li>
                ))}
            </ol>
            {isAddingDeliverable ?
                <div className="border border-gray-300 p-4 rounded-lg">
                    <DeliverablesForm onSubmit={addDeliverable}/>
                </div>
                :
                <Button color="secondary" size="sm" onClick={() => setIsAddingDeliverable(true)} iconLeading={Plus}>Add deliverable</Button>
            }
            {/*<Button color="secondary" size="sm" type="button" onClick={addDeliverable} iconLeading={PlusCircle}>Add deliverable</Button>*/}
        </div>
        <Button color="primary" size="sm" onClick={() => onSubmitForm()}>{defaultValue ? 'Update assignment' : 'Create new assignment'}</Button>
    </>;
}