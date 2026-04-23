'use client'

import {Button} from "@/components/base/buttons/button";
import {Input} from "@/components/base/input/input";
import {TextArea} from "@/components/base/textarea/textarea";
import {Plus, PlusCircle} from "@untitledui/icons";
import {useEffect, useRef, useState} from "react";
import RubricCards from "@/components/RubricCards";

export default function RubricForm({ onSubmit, assignment }) {
    const formRef = useRef(null);
    const [isAddingRubric, setIsAddingRubric] = useState(false);
    const [data, setData] = useState(assignment?.rubric);

    useEffect(() => {
        setData(assignment?.rubric);
    }, [assignment])

    const onAddCategory = (e) => {
        e.preventDefault();
        const newCategory = {
            categoryName: formRef.current.elements.categoryName.value,
            maxPoints: parseFloat(formRef.current.elements.maxPoints.value),
            criteria: formRef.current.elements.criteria.value,
        };
        const updated = [...data, newCategory];
        setData(updated);
        setIsAddingRubric(false);
        formRef.current.reset();
        onSubmit(updated);
    }

    const onDeleteCategory = (categoryName) => {
        const updated = data.filter(r => r.categoryName !== categoryName);
        setData(updated);
        onSubmit(updated);
    }

    return <>
        <div>
            <RubricCards
                // assignment={assignment}
                rubric={data}
                isEditable={true}
                onDelete={onDeleteCategory}
            />
            {isAddingRubric ?
                <div className="w-full border border-gray-300 rounded-lg mt-4">
                    <form className="rounded-md p-4" ref={formRef}>
                        <h2 className="text-xl font-bold mb-4">Add a new rubric category</h2>
                        <div className="grid gap-2 mb-4">
                            <Input isRequired label="Category Name" placeholder="Category Name" tooltip="The name of the category." name="categoryName" type="text" />
                            <Input isRequired label="Max Points" placeholder="Max Points" tooltip="The maximum points for this category." name="maxPoints" type="number"/>
                            <TextArea isRequired placeholder="A description of the category criteria (in bullet points)." label="Description" rows={5} name="criteria" />
                        </div>
                        <Button iconLeading={PlusCircle} onClick={onAddCategory}>Save category</Button>
                    </form>
                </div>
                :
                <Button className="mt-4" color="secondary" size="sm" onClick={() => setIsAddingRubric(true)}
                        iconLeading={Plus}>Add category</Button>
            }
        </div>
    </>
}