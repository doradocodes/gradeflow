import { useEffect, useState } from "react";
import {Button} from "@/components/base/buttons/button";
import {ArrowUpRight} from "@untitledui/icons";

const BLOCKED_DOMAINS = [
    'github.com',
    'figma.com',
]

export default function SafeIframe({ src, onMouseOver, onMouseOut, isIframeHovered, scale = 1, pos = { x: 0, y: 0} }) {
    const [isBlocked, setIsBlocked] = useState(false);

    useEffect(() => {
        // const iframe = document.getElementById("safe-iframe");
        //
        // const timer = setTimeout(() => {
        //     try {
        //         // Try to access something inside the iframe
        //         if (!iframe.contentWindow || !iframe.contentDocument) {
        //             throw new Error("No access");
        //         }
        //         const test = iframe.contentDocument.readyState; // triggers CSP if blocked
        //     } catch (e) {
        //         setIsBlocked(true);
        //     }
        // }, 1500); // give it a second to attempt loading
        //
        // return () => clearTimeout(timer);
        if (BLOCKED_DOMAINS.some(domain => src.includes(domain))) {
            setIsBlocked(true);
        } else {
            setIsBlocked(false);
        }
    }, [src]);

    if (isBlocked) {
        return (
            <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-xl border border-gray-300">
                <p className="text-sm text-gray-700 mb-3">
                    ⚠️ This site can’t be embedded due to its Content Security Policy.
                </p>
                <Button
                    color="primary"
                    size="lg"
                    href={src}
                    target="_blank"
                    iconTrailing={<ArrowUpRight data-icon />}
                >Open in a new tab</Button>
            </div>
        );
    }

    return (
        <iframe
            id="safe-iframe"
            src={src}
            className={`w-9/12 h-4/5 border-1 border-gray-300 ${isIframeHovered ? 'outline-2 outline-blue-500 outline-offset-1' : ''}`}
            style={{
                transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                transformOrigin: "0 0",
            }}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
        />
    );
}
