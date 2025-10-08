export default function RubricCard({
                                       category,
                                       points,
                                       criteria,
                                       color
                                   }) {
    return <div className={`${color} p-4 rounded-2xl min-h-[200px] min-w-[150px] flex flex-col h-full`}>
        <RubricCardDisplay category={category} points={points} criteria={criteria}/>
    </div>;
}

function RubricCardDisplay({category, points, criteria}) {
    const formatCriteria = (criteria) => {
        const criteriaArr = criteria.split('\n');
        return criteriaArr.map((c, index) => <p key={index}>{c}</p>)
    }

    return <>
        <div className="mb-4">
            <h2 className="font-bold">{category}</h2>
            <p className="font-bold opacity-50 text-sm">{points} points</p>
        </div>
        <div className="flex flex-col gap-2">
            {formatCriteria(criteria)}
        </div>
    </>;
}