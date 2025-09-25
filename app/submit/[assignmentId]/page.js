import {createSubmission, getAssignment, updateAssignment} from "@/utils/firestore";
import Button from "@/components/Button";
import {Description, Dialog, DialogPanel, DialogTitle} from "@headlessui/react";
import SubmissionForm from "@/components/SubmissionForm";


export default async function SubmitAssignmentPage({ params }) {
    const { assignmentId } = await params;

    const assignment = await getAssignment(assignmentId);

    if (!assignment) {
        return <div>Assignment not found</div>;
    }

    return <div className="p-4">
        <h1 className="text-center">Submission to {assignment.courseName} - {assignment.title}</h1>
        <SubmissionForm assignmentId={assignmentId} />
    </div>
}