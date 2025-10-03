import clsx from "clsx";
import {CloseButton} from "@/components/base/buttons/close-button";
import {useEffect} from "react";

export default function Modal({open, onClose, title, description, children}) {
    useEffect(() => {
        if (open) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    }, [open]);

    return (
        <div
            className={clsx(
                "fixed inset-0 z-50 transition-opacity duration-300 overflow-hidden flex items-center justify-center",
                open ? "bg-black/50 opacity-100" : "bg-black/0 opacity-0 pointer-events-none"
            )}
        >
            <div
                className={clsx(
                    "h-1/3 w-1/3 bg-white transition-transform duration-300 overflow-y-auto flex flex-col rounded-lg shadow-lg",
                    open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )}
            >
                <div className="flex justify-between p-4 border-b border-gray-100">
                    <div className="flex flex-col">
                        {title && <h2 className="text-xl font-bold">{title}</h2>}
                        {description && <p className="text-gray-500">{description}</p>}
                    </div>
                    <CloseButton size="md" onClick={() => onClose(false)}/>
                </div>
                <div className="h-full overflow-y-auto p-4">
                    {children}
                </div>

            </div>
        </div>
    );
}
