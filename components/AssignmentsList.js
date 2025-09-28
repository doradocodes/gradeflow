'use client'

import {Tab, TabGroup, TabList, TabPanel, TabPanels} from "@headlessui/react";
import {useAuth} from "@/components/AuthProvider";
import {useEffect, useState} from "react";
import {getAssignments} from "@/utils/firestore";
import RubricForm from "@/components/RubricForm";
import DeliverablesForm from "@/components/DeliverablesForm";
import Link from "next/link";
import Button from "@/components/Button";
import {ArrowRightIcon} from "@heroicons/react/16/solid";
import SubmissionsTable from "@/components/SubmissionsTable";
import RubricCards from "@/components/RubricCards";
import Tag from "@/components/Tag";

const CATEGORIES = [
    {
        name: 'Rubric',
        getComponent: (data) => {
            return <TabPanel key="Rubric" className="p-3">
                <RubricCards assignment={data} />

            </TabPanel>
        }
    },
    {
        name: 'Deliverables',
        getComponent: (data) => {
            return <TabPanel key="Deliverables" className="p-3 grid grid-cols-2 gap-4">
                <ul className="mb-4">
                    <h2 className="font-bold text-xl">Deliverables</h2>
                    {data.deliverables?.map((deliverable) => (
                        <li key={deliverable.name} className="list-decimal list-inside">
                            {deliverable.name} ({deliverable.fileType}) <Tag color="blue">{deliverable.required ? 'Required' : 'Optional'}</Tag>
                        </li>
                    ))}
                </ul>
                <DeliverablesForm assignmentId={data.id} prevData={data} />
            </TabPanel>
        }
    },
    {
        name: 'Submissions',
        getComponent: (data) => {
            return <TabPanel key="Submissions" className="p-3">
                <SubmissionsTable assignmentId={data.id} />
            </TabPanel>
        },
    }
]

export default function AssignmentsList() {
    const { user, loading } = useAuth();
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        async function load() {
            const data = await getAssignments(user.uid);
            setAssignments(data);
        }
        load();
    }, []);

    return <>
        <ul className="my-4">
            {assignments.map(a => (
                <li key={a.id} className="rounded-lg overflow-hidden bg-slate-200 p-4 relative">
                    <h2 className="font-bold inline-block">{a.courseName} - {a.title}</h2> <Tag color="blue">Due {a.dueDate}</Tag>
                    <p className="my-2">{a.description}</p>
                    <Button className="mb-4"><Link href={`/submit/${a.id}`}>Submission Link</Link></Button>
                    <TabGroup>
                        <TabList className="flex gap-4">
                            {CATEGORIES.map(({ name }) => (
                                <Tab
                                    key={name}
                                    className="rounded-full px-3 py-1 text-sm/6 font-semibold focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-black/5 data-selected:bg-black data-selected:text-white data-selected:data-hover:bg-black/10"
                                >
                                    {name}
                                </Tab>
                            ))}
                        </TabList>
                        <TabPanels className="mt-3">
                            {CATEGORIES.map(({ name, getComponent }) => getComponent(a))}
                        </TabPanels>
                    </TabGroup>
                </li>
            ))}
        </ul>
    </>
}