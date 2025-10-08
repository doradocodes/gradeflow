'use client';

import {createSubmission} from "@/utils/firestore";
import SubmissionForm from "@/components/SubmissionForm";

export default function StudentSubmissionForm({assignment}) {
    return <div className="bg-white p-8 rounded-lg shadow-md w-full">
        <SubmissionForm
            deliverables={assignment.deliverables}
            isInline={false}
            onSubmit={async (values) => {
                console.log(values);
                const data = {
                    ...values,
                    assignmentId: assignment.id,
                    status: values.submittedAt.getTime() < new Date(assignment.dueDate).getTime() ? 'on_time' : 'late',
                };
                await createSubmission(data, assignment.teacherId);
            }}
        />
    </div>
}