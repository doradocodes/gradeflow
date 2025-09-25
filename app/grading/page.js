'use client'

import GradingRubric from "@/components/GradingRubric";
import Button from "@/components/Button";
import {useRef, useState} from "react";
import IframeCanvas from "@/components/IFrameCanvas";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function GradingPage() {
    const [studentName, setStudentName] = useState('Dora');
    const [projectUrl, setProjectUrl] = useState('doradocodes.com');

    const studentNameInputRef = useRef(null);
    const projectUrlInputRef = useRef(null);

    return <ProtectedRoute>
        <div className="w-full h-full min-h-screen flex flex-col gap-4 justify-center items-center">
            { projectUrl ?
                <>
                    <IframeCanvas url={projectUrl} />
                    <GradingRubric
                        studentName={studentName}
                        file={projectUrl}
                    />
                </>
                :
                <div className="container">
                    <form
                        className="flex flex-col gap-2"
                        onSubmit={(e) => {
                            e.preventDefault();

                            setStudentName(studentNameInputRef.current.value.trim());

                            let url = projectUrlInputRef.current.value.trim();
                            // If no protocol provided, assume https
                            if (!/^https?:\/\//i.test(url)) {
                                url = "https://" + url;
                            }
                            setProjectUrl(url);
                        }}
                    >
                        <input
                            ref={studentNameInputRef}
                            type="text"
                            placeholder="Student name"
                            required
                            className="rounded-full py-2 px-4 border border-gray-300"
                        />
                        <input
                            ref={projectUrlInputRef}
                            type="text"
                            placeholder="Project URL"
                            required
                            className="rounded-full py-2 px-4 border border-gray-300"
                        />
                        <Button className="w-auto">Submit</Button>
                    </form>
                </div>
            }

        </div>
    </ProtectedRoute>
}