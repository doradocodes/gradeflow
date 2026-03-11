import {createSubmission, getAssignment} from "@/utils/firestore";
import SubmissionForm from "@/components/forms/SubmissionForm";
import {GradeflowLogo} from "@/components/foundations/logo/gradeflow-logo";
import StudentSubmissionForm from "@/components/forms/StudentSubmissionForm";


export default async function SubmitAssignmentPage({params}) {
    const {assignmentId} = await params;

    const assignment = await getAssignment(assignmentId);

    if (!assignment) {
        return <div>Assignment not found</div>;
    }

    return <div className="pt-14 md:pt-24 px-10 pb-24">
        <div className="flex flex-col align-center max-w-xl mx-auto">
            <div className="flex justify-center">
                <GradeflowLogo className="mb-4" />
            </div>
            <h1 className="text-center font-bold text-2xl md:text-5xl mb-4">Submission to {assignment.courseName} - {assignment.title}</h1>
            <p className="mb-8 text-center">{assignment.description}</p>
            <StudentSubmissionForm assignment={JSON.parse(JSON.stringify(assignment))}/>
        </div>
    </div>
}