'use client'

import {useState} from "react";
import Recorder from "@/components/Recorder";
import RubricCards from "@/components/RubricCards";

export default function GradingRubric({ studentName, file }) {
    const [isFeedbackRecording, setIsFeedbackRecording] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    return <div className="flex flex-col absolute top-2 right-2 shadow-md rounded-lg bg-white max-w-lg">
        <div className="shadow-md p-4 flex flex-col gap-1">
            <h2 className="text-sm text-gray-400">Current grading</h2>
            <div className="flex gap-1">
                <h2 className="text-1xl font-bold">{studentName}:</h2>
                <h2 className="text-1xl font-bold">Project 1</h2>
            </div>

            <div className="flex gap-2 items-center">
                <span className="text-sm">Viewing file: </span>
                <span className="text-sm">{file}</span>
                {/*<Menu>*/}
                {/*    <MenuButton className="inline-flex items-center text-sm/6 font-semibold shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white">*/}
                {/*        Demo page*/}
                {/*        <ChevronDownIcon className="size-4" />*/}
                {/*    </MenuButton>*/}

                {/*    <MenuItems*/}
                {/*        transition*/}
                {/*        anchor="bottom start"*/}
                {/*        className="w-52 origin-top-right rounded-xl border border-white/5 bg-white shadow-md p-1 text-sm/6 transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"*/}
                {/*    >*/}
                {/*        <MenuItem>*/}
                {/*            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">*/}
                {/*                Demo page*/}
                {/*            </button>*/}
                {/*        </MenuItem>*/}
                {/*        <MenuItem>*/}
                {/*            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">*/}
                {/*                Github*/}
                {/*            </button>*/}
                {/*        </MenuItem>*/}
                {/*        <MenuItem>*/}
                {/*            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">*/}
                {/*                Figma*/}
                {/*            </button>*/}
                {/*        </MenuItem>*/}
                {/*    </MenuItems>*/}
                {/*</Menu>*/}
            </div>
        </div>
        <div className="p-4">
            <RubricCards />
        </div>
        <div className="p-4">
            <Recorder />
        </div>
    </div>
}