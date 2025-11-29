'use client'

import {Button} from "@/components/base/buttons/button";
import {Input} from "@/components/base/input/input";
import {TextArea} from "@/components/base/textarea/textarea";
import {PlusCircle} from "@untitledui/icons";
import {useRef, useState} from "react";

export default function RubricForm({ onSubmit }) {
    const formRef = useRef(null);

    const onSubmitForm = async (e) => {
        e.preventDefault();
        const data = {
            categoryName: formRef.current.elements.categoryName.value,
            maxPoints: parseFloat(formRef.current.elements.maxPoints.value),
            criteria: formRef.current.elements.criteria.value,
        };
        await onSubmit(data);
    }

    return <form className="rounded-md p-4" ref={formRef}>
        <h2 className="text-xl font-bold mb-4">Add a new rubric category</h2>
        <div className="grid gap-2 mb-4">
            <Input isRequired label="Category Name" placeholder="Category Name" tooltip="The name of the category." name="categoryName" type="text" />
            <Input isRequired label="Max Points" placeholder="Max Points" tooltip="The maximum points for this category." name="maxPoints" type="number"/>
            <TextArea isRequired placeholder="A description of the category criteria (in bullet points)." label="Description" rows={5} name="criteria" />
        </div>
        <Button iconLeading={PlusCircle} onClick={onSubmitForm}>Create category</Button>
    </form>
}