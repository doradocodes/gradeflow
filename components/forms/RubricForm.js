'use client'

import {Button} from "@/components/base/buttons/button";
import {Input} from "@/components/base/input/input";
import {TextArea} from "@/components/base/textarea/textarea";
import {PlusCircle} from "@untitledui/icons";
import {useState} from "react";

export default function RubricForm({ onSubmit }) {
    const [categoryName, setCategoryName] = useState(null);
    const [maxPoints, setMaxPoints] = useState(null);
    const [criteria, setCriteria] = useState(null);

    const onSubmitForm = async (e) => {
        e.preventDefault();
        const data = {
            categoryName,
            maxPoints,
            criteria,
        };
        await onSubmit(data);
    }

    return <form onSubmit={onSubmitForm} className="rounded-md p-4">
        <h2 className="text-xl font-bold mb-4">Add a new rubric category</h2>
        <div className="grid gap-2 mb-4">
            <Input isRequired label="Category Name" placeholder="Category Name" tooltip="The name of the category." name="categoryName" type="text" onChange={value => setCategoryName(value)} />
            <Input isRequired label="Max Points" placeholder="Max Points" tooltip="The maximum points for this category." name="maxPoints" type="number" onChange={value => setMaxPoints(value)} />
            <TextArea isRequired placeholder="A description of the category criteria (in bullet points)." label="Description" rows={5} onChange={value => setCriteria(value)} />
        </div>
        <Button type="submit" iconLeading={PlusCircle}>Create category</Button>
    </form>
}