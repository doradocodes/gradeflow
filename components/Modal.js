import clsx from "clsx";
import {CloseButton} from "@/components/base/buttons/close-button";
import {useEffect} from "react";

export default function Modal({open, onClose, icon, title, description, children}) {
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
                "fixed w-full h-full top-0 left-0 inset-0 overflow-hidden flex items-center justify-center transition-all duration-300",
                open ? 'z-50' : 'z-[-1]'
            )}
        >
            <div
                className={clsx(
                    "absolute top-0 left-0 h-full w-full transition-all duration-300 cursor-pointer backdrop-blur-md",
                    open ? "bg-overlay/70" : "bg-black/0"
                )}
                onClick={handleClose}
            ></div>
            <div
                className={clsx(
                    "w-1/2 bg-white transition-all duration-300 overflow-y-auto flex flex-col rounded-lg shadow-lg",
                    open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
                    'max-h-[80vh] overflow-y-auto'
                )}
            >
                <div className="flex justify-between p-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            {icon && <div className="">{icon}</div>}
                            {title && <h2 className="text-xl font-bold">{title}</h2>}
                        </div>
                        {description && <p className="text-gray-500">{description}</p>}
                    </div>
                    <CloseButton className="absolute top-2 right-2" size="md" onClick={() => onClose(false)}/>
                </div>
                <div className="overflow-y-auto p-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
