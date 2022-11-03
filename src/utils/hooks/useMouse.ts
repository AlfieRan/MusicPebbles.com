import { useSpring } from "framer-motion";
import { useEffect } from "react";

export function useMouse() {
    const mouse = {
        x: useSpring(0, { stiffness: 75, damping: 15 }),
        y: useSpring(0, { stiffness: 100, damping: 15 }),
    };
    const offset = {
        x: useSpring(0, { stiffness: 75, damping: 15 }),
        y: useSpring(0, { stiffness: 100, damping: 15 }),
    };

    const updateMouse = (e: MouseEvent) => {
        const { clientX, clientY } = e;

        if (clientX > screen.width / 2 && offset.x.get() >= 0) {
            offset.x.set(-200);
        } else if (clientX < screen.width / 2 && offset.x.get() < 0) {
            offset.x.set(20);
        }

        if (clientY > screen.height / 2 && offset.y.get() >= 0) {
            offset.y.set(-150);
        } else if (clientY < screen.height / 2 && offset.y.get() < 0) {
            offset.y.set(40);
        }

        mouse.x.set(clientX + offset.x.get());
        mouse.y.set(clientY + offset.y.get());
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("mousemove", updateMouse);
            return () => window.removeEventListener("mousemove", updateMouse);
        }
    }, [window, updateMouse]);

    return mouse;
}
