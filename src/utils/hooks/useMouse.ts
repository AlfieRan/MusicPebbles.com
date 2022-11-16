import { useSpring } from "framer-motion";
import { MutableRefObject, Ref, useEffect, useState } from "react";

export function useMouse() {
    const mouse = {
        x: useSpring(0, { stiffness: 75, damping: 15 }),
        y: useSpring(0, { stiffness: 100, damping: 15 }),
    };

    const updateMouse = (e: MouseEvent) => {
        const { pageX, pageY } = e;

        mouse.x.set(pageX);
        mouse.y.set(pageY);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("mousemove", updateMouse);
            return () => window.removeEventListener("mousemove", updateMouse);
        }
    }, [window, updateMouse]);

    return { mouse };
}
