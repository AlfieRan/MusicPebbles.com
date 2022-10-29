import { useSpring } from "framer-motion";
import { useEffect } from "react";

export function useMouse() {
    const mouse = {
        x: useSpring(0, { stiffness: 75, damping: 15 }),
        y: useSpring(0, { stiffness: 100, damping: 15 }),
    };

    const updateMouse = (e: MouseEvent) => {
        mouse.x.set(
            e.pageX > window.innerWidth - 200
                ? window.innerWidth - 0.2 * e.pageX
                : e.pageX
        );
        mouse.y.set(
            e.pageY > window.innerHeight - 200
                ? window.innerHeight - 0.2 * e.pageY
                : e.pageY
        );
        console.log(e.pageX, 2 * e.pageX - window.innerWidth);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("mousemove", updateMouse);
            return () => window.removeEventListener("mousemove", updateMouse);
        }
    }, [window, updateMouse]);

    return mouse;
}
