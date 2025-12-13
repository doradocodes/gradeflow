import {Trash01} from "@untitledui/icons";
import {deleteRubric} from "@/utils/firestore";

export default function RubricCard({ categoryName, points, criteria, color, isEditable, onDelete }) {
    return <div className={`${color} p-4 rounded-2xl min-h-[200px] min-w-[150px] flex flex-col h-full`}>
        <RubricCardDisplay
            categoryName={categoryName}
            points={points}
            criteria={criteria}
            isEditable={isEditable}
            onDelete={onDelete}
        />
    </div>;
}

function RubricCardDisplay({categoryName, points, criteria, isEditable, onDelete}) {
    const formatCriteria = (criteria) => {
        const criteriaArr = criteria.split('\n');
        return criteriaArr.map((c, index) => <p key={index}>{c}</p>)
    }

    return <>
        <div className="flex justify-between ">
            <div className="mb-4">
                <h2 className="font-bold">{categoryName}</h2>
                <p className="font-bold opacity-50 text-sm">{points} points</p>
            </div>
            {isEditable &&
                <Trash01
                    size={18}
                    className="cursor-pointer opacity-50 hover:opacity-100 mt-[3px]"
                    onClick={onDelete}
                />
            }
        </div>

        <div className="flex flex-col gap-2">
            {formatCriteria(criteria)}
        </div>
    </>;
}