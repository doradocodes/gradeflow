import {getAssignment} from "@/utils/firestore";
import SubmissionForm from "@/components/SubmissionForm";
import {GradeflowLogo} from "@/components/foundations/logo/gradeflow-logo";


export default async function SubmitAssignmentPage({params}) {
    const {assignmentId} = await params;

    const assignment = await getAssignment(assignmentId);

    if (!assignment) {
        return <div>Assignment not found</div>;
    }

    return <div className="w-full max-w-3xl mx-auto h-screen p-4 flex flex-col gap-4 justify-center items-center">
        <GradeflowLogo className="mb-8" />
        <h1 className="text-center font-bold text-3xl">Submission to {assignment.courseName} - {assignment.title}</h1>
        <p>{assignment.description}</p>
        <SubmissionForm assignmentId={assignmentId}/>
    </div>
}