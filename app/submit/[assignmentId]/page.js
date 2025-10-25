import {createSubmission, getAssignment} from "@/utils/firestore";
import SubmissionForm from "@/components/SubmissionForm";
import {GradeflowLogo} from "@/components/foundations/logo/gradeflow-logo";
import StudentSubmissionForm from "@/components/StudentSubmissionForm";


export default async function SubmitAssignmentPage({params}) {
    const {assignmentId} = await params;

    const assignment = await getAssignment(assignmentId);

    if (!assignment) {
        return <div>Assignment not found</div>;
    }

    return <div className="w-full max-w-4xl mx-auto h-screen p-4 flex flex-col gap-4 justify-center items-center">
        <GradeflowLogo className="mb-4" />
        <h1 className="text-center font-bold text-5xl">Submission to {assignment.courseName} - {assignment.title}</h1>
        <p className="mb-8">{assignment.description}</p>
        <StudentSubmissionForm assignment={JSON.parse(JSON.stringify(assignment))}/>
    </div>
}