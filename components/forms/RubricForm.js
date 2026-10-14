'use client'

import {Button} from "@/components/base/buttons/button";
import {Input} from "@/components/base/input/input";
import {TextArea} from "@/components/base/textarea/textarea";
import {MagicWand02, Plus, PlusCircle, Trash01} from "@untitledui/icons";
import {useEffect, useRef, useState} from "react";
import RubricCards from "@/components/RubricCards";
import {Toggle} from "@/components/base/toggle/toggle";

export default function RubricForm({ onSubmit, assignment }) {
    const formRef = useRef(null);
    const [isAddingRubric, setIsAddingRubric] = useState(false);
    const [data, setData] = useState(assignment?.rubric);
    const [scoringBands, setScoringBands] = useState([{ min: '', max: '', description: '' }]);
    const [isGeneratingBands, setIsGeneratingBands] = useState(false);
    const [useScoringBands, setUseScoringBands] = useState(false);
    const [formValues, setFormValues] = useState({ categoryName: '', maxPoints: '', criteria: '' });
    const [bandError, setBandError] = useState('');

    const canAutogenerate = formValues.categoryName.trim() && formValues.maxPoints && formValues.criteria.trim();

    useEffect(() => {
        setData(assignment?.rubric);
    }, [assignment])

    const validateBands = (bands, maxPoints) => {
        if (!useScoringBands) return '';
        const filled = bands.filter(b => b.description.trim());
        if (filled.length === 0) return 'Add at least one scoring band.';
        for (const b of filled) {
            if (b.min === '' || b.max === '') return 'All bands must have min and max values.';
            if (parseFloat(b.min) > parseFloat(b.max)) return `Band "${b.description}" has min greater than max.`;
        }
        const sorted = [...filled].sort((a, b) => parseFloat(b.max) - parseFloat(a.max));
        if (parseFloat(sorted[0].max) !== maxPoints) return `Bands must cover up to ${maxPoints} points.`;
        if (parseFloat(sorted[sorted.length - 1].min) !== 0) return 'Bands must start from 0.';
        for (let i = 0; i < sorted.length - 1; i++) {
            if (parseFloat(sorted[i].min) !== parseFloat(sorted[i + 1].max) + 1) return 'Bands must be contiguous with no gaps or overlaps.';
        }
        return '';
    };

    const onAddCategory = (e) => {
        e.preventDefault();
        const maxPoints = parseFloat(formRef.current.elements.maxPoints.value);
        const error = validateBands(scoringBands, maxPoints);
        if (error) { setBandError(error); return; }
        setBandError('');
        const newCategory = {
            categoryName: formRef.current.elements.categoryName.value,
            maxPoints,
            criteria: formRef.current.elements.criteria.value,
            scoringBands: useScoringBands ? scoringBands.filter(b => b.description.trim()) : [],
        };
        const updated = [...data, newCategory];
        setData(updated);
        setIsAddingRubric(false);
        setScoringBands([{ min: '', max: '', description: '' }]);
        setFormValues({ categoryName: '', maxPoints: '', criteria: '' });
        setUseScoringBands(false);
        formRef.current.reset();
        onSubmit(updated);
    }

    const onDeleteCategory = (categoryName) => {
        const updated = data.filter(r => r.categoryName !== categoryName);
        setData(updated);
        onSubmit(updated);
    }

    const onEditCategory = (originalName, updatedFields) => {
        const updated = data.map(r => r.categoryName === originalName ? { ...r, ...updatedFields } : r);
        setData(updated);
        onSubmit(updated);
    }

    const updateBand = (index, field, value) => {
        setScoringBands(prev => prev.map((b, i) => i === index ? { ...b, [field]: value } : b));
    }

    const autogenerateBands = async () => {
        const categoryName = formRef.current.elements.categoryName.value;
        const maxPoints = formRef.current.elements.maxPoints.value;
        const criteria = formRef.current.elements.criteria.value;
        if (!categoryName || !maxPoints || !criteria) return;

        setIsGeneratingBands(true);
        try {
            const res = await fetch('/api/scoring-bands', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoryName, maxPoints: parseFloat(maxPoints), criteria }),
            });
            const data = await res.json();
            if (data.bands) setScoringBands(data.bands);
        } catch (err) {
            console.error('Failed to generate scoring bands:', err);
        } finally {
            setIsGeneratingBands(false);
        }
    };

    const addBand = () => {
        setScoringBands(prev => [...prev, { min: '', max: '', description: '' }]);
    }

    const removeBand = (index) => {
        setScoringBands(prev => prev.filter((_, i) => i !== index));
    }

    return <>
        <div>
            <RubricCards
                rubric={data}
                isEditable={true}
                onDelete={onDeleteCategory}
                onEdit={onEditCategory}
            />
            {isAddingRubric ?
                <div className="w-full border border-gray-300 rounded-lg mt-4">
                    <form className="rounded-md p-4" ref={formRef}>
                        <h2 className="text-xl font-bold mb-4">Add a new rubric category</h2>
                        <div className="grid gap-2 mb-4">
                            <Input isRequired label="Category Name" placeholder="Category Name" tooltip="The name of the category." name="categoryName" type="text" onChange={(v) => setFormValues(p => ({ ...p, categoryName: v }))} />
                            <Input isRequired label="Max Points" placeholder="Max Points" tooltip="The maximum points for this category." name="maxPoints" type="number" onChange={(v) => setFormValues(p => ({ ...p, maxPoints: v }))} />
                            <TextArea isRequired placeholder="A description of the category criteria (in bullet points)." label="Description" rows={5} name="criteria" onChange={(v) => setFormValues(p => ({ ...p, criteria: v }))} />
                        </div>

                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <Toggle label="Use scoring bands" size="sm" checked={useScoringBands} onChange={e => setUseScoringBands(e)} />
                                </label>
                                {useScoringBands && (
                                    <Button
                                        type="button"
                                        color="secondary"
                                        size="sm"
                                        iconLeading={MagicWand02}
                                        onClick={autogenerateBands}
                                        isLoading={isGeneratingBands}
                                        isDisabled={!canAutogenerate}
                                    >Autogenerate</Button>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                {useScoringBands && scoringBands.map((band, index) => (
                                    <div key={index} className="flex gap-2 items-start">
                                        <Input
                                            label="Min"
                                            placeholder="0"
                                            type="number"
                                            value={band.min}
                                            onChange={(v) => updateBand(index, 'min', v)}
                                            className="w-20 shrink-0"
                                        />
                                        <Input
                                            label="Max"
                                            placeholder="10"
                                            type="number"
                                            value={band.max}
                                            onChange={(v) => updateBand(index, 'max', v)}
                                            className="w-20 shrink-0"
                                        />
                                        <Input
                                            label="Description"
                                            placeholder="What the student achieved at this level"
                                            type="text"
                                            value={band.description}
                                            onChange={(v) => updateBand(index, 'description', v)}
                                            className="flex-1"
                                        />
                                        {scoringBands.length > 1 && (
                                            <Button
                                                type="button"
                                                color="tertiary"
                                                size="sm"
                                                iconLeading={Trash01}
                                                onClick={() => removeBand(index)}
                                                className="mt-6 shrink-0"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                            {useScoringBands && (
                                <Button
                                    type="button"
                                    color="secondary"
                                    size="sm"
                                    iconLeading={Plus}
                                    onClick={addBand}
                                    className="mt-2"
                                >Add band</Button>
                            )}
                        </div>

                        {bandError && <p className="text-red-600 text-sm mb-2">{bandError}</p>}
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
