'use client'

import ProtectedRoute from "@/components/ProtectedRoute";
import AssignmentsForm from "@/components/AssignmentsForm";
import {useEffect, useState} from "react";
import {getAssignments} from "@/utils/firestore";
import Button from "@/components/Button";
import Link from "next/link";
import {ArrowRightIcon} from "@heroicons/react/16/solid";
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from "@headlessui/react";
import RubricForm from "@/components/RubricForm";
import DeliverablesForm from "@/components/DeliverablesForm";

const CATEGORIES = [
    {
        name: 'Rubric',
        getComponent: (data) => {
            return <TabPanel key={name} className="p-3">
                <ul>
                    {Object.keys(data.rubric)?.map((rubricKey) => (
                        <li key={rubricKey} className="p-2 border rounded">
                            <h3>{rubricKey}</h3>
                            <p>{data.rubric[rubricKey].maxPoints} points</p>
                            <p>{data.rubric[rubricKey].criteria}</p>
                        </li>
                    ))}
                </ul>
                <RubricForm assignmentId={data.id} prevData={data} />
            </TabPanel>
        }
    },
    {
        name: 'Deliverables',
        getComponent: (data) => {
            return <TabPanel key={name} className="p-3">
                <ul>
                    {data.deliverables?.map((deliverable) => (
                        <li key={deliverable.name} className="p-2 border rounded">
                            <h3>{deliverable.name}</h3>
                            <p>Type: {deliverable.fileType}</p>
                            <p>{deliverable.required ? 'Required' : 'Optional'}</p>
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
            return <TabPanel key={name} className="p-3">
                <h2 className="text-xl font-bold">Submissions</h2>
                <table className="w-full">
                    <thead>
                    <tr className="border-b border-gray-300">
                        <th className="py-2">Student Name</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Grade</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="py-2">Dora Do</td>
                        <td className="py-2">On Time</td>
                        <td className="py-2">
                            <Link href={`/submissions/1`}>
                                <Button>Grade <ArrowRightIcon className="size-4" /></Button>
                            </Link>

                        </td>
                    </tr>
                    </tbody>
                </table>
            </TabPanel>
        },
    }
]

export default function AssignmentsPage() {
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        async function load() {
            const data = await getAssignments();
            setAssignments(data);
        }
        load();
    }, []);

    return <ProtectedRoute>
        <div className="p-4">
            <h1>Assignments</h1>
            <ul className="my-4">
                {assignments.map(a => (
                    <li key={a.id} className="p-2 border rounded">
                        <h2 className="font-bold">{a.title}</h2>
                        <p>{a.courseName}</p>
                        <p>{a.description}</p>
                        <p>{a.dueDate}</p>
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
            {/*<Button onClick={createAssignment}>Add Assignment</Button>*/}
            <AssignmentsForm />
        </div>
    </ProtectedRoute>
}
