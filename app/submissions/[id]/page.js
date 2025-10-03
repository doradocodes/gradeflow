import {getSubmissions} from "@/utils/firestore";
import ProtectedRoute from "@/components/ProtectedRoute";
import Grading from "@/components/Grading";

export default async function Submission({ params }) {
    const { id } = await params;

    // const submission = await getSubmissions(id);
    // console.log(submission);

    // if (!submission) {
    //     return <div>Submission not found</div>;
    // }

    return <ProtectedRoute>
        <Grading
            submissionId={id}
        />
    </ProtectedRoute>;
}