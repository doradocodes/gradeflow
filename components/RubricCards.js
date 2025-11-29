import RubricCard from "@/components/RubricCard";
import clsx from "clsx";

const COLORS = [
    'bg-emerald-100 text-emerald-800',
    'bg-fuchsia-100 text-fuchsia-800',
    'bg-orange-100 text-orange-800',
    'bg-sky-100 text-sky-800',
];

export default function RubricCards({ rubric = [] }) {
    return <>
        <div className={clsx(
            "grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))] overflow-y-auto",
        )}>
            {rubric?.map((r, index) =>
                <RubricCard
                    key={index}
                    category={r.categoryName}
                    points={r.maxPoints}
                    criteria={r.criteria}
                    color={COLORS[index % COLORS.length]}
                ></RubricCard>)
            }
        </div>
    </>
}