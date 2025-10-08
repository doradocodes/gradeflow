import clsx from "clsx";
import {CloseButton} from "@/components/base/buttons/close-button";
import {useEffect, useState} from "react";
import {Expand01, Minimize01, XClose} from "@untitledui/icons";
import {ButtonUtility} from "@/components/base/buttons/button-utility";

export default function SlideoutMenu({open, onClose, title, description, children, isExpanded = false}) {
    const [expanded, setExpanded] = useState(isExpanded);

    useEffect(() => {
        if (open) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    }, [open]);

    const handleClose = (e) => {
        e.stopPropagation()
        onClose(false);
    }

    return (
        <div
            className={clsx(
                "fixed inset-0 overflow-hidden transition-all duration-300",
                open ? 'z-50' : 'z-[-1]'
            )}
        >
            <div
                className={clsx(
                    "absolute top-0 left-0 h-full w-full transition-opacity duration-300 z-20 backdrop-blur-md",
                    open ? "bg-black/50 opacity-100 pointer-events-auto" : "bg-black/0 opacity-0 pointer-events-none"
                )}
                onClick={handleClose}
            ></div>
            <div
                className={clsx(
                    "absolute z-30 top-0 right-0 h-full w-1/3 bg-white transition-all duration-300 overflow-y-auto flex flex-col",
                    open ? "translate-x-0" : "translate-x-full",
                    expanded ? "w-11/12" : "w-1/3"
                )}
            >
                <div className="flex justify-between p-4">
                    <div>
                        <h2 className="text-xl font-bold mb-1">{title}</h2>
                        <p className="text-gray-500">{description}</p>
                    </div>
                    <div className="flex gap-2">
                        <ButtonUtility size="sm" color="tertiary" icon={expanded ? <Minimize01 size={15}/> : <Expand01 size={15} />} onClick={() => setExpanded(!expanded)}/>
                        <ButtonUtility size="sm" color="tertiary" icon={<XClose size={15} />} onClick={() => onClose(false)}/>
                    </div>
                </div>
                <div className="h-full overflow-y-auto p-4">
                    {children}
                </div>

            </div>
        </div>
    );
}
