'use client';

import {useState} from "react";
import {ChevronDown, ChevronUp, Pencil01, Save01, Trash01} from "@untitledui/icons";
import {Badge} from "@/components/base/badges/badges";

export default function RubricCard({ categoryName, points, criteria, scoringBands, color, isEditable, onDelete, onEdit }) {
    return <div className={`${color} p-4 rounded-2xl min-w-[150px] flex flex-col`}>
        <RubricCardDisplay
            categoryName={categoryName}
            points={points}
            criteria={criteria}
            scoringBands={scoringBands}
            isEditable={isEditable}
            onDelete={onDelete}
            onEdit={onEdit}
        />
    </div>;
}

function RubricCardDisplay({categoryName, points, criteria, scoringBands, isEditable, onDelete, onEdit}) {
    const [bandsOpen, setBandsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editValues, setEditValues] = useState({ categoryName, points, criteria, scoringBands: scoringBands ?? [] });

    const formatCriteria = (text) => text.split('\n').map((c, i) => <p key={i}>{c}</p>);

    const handleSave = () => {
        onEdit?.(categoryName, {
            categoryName: editValues.categoryName,
            maxPoints: parseFloat(editValues.points),
            criteria: editValues.criteria,
            scoringBands: editValues.scoringBands,
        });
        setIsEditing(false);
    };

    const updateBand = (index, field, value) => {
        setEditValues(prev => ({
            ...prev,
            scoringBands: prev.scoringBands.map((b, i) => i === index ? { ...b, [field]: value } : b),
        }));
    };

    const removeBand = (index) => {
        setEditValues(prev => ({ ...prev, scoringBands: prev.scoringBands.filter((_, i) => i !== index) }));
    };

    const addBand = () => {
        setEditValues(prev => ({ ...prev, scoringBands: [...prev.scoringBands, { min: '', max: '', description: '' }] }));
    };

    if (isEditing) {
        return <>
            <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col gap-1 flex-1 mr-2">
                    <input
                        className="font-bold bg-white/60 rounded px-1 w-full text-sm"
                        value={editValues.categoryName}
                        onChange={e => setEditValues(v => ({ ...v, categoryName: e.target.value }))}
                        placeholder="Category name"
                    />
                    <input
                        className="font-bold opacity-50 bg-white/60 rounded px-1 w-24 text-sm"
                        value={editValues.points}
                        onChange={e => setEditValues(v => ({ ...v, points: e.target.value }))}
                        type="number"
                        placeholder="Points"
                    />
                </div>
                <div className="flex gap-1">
                    <Save01
                        size={18}
                        className="cursor-pointer opacity-70 hover:opacity-100 mt-[3px] shrink-0"
                        onClick={handleSave}
                    />
                    <Trash01
                        size={18}
                        className="cursor-pointer opacity-50 hover:opacity-100 mt-[3px] shrink-0"
                        onClick={onDelete}
                    />
                </div>
            </div>

            <textarea
                className="bg-white/60 rounded px-1 w-full text-sm resize-none mb-3"
                rows={5}
                value={editValues.criteria}
                onChange={e => setEditValues(v => ({ ...v, criteria: e.target.value }))}
                placeholder="Criteria"
            />

            <div className="border-t border-current opacity-60 pt-2">
                <p className="text-xs font-semibold mb-2">Scoring bands</p>
                <div className="flex flex-col gap-1 mb-2">
                    {editValues.scoringBands.map((band, i) => (
                        <div key={i} className="flex gap-1 items-center">
                            <input
                                className="bg-white/60 rounded px-1 text-xs w-12 shrink-0"
                                type="number"
                                value={band.min}
                                onChange={e => updateBand(i, 'min', e.target.value)}
                                placeholder="Min"
                            />
                            <span className="text-xs">–</span>
                            <input
                                className="bg-white/60 rounded px-1 text-xs w-12 shrink-0"
                                type="number"
                                value={band.max}
                                onChange={e => updateBand(i, 'max', e.target.value)}
                                placeholder="Max"
                            />
                            <input
                                className="bg-white/60 rounded px-1 text-xs flex-1"
                                value={band.description}
                                onChange={e => updateBand(i, 'description', e.target.value)}
                                placeholder="Description"
                            />
                            <Trash01
                                size={12}
                                className="cursor-pointer opacity-50 hover:opacity-100 shrink-0"
                                onClick={() => removeBand(i)}
                            />
                        </div>
                    ))}
                </div>
                <button type="button" className="text-xs font-semibold cursor-pointer opacity-70 hover:opacity-100" onClick={addBand}>+ Add band</button>
            </div>
        </>;
    }

    return <>
        <div className="flex justify-between">
            <div className="mb-4">
                <h2 className="font-bold">{categoryName}</h2>
                <p className="font-bold opacity-50 text-sm">{points} points</p>
            </div>
            {isEditable && (
                <div className="flex gap-1">
                    <Pencil01
                        size={18}
                        className="cursor-pointer opacity-50 hover:opacity-100 mt-[3px] shrink-0"
                        onClick={() => {
                            setEditValues({ categoryName, points, criteria, scoringBands: scoringBands ?? [] });
                            setIsEditing(true);
                        }}
                    />
                    <Trash01
                        size={18}
                        className="cursor-pointer opacity-50 hover:opacity-100 mt-[3px] shrink-0"
                        onClick={onDelete}
                    />
                </div>
            )}
        </div>

        <div className="flex flex-col gap-2">
            {formatCriteria(criteria)}
        </div>

        {scoringBands?.length > 0 && (
            <div className="mt-4 border-t border-current opacity-60 pt-2">
                <button
                    type="button"
                    className="flex items-center gap-1 text-xs font-semibold cursor-pointer w-full"
                    onClick={() => setBandsOpen(o => !o)}
                >
                    Scoring bands
                    {bandsOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                {bandsOpen && (
                    <div className="mt-2 grid grid-cols-[auto_2fr] gap-2 items-center">
                        {scoringBands.map((band, i) => (
                            <span key={i} className="contents">
                                <Badge size="sm" type="color" color="brand">{band.min}–{band.max} pts</Badge>
                                <span className="text-xs">{band.description}</span>
                            </span>
                        ))}
                    </div>
                )}
            </div>
        )}
    </>;
}
