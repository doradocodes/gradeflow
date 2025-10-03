'use client'

import IframeCanvas from "@/components/IFrameCanvas";
import GradingRubric from "@/components/GradingRubric";
import {useEffect, useState} from "react";
import {LoadingIndicator} from "@/components/application/loading-indicator/loading-indicator";
import {getSubmission} from "@/utils/firestore";

export default function Grading({ submissionId }) {
    if (!submissionId) return <LoadingIndicator type="line-simple" size="sm" />

    const [submission, setSubmission] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);


    useEffect(() => {
        async function load() {
            const data = await getSubmission(submissionId);
            setSubmission(data);
            setCurrentFile(data.deliverables[0]);
        }
        load();
    }, []);

    if (!submission) return <LoadingIndicator type="line-simple" size="sm" />

    return <div className="w-full h-full flex flex-col gap-4 justify-center items-center overflow-hidden">
        <IframeCanvas url={currentFile.value} />
        <GradingRubric
            assingmentId={submission.assignmentId}
            studentName={submission.studentName}
            currentFile={currentFile}
            setCurrentFile={setCurrentFile}
        />
    </div>
}