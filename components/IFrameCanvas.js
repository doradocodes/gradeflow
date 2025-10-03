"use client";

import {useEffect, useRef, useState} from "react";

export default function IframeCanvas({ url }) {
    const canvasRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [last, setLast] = useState({ x: 0, y: 0 });
    const [isIframeHovered, setIsIframeHovered] = useState(false);

    function onWheel(e) {
        setScale((s) => Math.max(0.25, Math.min(4, s - e.deltaY * 0.001)));
    }

    function onMouseDown(e) {
        setDragging(true);
        setLast({ x: e.clientX, y: e.clientY });
    }

    function onMouseMove(e) {
        if (!dragging) return;
        setPos((p) => ({
            x: p.x + (e.clientX - last.x),
            y: p.y + (e.clientY - last.y),
        }));
        setLast({ x: e.clientX, y: e.clientY });
    }

    function onMouseUp() {
        setDragging(false);
    }

    function onIFrameMouseOver(e) {
        setIsIframeHovered(true);
    }

    function onIFrameMouseOut(e) {
        setIsIframeHovered(false);
    }

    useEffect(() => {
    }, []);

    return (
        <div
            ref={canvasRef}
            className="w-screen h-screen overflow-hidden bg-gray-100 cursor-grab flex items-center justify-center fixed top-0 left-0 z-[-1]"
            onWheel={onWheel}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
        >
            <iframe
                src={url}
                className={`w-9/12 h-4/5 border-1 border-gray-300 ${isIframeHovered ? 'outline-2 outline-blue-500 outline-offset-1' : ''}`}
                style={{
                    transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                    transformOrigin: "0 0",
                }}
                onMouseOver={onIFrameMouseOver}
                onMouseOut={onIFrameMouseOut}
            />
        </div>
    );
}
