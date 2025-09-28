import {getAssignment} from "@/utils/firestore";
import SubmissionForm from "@/components/SubmissionForm";


export default async function SubmitAssignmentPage({params}) {
    const {assignmentId} = await params;

    const assignment = await getAssignment(assignmentId);

    if (!assignment) {
        return <div>Assignment not found</div>;
    }

    return <div className="p-4 min-h-screen flex flex-col gap-4 justify-center items-center">
        <h2 className="text-center font-bold text-lg">GradeFlow</h2>
        <h1 className="text-center font-bold text-3xl">Submission to {assignment.courseName} - {assignment.title}</h1>
        <p>{assignment.description}</p>
        <SubmissionForm assignmentId={assignmentId}/>
    </div>
}