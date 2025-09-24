import {PlusIcon} from "@heroicons/react/16/solid";

export default function RubricCard({
                                       isPlaceholder = false,
                                       addCard,
                                       isEditing = false,
                                       category,
                                       points,
                                       criteria,
                                       onSave
                                   }) {

    const onSaveCard = () => {
        if (onSave) {
            onSave({
                category,
                points,
            })
        }
    }

    return <div className="bg-rose-50 p-4 rounded-lg min-h-[200px] min-w-[150px] flex flex-col h-full">
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
        <PlusIcon className="size-6" onClick={addCard}/>
    </div>;
}

function RubricCardDisplay({category, points, criteria}) {
    return <>
        <div className="flex gap-5 justify-between align-middle mb-4">
            <h2 className="font-bold">{category}</h2>
            <p className="font-bold">{points} points</p>
        </div>
        <div>
            <ul className="list-disc pl-5">
                {criteria.map((c, index) => <li key={index}>{c}</li>)}
            </ul>
        </div>
    </>;
}

function RubricCardEdit({category, points, criteria, setCategory, setPoints, setCriteria}) {
    return <>
        <div className="flex gap-5 justify-between align-middle mb-4">
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