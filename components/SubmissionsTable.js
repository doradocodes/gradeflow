import {getSubmissionsByAssignment} from "@/utils/firestore";
import {useEffect, useState} from "react";
import Link from "next/link";
import {ArrowRightIcon} from "@heroicons/react/16/solid";
import Button from "@/components/Button";

export default function SubmissionsTable({assignmentId}) {
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        async function load() {
            const data = await getSubmissionsByAssignment(assignmentId);
            setSubmissions(data);
        }
        load();
    }, []);

    return <table className="w-full">
        <thead>
        <tr className="border-b border-gray-300">
            <th className="py-2">Student Name</th>
            <th className="py-2">Status</th>
            <th className="py-2">Grade</th>
        </tr>
        </thead>
        <tbody>
        {submissions.map(s => (
            <tr>
                <td className="py-2">{s.studentName}</td>
                <td className="py-2">{s.status}</td>
                <td className="py-2">
                    <Link href={`/submissions/${s.id}`}>
                        <Button>Grade <ArrowRightIcon className="size-4" /></Button>
                    </Link>
                </td>
            </tr>
        ))}
        </tbody>
    </table>
}