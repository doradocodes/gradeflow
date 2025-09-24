import RubricCard from "@/components/RubricCard";
import {useEffect, useState} from "react";
import {PencilIcon, PlusIcon} from "@heroicons/react/16/solid";
import Button from "@/components/Button";

const getTestRubricCards = () => {
    return [
        {
            category: "Design",
            points: 10,
            criteria: [
                "Design is aesthetically pleasing",
                "Design is intuitive",
                "Design is visually appealing",
                "Design is easy to use",
                "Design is visually appealing",
            ]
        },
        {
            category: "Functionality",
            points: 10,
            criteria: [
                "Functionality is functional",
                "Functionality is intuitive",
                "Functionality is easy to use",
                "Functionality is responsive",
                "Functionality is accessible",
            ]
        }
    ]
}

export default function RubricCards() {
    const [cards, setCards] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setCards(getTestRubricCards());
    }, []);

    const addCard = () => {
        setCards([...cards, {
            category: null,
            points: 0,
            criteria: []
        }]);
    }

    return <>
        <div className="flex justify-between items-center w-full">
            <h3>Grading rubric</h3>
            { !isEditing ?
                <PencilIcon className="size-6 float-right" onClick={() => {
                    setIsEditing(true);
                }} />
                :
                <Button className="text-xs" onClick={() => setIsEditing(false)}>Save</Button>
            }
        </div>
        <div className="grid grid-cols-2 gap-4">
            {cards.map((card, index) =>
                <RubricCard
                    key={index}
                    category={card.category}
                    points={card.points}
                    criteria={card.criteria}
                    isEditing={isEditing}
                    setCards={(card) => {
                        setCards()
                    }}
                ></RubricCard>)
            }
            {isEditing &&
                <RubricCard isPlaceholder={true} addCard={addCard}></RubricCard>
            }
        </div>
    </>
}