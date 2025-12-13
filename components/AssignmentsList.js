'use client'

import {useAuth} from "@/components/AuthProvider";
import {useEffect, useMemo, useState} from "react";
import {
    createAssignment,
    deleteAssignment,
    getAssignments,
    getSubmissionsByAssignment,
    updateAssignment
} from "@/utils/firestore";
import {Copy01, Edit01, Plus, PlusCircle, Trash01} from "@untitledui/icons";
import {Table, TableCard} from "@/components/application/table/table";
import {ButtonUtility} from "@/components/base/buttons/button-utility";
import {Button} from "@/components/base/buttons/button";
import Link from "next/link";
import SlideoutMenu from "@/components/SlideoutMenu";
import SubmissionsTable from "@/components/SubmissionsTable";
import {Badge} from "@/components/base/badges/badges";
import RubricCards from "@/components/RubricCards";
import RubricForm from "@/components/forms/RubricForm";
import Modal from "@/components/Modal";
import AssignmentsForm from "@/components/forms/AssignmentsForm";
import {LoadingIndicator} from "@/components/application/loading-indicator/loading-indicator";

export default function AssignmentsList({title, filters = {}}) {
    const {user, loading} = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        load();
    }, [title, filters]);

    async function load() {
        const data = await getAssignments(user.uid, filters);
        setAssignments(data);
        setIsLoading(false);
    }

    return <>
        {isLoading ?
            <LoadingIndicator type="line-simple" size="sm" />
            :
            <AssignmentsTable title={title} assignments={assignments} onLoadAssignments={load}/>
        }
    </>
}

