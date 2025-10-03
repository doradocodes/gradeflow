'use client'

import {useEffect, useState} from "react";
import Recorder from "@/components/Recorder";
import RubricCards from "@/components/RubricCards";
import {getAssignment} from "@/utils/firestore";
import {Select} from "@/components/base/select/select";
import {CloseButton} from "@/components/base/buttons/close-button";
import {Button} from "@/components/base/buttons/button";
import {Check, ChevronDown, ChevronUp} from "@untitledui/icons";
import clsx from "clsx";
import {Dropdown} from "@/components/base/dropdown/dropdown";

export default function GradingRubric({ assingmentId, studentName, currentFile, setCurrentFile }) {
    const [isFeedbackRecording, setIsFeedbackRecording] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [assignment, setAssignment] = useState(null);
    const [collapsed, setCollapsed] = useState(false);


    useEffect(() => {
        async function load() {
            const data = await getAssignment(assingmentId);
            setAssignment(data);
        }
        load();
    }, []);

    const getRubricString = () => {
        if (!assignment?.rubric) return '';
        let arr = Object.keys(assignment?.rubric).map((key, i) => {
            return `${i + 1}. ${key}: ${assignment?.rubric[key].criteria} (${assignment?.rubric[key].maxPoints} points)`
        });
        return arr.join('\n');
    }

    if (!assignment) return null;

    console.log('current file', currentFile);

    return <div className={clsx([
        "flex flex-col fixed z-20 top-20 right-2 shadow-md rounded-lg bg-white max-w-lg transition-all duration-300",
        collapsed ? "h-16 overflow-hidden" : "h-auto"
    ])}>
        <div className="p-4 border-b border-gray-200 ">
            <div className="flex gap-1 justify-between items-center">
                <h2 className="text-1xl font-bold">{assignment?.courseName} - {assignment?.title} - {studentName}</h2>
                {!collapsed ? <Button color="tertiary" size="sm" iconLeading={<ChevronDown data-icon />} aria-label="Expand" onClick={() => setCollapsed(true)} />
                    :
                    <Button color="tertiary" size="sm" iconLeading={<ChevronUp data-icon />} aria-label="Collapse" onClick={() => setCollapsed(false)} />
                }
            </div>
        </div>
        <div className="p-4 flex gap-2 items-center justify-between">
            <h3 className="font-bold text-gray-500">Viewing file</h3>
            <Dropdown.Root>
                <Button
                    className="group"
                    color="secondary"
                    iconTrailing={ChevronDown}
                >
                    {currentFile?.name || 'Select a file'}
                </Button>

                <Dropdown.Popover>
                    <Dropdown.Menu>
                        {assignment?.deliverables.map((d, index) => (
                            <Dropdown.Item
                                key={d.name}
                                onClick={() => setCurrentFile(d.name)}
                                icon={d.name === currentFile?.name ? Check : null}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">{d.name}</span>
                                </div>
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown.Popover>
            </Dropdown.Root>
        </div>
        <div className="px-4">
            <RubricCards assignment={assignment} />
        </div>
        <div className="p-4">
            <Recorder rubric={getRubricString()} />
        </div>
    </div>
}