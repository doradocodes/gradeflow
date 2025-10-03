'use client'

import {useAuth} from "@/components/AuthProvider";
import {useEffect, useMemo, useState} from "react";
import {getAssignments} from "@/utils/firestore";
import {Copy01, Edit01, Trash01} from "@untitledui/icons";
import {PaginationPageMinimalCenter} from "@/components/application/pagination/pagination";
import {Table, TableCard, TableRowActionsDropdown} from "@/components/application/table/table";
import {ButtonUtility} from "@/components/base/buttons/button-utility";
import {Button} from "@/components/base/buttons/button";
import Link from "next/link";
import SlideoutMenu from "@/components/SlideoutMenu";
import SubmissionsTable from "@/components/SubmissionsTable";
import {Badge} from "@/components/base/badges/badges";
import RubricCards from "@/components/RubricCards";
import RubricForm from "@/components/RubricForm";

export default function AssignmentsList({title, date, direction}) {
    const {user, loading} = useAuth();
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        async function load() {
            const data = await getAssignments(user.uid, {
                date: date,
                direction: direction,
            });
            setAssignments(data);
        }

        load();
    }, [title, date, direction]);

    return <>
        <AssignmentsTable title={title} assignments={assignments}/>
    </>
}

function AssignmentsTable({title, assignments}) {
    const [openSubmissions, setOpenSubmissions] = useState(false);
    const [openRubric, setOpenRubric] = useState(false);
    const [currentAssignment, setCurrentAssignment] = useState(null);

    const [sortDescriptor, setSortDescriptor] = useState({
        column: "status",
        direction: "ascending",
    });

    const sortedItems = useMemo(() => {
        return assignments.sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];

            // Compare numbers or booleans
            if ((typeof first === "number" && typeof second === "number") || (typeof first === "boolean" && typeof second === "boolean")) {
                return sortDescriptor.direction === "descending" ? second - first : first - second;
            }

            // Compare strings
            if (typeof first === "string" && typeof second === "string") {
                let cmp = first.localeCompare(second);
                if (sortDescriptor.direction === "descending") {
                    cmp *= -1;
                }
                return cmp;
            }

            return 0;
        });
    }, [sortDescriptor]);

    return (<>
        <TableCard.Root className="mb-8">
            <TableCard.Header
                title={title}
                contentTrailing={
                    <div className="absolute top-5 right-4 md:right-6">
                        <TableRowActionsDropdown/>
                    </div>
                }
            />
            <Table aria-label="Assignments" sortDescriptor={sortDescriptor}
                   onSortChange={setSortDescriptor}>
                <Table.Header>
                    <Table.Head id="courseName" label="Course name" isRowHeader allowsSorting/>
                    <Table.Head id="title" label="Title" allowsSorting/>
                    <Table.Head id="description" label="Description" allowsSorting tooltip="This is a tooltip"/>
                    <Table.Head id="dueDate" label="Due date" allowsSorting/>
                    <Table.Head id="submissionLink" label="Submission Link"/>
                    <Table.Head id="submissions" label="Submissions"/>
                    <Table.Head id="rubric" label="Rubric"/>
                    <Table.Head id="deliverables" label="Deliverables"/>
                    <Table.Head id="actions"/>
                </Table.Header>

                <Table.Body items={assignments}>
                    {(item) => (
                        <Table.Row id={item.id}>
                            <Table.Cell>{item.courseName}</Table.Cell>
                            <Table.Cell>{item.title}</Table.Cell>
                            <Table.Cell>{item.description}</Table.Cell>
                            <Table.Cell>{new Date(item.dueDate).toLocaleString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                            })}</Table.Cell>
                            <Table.Cell>
                                <Link href={`/submit/${item.id}`}>
                                    <Button color="secondary" size="sm" className="" iconTrailing={<Copy01 size={12}/>}>
                                        Submission Link
                                    </Button>
                                </Link>
                            </Table.Cell>
                            <Table.Cell>
                                <Button
                                    color="primary"
                                    size="sm" className=""
                                    onClick={() => {
                                        setOpenSubmissions(true)
                                        setCurrentAssignment(item)
                                    }}
                                >See submissions</Button>
                            </Table.Cell>
                            <Table.Cell>
                                <Button
                                    color="primary"
                                    size="sm" className=""
                                    onClick={() => {
                                        setOpenRubric(true)
                                        setCurrentAssignment(item)
                                    }}
                                >See rubric</Button>
                            </Table.Cell>
                            <Table.Cell className="whitespace-nowrap">
                                <ul className="list-decimal">
                                    {item.deliverables?.map((deliverable) => (
                                        <li key={deliverable.name} className=" list-inside flex gap-2">
                                            <span className="inline-block">{deliverable.name}</span> <Badge type="color"
                                                                                                            color="brand"
                                                                                                            size="sm">{deliverable.fileType}</Badge>
                                        </li>
                                    ))}
                                </ul>
                            </Table.Cell>
                            <Table.Cell className="px-4">
                                <div className="flex justify-end gap-0.5">
                                    <ButtonUtility size="xs" color="tertiary" tooltip="Delete" icon={Trash01}/>
                                    <ButtonUtility size="xs" color="tertiary" tooltip="Edit" icon={Edit01}/>
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>

            <PaginationPageMinimalCenter page={1} total={10} className="px-4 py-3 md:px-6 md:pt-3 md:pb-4"/>
        </TableCard.Root>
        {currentAssignment && <>
            <SlideoutMenu
                open={openSubmissions}
                onClose={() => setOpenSubmissions(false)}
                title={`${currentAssignment.title} Submissions`}
                description="View and grade submissions for this assignment."
            >
                <SubmissionsTable
                    assignmentId={currentAssignment.id}
                />
            </SlideoutMenu>
            <SlideoutMenu
                open={openRubric}
                onClose={() => setOpenRubric(false)}
                title={`${currentAssignment.title} Rubric`}
                description="Grading rubric for this assignment."
            >
                <RubricCards assignment={currentAssignment}/>
                <div className="divider w-full border-b border-gray-200"></div>
                <RubricForm assignmentId={currentAssignment?.id} prevData={currentAssignment}/>
            </SlideoutMenu>
        </>}
    </>);
}