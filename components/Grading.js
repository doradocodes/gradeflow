'use client'

import IframeCanvas from "@/components/IFrameCanvas";
import GradingRubric from "@/components/GradingRubric";
import {useEffect, useState} from "react";
import {LoadingIndicator} from "@/components/application/loading-indicator/loading-indicator";
import {getSubmission} from "@/utils/firestore";
import FeedbackSummary from "@/components/forms/FeedbackSummary";
import Modal from "@/components/Modal";

export default function Grading({ submissionId }) {
    if (!submissionId) return <LoadingIndicator type="line-simple" size="sm" />

    const [submission, setSubmission] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);


    useEffect(() => {
        async function load() {
            const data = await getSubmission(submissionId);
            if (data) {
                setSubmission(data);
                setCurrentFile(data.deliverables[0]);
            }
        }
        load();
    }, []);

    if (!submission) return <LoadingIndicator type="line-simple" size="sm" />

    return <div className="absolute top-0 left-0 -z-1 w-full h-full flex flex-col gap-4 justify-center items-center overflow-hidden pt-[72px]">
        {currentFile && <IframeCanvas url={currentFile.value} />}
        <GradingRubric
            assignmentId={submission.assignmentId}
            studentName={submission.studentName}
            submission={submission}
            currentFile={currentFile}
            setCurrentFile={setCurrentFile}
            onOpenSummary={() => setIsSummaryOpen(true)}
        />
        <Modal
            open={isSummaryOpen}
            onClose={() => setIsSummaryOpen(false)}
            title="Feedback summary"
        >
            {isSummaryOpen && <FeedbackSummary submissionId={submission.id} /> }
        </Modal>
    </div>
}