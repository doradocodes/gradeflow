import {getSubmissions} from "@/utils/firestore";
import GradingRubric from "@/components/GradingRubric";
import IframeCanvas from "@/components/IFrameCanvas";
import ProtectedRoute from "@/components/ProtectedRoute";

export default async function Submission({ params }) {
    const { id } = await params;

    const submission = await getSubmissions(id);

    if (!submission) {
        return <div>Submission not found</div>;
    }

    return <ProtectedRoute>
        <div className="w-full h-full min-h-screen flex flex-col gap-4 justify-center items-center">
            <IframeCanvas url={submission.url || submission.fileName || 'https://doradocodes.com'} />
            <GradingRubric
                assingmentId={submission.assignmentId}
                studentName={submission.studentName}
                deliverables={submission.deliverables}
            />
        </div>
    </ProtectedRoute>;
}