import {
    createAssignment,
    createSubmission,
    deleteSubmission,
    getSubmissionsByAssignment,
    updateSubmission
} from "@/utils/firestore";
import {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import SubmissionForm from "@/components/forms/SubmissionForm";
import {Button} from "@/components/base/buttons/button";
import {Table, TableCard, TableRowActionsDropdown} from "@/components/application/table/table";
import {Badge} from "@/components/base/badges/badges";
import {ButtonUtility} from "@/components/base/buttons/button-utility";
import {ArrowRight, Award01, CheckVerified01, Edit01, Plus, Trash01} from "@untitledui/icons";
import {LoadingIndicator} from "@/components/application/loading-indicator/loading-indicator";
import FeedbackSummary from "@/components/forms/FeedbackSummary";
import SlideoutMenu from "@/components/SlideoutMenu";

export default function SubmissionsTable({ assignment }) {
    const [submissions, setSubmissions] = useState([]);
    const [isAddingSubmission, setIsAddingSubmission] = useState(false);
    const [currentSubmission, setCurrentSubmission] = useState(null);

    useEffect(() => {
        loadSubmissions();
    }, []);

    const loadSubmissions = async () => {
        const data = await getSubmissionsByAssignment(assignment.id);
        setSubmissions(data);
    }

    const onCreateAssignment = async (values) => {
        const data = {
            ...values,
            assignmentId: assignment.id,
            status: values.submittedAt.getTime() < new Date(assignment.dueDate).getTime() ? 'on_time' : 'late',
        };
        // If the submission is being edited, update the existing submission
        if (currentSubmission) {
            await onEditAssignment(currentSubmission.id, data);
        } else {
            await createSubmission(data);
        }
        await loadSubmissions();
        setCurrentSubmission(null);
        setIsAddingSubmission(false);
    }

    const onEditAssignment = async (submissionId, values) => {
        await updateSubmission(submissionId, values);
        await loadSubmissions();
        setIsAddingSubmission(false);
    }

    const onDeleteSubmission = async (submission) => {
        await deleteSubmission(submission.id);
        await loadSubmissions();
    }

    const getStatusTag = (status) => {
        switch (status) {
            case 'on_time':
                return <Badge type="pill-color" color="success" size="sm">On time</Badge>
            case 'late':
                return <Badge type="pill-color" color="error" size="sm">Late</Badge>
            default:
                return <Badge type="pill-color" color="gray" size="sm">Unknown</Badge>
        }
    }

    const getGradedCount = (submissions) => {
        return submissions.filter(submission => submission.feedback).length;
    }

    const [sortDescriptor, setSortDescriptor] = useState({
        column: "studentName",
        direction: "ascending",
    });

    const sortedItems = useMemo(() => {
        return submissions.sort((a, b) => {
            const { column, direction } = sortDescriptor;
            let compareA = a[column];
            let compareB = b[column];

            // Handle undefined or null values
            if (compareA == null) compareA = "";
            if (compareB == null) compareB = "";
            if (compareA < compareB) return direction === "ascending" ? -1 : 1;
            if (compareA > compareB) return direction === "ascending" ? 1 : -1;
            return 0;

        });
    }, [sortDescriptor]);

    if (!submissions) return <div className="flex justify-center items-center h-full">
        <LoadingIndicator type="line-simple" size="sm" />
    </div>

    return <>
        <TableCard.Root className="mb-4">
            <TableCard.Header
                title="Submissions"
                badge={`${submissions.length} submissions / ${getGradedCount(submissions)} graded`}
                contentTrailing={
                    <div className="absolute top-5 right-4 md:right-6">
                        <TableRowActionsDropdown/>
                    </div>
                }
            />
            <Table aria-label="Submissions" className="w-full mb-4" sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor}>
                <Table.Header>
                    <Table.Head id="studentName" label="Student Name" allowsSorting isRowHeader/>
                    <Table.Head id="status" label="Status" allowsSorting/>
                    <Table.Head id="deliverables" label="Deliverables"/>
                    <Table.Head id="grade" label="Grade"/>
                    <Table.Head id="notes" label="Notes"/>
                    <Table.Head id="actions"/>
                </Table.Header>
                <Table.Body items={submissions}>
                    {(item) => (
                        <Table.Row id={item.id}>
                            <Table.Cell>{item.studentName}</Table.Cell>
                            <Table.Cell>{getStatusTag(item.status)}</Table.Cell>
                            <Table.Cell>
                                <ol className="list-decimal list-inside">
                                    {item.deliverables?.map((d) => (
                                        <li key={d.name} className="flex items-center gap-2 flex-nowrap">
                                            <a className="text-blue-500" href={d.value} target="_blank"
                                               rel="noopener noreferrer">{d.name}</a>
                                            <Badge type="color" color="brand" size="sm">{d.type}</Badge>
                                        </li>
                                    ))}
                                </ol>
                            </Table.Cell>
                            <Table.Cell>
                                <GradeCell item={item} />
                            </Table.Cell>
                            <Table.Cell>{item.notes || '-'}</Table.Cell>
                            <Table.Cell className="px-4">
                                <div className="flex justify-end gap-0.5">
                                    <ButtonUtility onClick={() => onDeleteSubmission(item)} size="xs" color="tertiary" tooltip="Delete" icon={Trash01}/>
                                    <ButtonUtility onClick={() => {
                                        setCurrentSubmission(item);
                                        setIsAddingSubmission(true);
                                    }} size="xs" color="tertiary" tooltip="Edit" icon={Edit01} />
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </TableCard.Root>
        <Button color="secondary" size="sm" onClick={() => setIsAddingSubmission(true)} iconLeading={Plus}>Add submission</Button>
        <SlideoutMenu
            open={isAddingSubmission}
            onClose={() => {
                setIsAddingSubmission(false)
                setCurrentSubmission(null)
            }}
            title={currentSubmission ? 'Edit this submission' : 'Create a new submission'}
            description="Fill in the details to create a new submission."
            isExpanded={true}
        >
            { isAddingSubmission &&
                <SubmissionForm
                    assignmentId={assignment.id}
                    isInline={true}
                    deliverables={assignment.deliverables}
                    onSubmit={onCreateAssignment}
                    defaultValues={currentSubmission}
                    isExpanded={true}
                />
            }
        </SlideoutMenu>
    </>
}

function GradeCell({ item }) {
    const [openFeedback, setOpenFeedback] = useState(false);

    const getFinalPoints = (summary) => {
        return summary.reduce((acc, item) => {
            return acc + parseInt(item.estimated_points);
        }, 0)
    }

    return <div className="flex gap-2 items-center">
        {item.feedback && <>
            <SlideoutMenu
                open={openFeedback}
                onClose={() => setOpenFeedback(false)}
                title={`Feedback for ${item.studentName}`}
                isExpanded={true}
            >
                <FeedbackSummary submissionId={item.id} />
            </SlideoutMenu>
            <Button
                color="primary"
                size="sm"
                onClick={() => setOpenFeedback(true)}
                iconTrailing={<CheckVerified01 size={16} />}
            >
                {getFinalPoints(item.feedback.summary)}
            </Button>
        </>
        }
        <Button
            color="primary"
            size="sm"
            target="_blank"
            iconTrailing={<ArrowRight size={12}/>}
            href={`/submissions/${item.id}`}
            as={Link}
        >
            Grade
        </Button>
    </div>
}