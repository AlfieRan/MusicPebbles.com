import { useSpring } from "framer-motion";
import { useEffect } from "react";

export function useMouse(padding: number = 150) {
    const mouse = {
        x: useSpring(0, { stiffness: 75, damping: 15 }),
        y: useSpring(0, { stiffness: 100, damping: 15 }),
    };

    const updateMouse = (e: MouseEvent) => {
        mouse.x.set(
            e.pageX > window.innerWidth - padding
                ? window.innerWidth - padding
                : e.pageX
        );
        mouse.y.set(
            e.pageY > window.innerHeight - padding
                ? window.innerHeight - padding
                : e.pageY
        );
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("mousemove", updateMouse);
            return () => window.removeEventListener("mousemove", updateMouse);
        }
    }, [window, updateMouse]);

    return mouse;
}
