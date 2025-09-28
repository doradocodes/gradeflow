import RubricCard from "@/components/RubricCard";
import {useEffect, useState} from "react";
import RubricForm from "@/components/RubricForm";

export default function RubricCards({ assignment }) {
    const [cards, setCards] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    if (!assignment) return <></>

    return <>
        <div className="flex justify-between items-center w-full">

            {/*{ !isEditing ?*/}
            {/*    <PencilIcon className="size-6 float-right" onClick={() => {*/}
            {/*        setIsEditing(true);*/}
            {/*    }} />*/}
            {/*    :*/}
            {/*    <Button className="text-xs" onClick={() => setIsEditing(false)}>Save</Button>*/}
            {/*}*/}
        </div>
        <div className="grid grid-cols-2 gap-4">
            {Object.keys(assignment?.rubric).map((r, index) =>
                <RubricCard
                    key={index}
                    category={r}
                    points={assignment.rubric[r].maxPoints}
                    criteria={assignment.rubric[r].criteria}
                ></RubricCard>)
            }
            <div className="bg-white p-4 rounded-lg min-h-[200px] min-w-[150px] flex flex-col h-full">
                <RubricForm assignmentId={assignment?.id} prevData={assignment} />
            </div>
        </div>
    </>
}