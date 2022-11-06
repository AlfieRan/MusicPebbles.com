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
        const { pageX, pageY } = e;
        const Mult = getMultiplier();

        if (pageX > window.innerWidth / 2 && offset.x.get() >= 0) {
            offset.x.set(-225);
        } else if (pageX < window.innerWidth / 2 && offset.x.get() < 0) {
            offset.x.set(20);
        }

        if (pageY > window.innerHeight / 2 && offset.y.get() >= 0) {
            offset.y.set(-170 * Mult.height);
        } else if (pageY < window.innerHeight / 2 && offset.y.get() < 0) {
            offset.y.set(15 * Mult.height);
        }

        mouse.x.set(pageX + offset.x.get());
        mouse.y.set(pageY + offset.y.get());
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("mousemove", updateMouse);
            return () => window.removeEventListener("mousemove", updateMouse);
        }
    }, [window, updateMouse]);

    return mouse;
}

function getMultiplier(): { width: number; height: number } {
    return {
        width: screen.width / 5760 + 0.66, // 1920 * 3 = 5760
        height: screen.height / 3240 + 0.66, // 1080 * 3 = 3240
    };
}
