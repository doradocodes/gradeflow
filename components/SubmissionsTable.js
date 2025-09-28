import {deleteSubmission, getSubmissionsByAssignment} from "@/utils/firestore";
import {useEffect, useState} from "react";
import Link from "next/link";
import {ArrowRightIcon} from "@heroicons/react/16/solid";
import Button from "@/components/Button";
import SubmissionForm from "@/components/SubmissionForm";
import Tag from "@/components/Tag";

export default function SubmissionsTable({assignmentId}) {
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        loadSubmissions();
    }, []);

    const loadSubmissions = async () => {
        const data = await getSubmissionsByAssignment(assignmentId);
        setSubmissions(data);
    }

    const onDeleteAssignment = async (submission) => {
        await deleteSubmission(submission.id);
        loadSubmissions();
    }

    const getStatusTag = (status) => {
        switch(status) {
            case 'on_time':
                return <Tag color="green">On time</Tag>
            case 'late':
                return <Tag color="red">Late</Tag>
            default:
                return <Tag color="gray">Unknown</Tag>
        }
    }

    return <>
        <table className="w-full mb-4">
            <thead>
            <tr className="border-b border-gray-300">
                <th className="py-2">Student Name</th>
                <th className="py-2">Status</th>
                <th className="py-2">File</th>
                <th className="py-2">Grade</th>
                <th className="py-2">Actions</th>
            </tr>
            </thead>
            <tbody>
            {submissions.map(s => (
                <tr key={s.id}>
                    <td className="py-2">{s.studentName}</td>
                    <td className="py-2">{getStatusTag(s.status)}</td>
                    <td className="py-2">
                        {s.deliverables?.map((d) => (
                            <div key={d.name}>
                                <a className="text-blue-500" href={d.value} target="_blank" rel="noopener noreferrer">Website link</a>
                            </div>
                        ))}
                    </td>
                    <td className="py-2">
                        <Link href={`/submissions/${s.id}`}>
                            <Button>Grade <ArrowRightIcon className="size-4" /></Button>
                        </Link>
                    </td>
                    <td className="py-2">
                        <Button onClick={() => onDeleteAssignment(s)}>Delete</Button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
        <SubmissionForm assignmentId={assignmentId} />
    </>
}