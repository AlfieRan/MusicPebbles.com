import { useSpring } from "framer-motion";
import { MutableRefObject, Ref, useEffect, useState } from "react";

export function useMouse() {
    const mouse = {
        x: useSpring(0, { stiffness: 75, damping: 15 }),
        y: useSpring(0, { stiffness: 100, damping: 15 }),
    };
    const [sector, setSector] = useState<{
        x: "left" | "right";
        y: "top" | "bottom";
    }>({ x: "left", y: "top" });

    const updateMouse = (e: MouseEvent) => {
        const { pageX, pageY } = e;

        if (pageX > window.innerWidth / 2 && sector.x !== "right") {
            // mouse is on the right side of the screen
            setSector((prev) => ({ ...prev, x: "right" }));
        } else if (pageX < window.innerWidth / 2 && sector.x !== "left") {
            // mouse is on the left side of the screen
            setSector((prev) => ({ ...prev, x: "left" }));
        }

        if (pageY > window.innerHeight / 2 && sector.y !== "bottom") {
            // mouse is in the bottom half of the screen
            setSector((prev) => ({ ...prev, y: "bottom" }));
        } else if (pageY < window.innerHeight / 2 && sector.y !== "top") {
            // mouse is in the top half of the screen
            setSector((prev) => ({ ...prev, y: "top" }));
        }

        mouse.x.set(pageX);
        mouse.y.set(pageY);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("mousemove", updateMouse);
            return () => window.removeEventListener("mousemove", updateMouse);
        }
    }, [window, updateMouse]);

    return { mouse, sector };
}
