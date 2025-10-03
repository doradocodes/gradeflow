import clsx from "clsx";
import {CloseButton} from "@/components/base/buttons/close-button";
import {useEffect} from "react";

export default function SlideoutMenu({open, onClose, title, description, children}) {
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
                "fixed inset-0 transition-opacity duration-300 overflow-hidden",
                open ? 'z-50' : 'z-[-1]'
            )}
        >
            <div
                className={clsx(
                    "absolute top-0 left-0 h-full w-full transition-opacity duration-300",
                    open ? "bg-black/50 opacity-100" : "bg-black/0 opacity-0 pointer-events-none"
                )}
                onClick={handleClose}
            ></div>
            <div
                className={clsx(
                    "fixed top-0 right-0 h-full w-1/3 bg-white transition-transform duration-300 overflow-y-auto flex flex-col",
                    open ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex justify-between p-4">
                    <div>
                        <h2 className="text-xl font-bold mb-1">{title}</h2>
                        <p className="text-gray-500">{description}</p>
                    </div>
                    <CloseButton onClick={() => onClose(false)}/>
                </div>
                <div className="h-full overflow-y-auto p-4">
                    {children}
                </div>

            </div>
        </div>
    );
}
