import { useState, useCallback, useRef } from 'react';

/**
 * Hook for the Document Picture-in-Picture API.
 * Moves a DOM element (identified by a ref) into a floating PiP window,
 * while keeping React in full control of that element.
 *
 * Usage:
 *   const { isPip, isSupported, openPip, closePip } = usePictureInPicture();
 *   <div ref={containerRef}>...</div>
 *   <button onClick={() => openPip(containerRef)}>Pop out</button>
 */
export function usePictureInPicture() {
    const [pipWindow, setPipWindow] = useState(null);
    const isPip = !!pipWindow;
    const isSupported =
        typeof window !== 'undefined' && 'documentPictureInPicture' in window;

    // Saved restore info so pagehide can put the element back
    const restoreInfoRef = useRef(null);

    const openPip = useCallback(
        async (elementRef, { width = 440, height = 800, onEnter, onExit } = {}) => {
            if (!isSupported || !elementRef?.current) return;

            const pip = await window.documentPictureInPicture.requestWindow({
                width,
                height,
                disallowReturnToOpener: false,
            });

            // --- Copy all stylesheets into the PiP window ---
            [...document.styleSheets].forEach((sheet) => {
                try {
                    // Inline stylesheets / constructed sheets
                    const cssText = [...sheet.cssRules]
                        .map((r) => r.cssText)
                        .join('');
                    const style = pip.document.createElement('style');
                    style.textContent = cssText;
                    pip.document.head.appendChild(style);
                } catch {
                    // Cross-origin sheet — link it by href instead
                    if (sheet.href) {
                        const link = pip.document.createElement('link');
                        link.rel = 'stylesheet';
                        link.href = sheet.href;
                        pip.document.head.appendChild(link);
                    }
                }
            });

            // Also copy any <style> or <link> elements Next.js injected into <head>
            [...document.head.querySelectorAll('style, link[rel="stylesheet"]')].forEach(
                (node) => {
                    try {
                        pip.document.head.appendChild(node.cloneNode(true));
                    } catch {
                        // ignore
                    }
                }
            );

            // Ensure the body can receive the element cleanly
            pip.document.body.style.margin = '0';
            pip.document.body.style.padding = '0';
            pip.document.body.style.overflow = 'hidden';
            // Prevent two-finger trackpad gestures from scrolling/panning the window
            pip.document.body.style.overscrollBehavior = 'none';
            pip.document.body.style.touchAction = 'none';
            pip.document.documentElement.style.overscrollBehavior = 'none';

            // --- Save restore position then move the element ---
            const el = elementRef.current;
            const originalParent = el.parentNode;
            const nextSibling = el.nextSibling;

            restoreInfoRef.current = { el, originalParent, nextSibling, onExit };

            pip.document.body.appendChild(el);

            // --- Handle the PiP window being closed by the user ---
            pip.addEventListener('pagehide', () => {
                const info = restoreInfoRef.current;
                if (info) {
                    const { el, originalParent, nextSibling, onExit } = info;
                    if (nextSibling) {
                        originalParent.insertBefore(el, nextSibling);
                    } else {
                        originalParent.appendChild(el);
                    }
                    restoreInfoRef.current = null;
                    onExit?.();
                }
                setPipWindow(null);
            });

            setPipWindow(pip);
            onEnter?.();
            return pip;
        },
        [isSupported]
    );

    const closePip = useCallback(() => {
        if (!pipWindow) return;
        // Moving the element back is handled by the pagehide listener
        pipWindow.close();
    }, [pipWindow]);

    return { isPip, isSupported, pipWindow, openPip, closePip };
}


