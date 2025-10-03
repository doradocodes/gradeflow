import RubricCard from "@/components/RubricCard";
import {useEffect, useState} from "react";
import RubricForm from "@/components/RubricForm";

const COLORS = [
    'bg-emerald-100 text-emerald-800',
    'bg-fuchsia-100 text-fuchsia-800',
    'bg-orange-100 text-orange-800',
    'bg-sky-100 text-sky-800',
];

export default function RubricCards({ assignment }) {
    const [cards, setCards] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    if (!assignment) return <></>

    return <>
        <div className="grid grid-cols-2 gap-4">
            {Object.keys(assignment?.rubric).map((r, index) =>
                <RubricCard
                    key={index}
                    category={r}
                    points={assignment.rubric[r].maxPoints}
                    criteria={assignment.rubric[r].criteria}
                    color={COLORS[index % COLORS.length]}
                ></RubricCard>)
            }
        </div>
    </>
}