function AssignmentsTable({title, assignments, onLoadAssignments}) {
    const [openSubmissions, setOpenSubmissions] = useState(false);
    const [openRubric, setOpenRubric] = useState(false);
    const [openNewAssignmentsForm, setOpenNewAssignmentsForm] = useState(false);
    const [openEditAssignmentsForm, setOpenEditAssignmentsForm] = useState(false);

    const [currentAssignment, setCurrentAssignment] = useState(null);
    const [deleteAssignmentId, setDeleteAssignmentId] = useState(null);

    const [sortDescriptor, setSortDescriptor] = useState({
        column: "status",
        direction: "ascending",
    });

    const onCreateAssignment = async (values) => {
        await createAssignment(values);
        onLoadAssignments();
    }

    const onDeleteAssignment = async (assignmentId) => {
        await deleteAssignment(assignmentId);
        onLoadAssignments();
    }

    const onEditAssignment = async (values) => {
        await updateAssignment(values.id, values)
        onLoadAssignments();
    }

    const onUpdateRubric = async (values) => {
        await onEditAssignment({
            id: currentAssignment.id,
            rubric: values,
        });
        setCurrentAssignment(null);
        setOpenRubric(false);
        onLoadAssignments();
    }

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

    const getSubmissionsCount = async (assignmentId) => {
        const data = await getSubmissionsByAssignment(assignmentId);
        return data.length;
    }

    return (<div className="">
        <div>
            <TableCard.Root className="mb-8">
                <TableCard.Header
                    title={title}
                    contentTrailing={
                        <div className="flex items-center">
                            <Button
                                color="primary" size="sm" iconLeading={<PlusCircle data-icon/>}
                                onClick={() => setOpenNewAssignmentsForm(true)}
                            >
                                Add assignment
                            </Button>
                        </div>
                    }
                />
                <Table aria-label="Assignments" sortDescriptor={sortDescriptor}
                       onSortChange={setSortDescriptor}>
                    <Table.Header>
                        <Table.Head id="courseName" label="Course name" isRowHeader allowsSorting={false}/>
                        <Table.Head id="title" label="Title" allowsSorting={false}/>
                        <Table.Head id="description" label="Description" allowsSorting={false} tooltip="This is a tooltip"/>
                        <Table.Head id="dueDate" label="Due date" allowsSorting={false}/>
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
                                    <Link href={`/submit/${item.id}`} target="_blank" rel="noopener noreferrer">
                                        <Button color="primary" size="sm" className=""
                                                iconTrailing={<Copy01 size={12}/>} onClick={() => {
                                            //copy to clipboard
                                            navigator.clipboard.writeText(`${window.location.origin}/submit/${item.id}`);
                                        }}>
                                            Submission Link
                                        </Button>
                                    </Link>
                                </Table.Cell>
                                <Table.Cell>
                                    <Button
                                        color="secondary"
                                        size="sm" className=""
                                        onClick={() => {
                                            setOpenSubmissions(true)
                                            setCurrentAssignment(item)
                                        }}
                                    >See {getSubmissionsCount(item.id)} submissions</Button>
                                </Table.Cell>
                                <Table.Cell>
                                    <Button
                                        color="secondary"
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
                                                <span className="inline-block">{deliverable.name}</span> <Badge
                                                type="color"
                                                color="brand"
                                                size="sm">{deliverable.type}</Badge>
                                            </li>
                                        ))}
                                    </ul>
                                </Table.Cell>
                                <Table.Cell className="px-4">
                                    <div className="flex justify-end gap-0.5">
                                        <ButtonUtility size="xs" color="tertiary" tooltip="Delete" icon={Trash01}
                                                       onClick={() => setDeleteAssignmentId(item.id)}/>
                                        <ButtonUtility size="xs" color="tertiary" tooltip="Edit" icon={Edit01}
                                                       onClick={() => {
                                                           setOpenEditAssignmentsForm(true)
                                                           setCurrentAssignment(item)
                                                       }}/>
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>

                {/*<PaginationPageMinimalCenter page={1} total={10} className="px-4 py-3 md:px-6 md:pt-3 md:pb-4"/>*/}
            </TableCard.Root>
            <SlideoutMenu
                open={openNewAssignmentsForm}
                onClose={() => setOpenNewAssignmentsForm(false)}
                title={`Create a new assignment`}
                description="Fill in the details to create a new assignment."
            >
                {openNewAssignmentsForm &&
                    <AssignmentsForm
                        onSubmit={onCreateAssignment}
                        onClose={() => setOpenNewAssignmentsForm(false)}/>
                }
            </SlideoutMenu>

            <>
                {/*Edit assignment form*/}
                <SlideoutMenu
                    open={openEditAssignmentsForm}
                    onClose={() => {
                        setCurrentAssignment(null);
                        setOpenEditAssignmentsForm(false)
                    }}
                    title={`Create new assignment`}
                    description="Fill in the details to create a new assignment."
                >
                    { currentAssignment &&
                        <AssignmentsForm
                            defaultValue={currentAssignment}
                            onClose={() => {
                                setCurrentAssignment(null);
                                setOpenEditAssignmentsForm(false)
                            }}
                            onSubmit={(values) => onEditAssignment(values)}
                        />
                    }
                </SlideoutMenu>

                {/*View submissions*/}
                <SlideoutMenu
                    open={openSubmissions}
                    onClose={() => {
                        setCurrentAssignment(null);
                        setOpenSubmissions(false)
                    }}
                    title={`${currentAssignment?.title} Submissions`}
                    description="View and grade submissions for this assignment."
                    isExpanded={true}
                >
                    {currentAssignment &&
                        <SubmissionsTable
                            assignment={currentAssignment}
                        />
                    }
                </SlideoutMenu>

                {/*View rubric*/}
                <SlideoutMenu
                    open={openRubric}
                    onClose={() => {
                        setCurrentAssignment(null);
                        setOpenRubric(false);
                    }}
                    title={`${currentAssignment?.title} Rubric`}
                    description="Grading rubric for this assignment."
                >
                    <RubricForm onSubmit={onUpdateRubric} assignment={currentAssignment} />
                </SlideoutMenu>
            </>

            {/*Warning modal*/}
            <Modal open={deleteAssignmentId} icon={<Trash01 className="w-6 h-6 text-red-500"/>}
                   title={"Delete assignment?"} onClose={() => setDeleteAssignmentId(null)}>
                <div className="h-full flex flex-col gap-4 justify-between">
                    <p>Are you sure you want to delete this post? This action cannot be undone.</p>
                    <div className="flex gap-2">
                        <Button className="w-1/2" color="secondary"
                                onClick={() => setDeleteAssignmentId(null)}>Cancel</Button>
                        <Button className="w-1/2" color="primary-destructive" onClick={() => {
                            setDeleteAssignmentId(null);
                            onDeleteAssignment(deleteAssignmentId);
                        }}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </div>
    </div>);
}