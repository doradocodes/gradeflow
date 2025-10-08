import {createAssignment, createSubmission, deleteSubmission, getSubmissionsByAssignment} from "@/utils/firestore";
import {useEffect, useState} from "react";
import Link from "next/link";
import SubmissionForm from "@/components/SubmissionForm";
import {Button} from "@/components/base/buttons/button";
import {Table, TableCard, TableRowActionsDropdown} from "@/components/application/table/table";
import {Badge} from "@/components/base/badges/badges";
import {ButtonUtility} from "@/components/base/buttons/button-utility";
import {ArrowRight, Edit01, Plus, Trash01} from "@untitledui/icons";
import {LoadingIndicator} from "@/components/application/loading-indicator/loading-indicator";
import FeedbackSummary from "@/components/FeedbackSummary";
import SlideoutMenu from "@/components/SlideoutMenu";

export default function SubmissionsTable({assignment}) {
    const [submissions, setSubmissions] = useState([]);
    const [isAddingSubmission, setIsAddingSubmission] = useState(false);

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
        await createSubmission(data);
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

    if (!submissions) return <div className="flex justify-center items-center h-full">
        <LoadingIndicator type="line-simple" size="sm" />
    </div>

    return <>
        <TableCard.Root className="mb-4">
            <TableCard.Header
                title="Submissions"
                badge={`${submissions.length} submissions`}
                contentTrailing={
                    <div className="absolute top-5 right-4 md:right-6">
                        <TableRowActionsDropdown/>
                    </div>
                }
            />
            <Table aria-label="Submissions" className="w-full mb-4">
                <Table.Header>
                    <Table.Head id="studentName" label="Student Name" allowsSorting/>
                    <Table.Head id="status" label="Status" allowsSorting/>
                    <Table.Head id="deliverables" label="Deliverables"/>
                    <Table.Head id="grade" label="Grade"/>
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
                            <Table.Cell className="px-4">
                                <div className="flex justify-end gap-0.5">
                                    <ButtonUtility onClick={() => onDeleteSubmission(item)} size="xs" color="tertiary" tooltip="Delete" icon={Trash01}/>
                                    <ButtonUtility size="xs" color="tertiary" tooltip="Edit" icon={Edit01}/>
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </TableCard.Root>

        {isAddingSubmission ?
            <SlideoutMenu
                open={isAddingSubmission}
                onClose={() => setIsAddingSubmission(false)}
                title={`Create a new submission`}
                description="Fill in the details to create a new submission."
            >
                <SubmissionForm
                    assignmentId={assignment.id}
                    isInline={true}
                    deliverables={assignment.deliverables}
                    onSubmit={onCreateAssignment}
                />
            </SlideoutMenu>
            :
            <Button color="secondary" size="sm" onClick={() => setIsAddingSubmission(true)} iconLeading={Plus}>Add submission</Button>
        }
    </>
}

function GradeCell({ item }) {
    const [openFeedback, setOpenFeedback] = useState(false);
    return <>
        {item.feedback && <>
            <SlideoutMenu
                open={openFeedback}
                onClose={() => setOpenFeedback(false)}
                title={`Feedback for ${item.studentName}`}
                isExpanded={true}
            >
                <FeedbackSummary submission={item} />
            </SlideoutMenu>
            <Button
                color="secondary"
                size="sm"
                onClick={() => setOpenFeedback(true)}
            >
                View feedback
            </Button>
        </>
        }
        <Button
            color="secondary"
            size="sm"
            iconTrailing={<ArrowRight size={12}/>}
            href={`/submissions/${item.id}`}
            as={Link}
        >
            Grade
        </Button>
    </>
}