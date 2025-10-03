export default function RubricCard({
                                       isPlaceholder = false,
                                       addCard,
                                       isEditing = false,
                                       category,
                                       points,
                                       criteria,
                                       onSave,
                                       color
                                   }) {

    const onSaveCard = () => {
        if (onSave) {
            onSave({
                category,
                points,
            })
        }
    }

    return <div className={`${color} p-4 rounded-2xl min-h-[200px] min-w-[150px] flex flex-col h-full`}>
        {isPlaceholder && <RubricCardPlaceholder addCard={addCard}/>}
        {!isPlaceholder && !isEditing && <RubricCardDisplay category={category} points={points} criteria={criteria}/>}
        {!isPlaceholder && isEditing &&
            <RubricCardEdit
                category={category}
                points={points}
                criteria={criteria}
                setCategory={setCategory}
                setPoints={setPoints}
                setCriteria={setCriteria}
            />}
    </div>;
}

function RubricCardPlaceholder({addCard}) {
    return <div className="flex justify-center items-center h-full">
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
        <div>
            <p>{formatCriteria(criteria)}</p>
        </div>
    </>;
}

function RubricCardEdit({category, points, criteria, setCategory, setPoints, setCriteria}) {
    return <>
        <div className="mb-4">
            <input type="text" className="border border-gray-300 rounded-lg p-2" placeholder="Category"
                   defaultValue={category || ''} onChange={(e) => setCategory(e.target.value)}/>
            <div>
                <input type="number" className="border border-gray-300 rounded-lg p-2 w-15" placeholder="Points"
                       defaultValue={points || 0} onChange={e => setPoints(e.target.value)}/> points
            </div>
        </div>
        <div>
            <ul className="list-disc pl-5">
                {criteria.map((c, index) => <li key={index}>
                    <input type="text" placeholder={"Criteria " + (index + 1)}
                           className="border border-gray-300 rounded-lg p-2" defaultValue={c}/>
                </li>)}
                {criteria.length < 1 && <>
                    <li>
                        <input type="text" placeholder={"Criteria 1"}
                               className="border border-gray-300 rounded-lg p-2"/>
                    </li>
                    <li>
                        <input type="text" placeholder={"Criteria 2"}
                               className="border border-gray-300 rounded-lg p-2"/>
                    </li>
                    <li>
                        <input type="text" placeholder={"Criteria 3"}
                               className="border border-gray-300 rounded-lg p-2"/>
                    </li>
                </>}
            </ul>
        </div>
    </>
}