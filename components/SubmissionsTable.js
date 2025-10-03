import {deleteSubmission, getSubmissionsByAssignment} from "@/utils/firestore";
import {useEffect, useState} from "react";
import Link from "next/link";
import SubmissionForm from "@/components/SubmissionForm";
import {Button} from "@/components/base/buttons/button";
import {Table, TableCard, TableRowActionsDropdown} from "@/components/application/table/table";
import {Badge, BadgeWithIcon} from "@/components/base/badges/badges";
import {ButtonUtility} from "@/components/base/buttons/button-utility";
import {ArrowRight, Edit01, Trash01} from "@untitledui/icons";
import {LoadingIndicator} from "@/components/application/loading-indicator/loading-indicator";

export default function SubmissionsTable({assignmentId}) {
    const [isLoading, setIsLoading] = useState(true);
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        loadSubmissions();
    }, []);

    const loadSubmissions = async () => {
        const data = await getSubmissionsByAssignment(assignmentId);
        setSubmissions(data);
        setIsLoading(false);
    }

    const onDeleteAssignment = async (submission) => {
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

    if (isLoading) return <div className="flex justify-center items-center h-full">
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
                    <Table.Head id="studentName" label="Student Name" isRowHeader allowsSorting/>
                    <Table.Head id="status" label="Status" allowsSorting/>
                    <Table.Head id="deliverables" label="Deliverables" allowsSorting/>
                    <Table.Head id="grade" label="Grade" allowsSorting/>
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
                                        <li key={d.name}>
                                            <a className="text-blue-500" href={d.value} target="_blank"
                                               rel="noopener noreferrer">Website link</a>
                                        </li>
                                    ))}
                                </ol>
                            </Table.Cell>
                            <Table.Cell>
                                <BadgeWithIcon type="color" color="brand" size="sm" iconTrailing={ArrowRight}>
                                    <Link href={`/submissions/${item.id}`}>Grade</Link>
                                </BadgeWithIcon>
                            </Table.Cell>
                            <Table.Cell className="px-4">
                                <div className="flex justify-end gap-0.5">
                                    <ButtonUtility onClick={() => onDeleteAssignment(item)} size="xs" color="tertiary" tooltip="Delete" icon={Trash01}/>
                                    <ButtonUtility size="xs" color="tertiary" tooltip="Edit" icon={Edit01}/>
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </TableCard.Root>
        <div className="w-full border-b border-gray-200"></div>
        <SubmissionForm assignmentId={assignmentId}/>
    </>
}