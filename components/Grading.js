'use client'

import IframeCanvas from "@/components/IFrameCanvas";
import GradingRubric from "@/components/GradingRubric";
import {useEffect, useRef, useState} from "react";
import {LoadingIndicator} from "@/components/application/loading-indicator/loading-indicator";
import {getSubmission} from "@/utils/firestore";
import FeedbackSummary from "@/components/forms/FeedbackSummary";
import Modal from "@/components/Modal";
import {useAudioCache} from "@/hooks/useAudioCache";

export default function Grading({ submissionId }) {
    if (!submissionId) return <LoadingIndicator type="line-simple" size="sm" />

    const [submission, setSubmission] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);

    const { saveToCache } = useAudioCache();
    // Holds the latest captured audio file so we can cache it on navigate-away
    const pendingAudioFileRef = useRef(null);
    // Ref to the Recorder so we can stop an active recording before unload
    const recorderRef = useRef(null);

    const handleAudioCaptured = (file) => {
        pendingAudioFileRef.current = file;
    };

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

    // Show confirmation dialog when user tries to leave the page
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';

            // If a recording is still active, stop it and capture the file
            if (recorderRef.current?.isRecording) {
                recorderRef.current.stopAndGetFile().then((result) => {
                    if (result?.file && submissionId) {
                        saveToCache(submissionId, result.file);
                    }
                });
            } else if (pendingAudioFileRef.current && submissionId) {
                // Recording already stopped — persist whatever we have
                saveToCache(submissionId, pendingAudioFileRef.current);
            }

            return '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [submissionId]);

    // Cache on client-side navigation (component unmount)
    useEffect(() => {
        return () => {
            if (pendingAudioFileRef.current && submissionId) {
                saveToCache(submissionId, pendingAudioFileRef.current);
            }
        };
    }, [submissionId]);

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
            onAudioCaptured={handleAudioCaptured}
            recorderRef={recorderRef}
        />
        <Modal
            open={isSummaryOpen}
            onClose={() => setIsSummaryOpen(false)}
            title="Feedback summary"
        >
            {isSummaryOpen && <FeedbackSummary submissionId={submission.id} assignment={{}} /> }
        </Modal>
    </div>
}