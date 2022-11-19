import { useEffect, useState } from "react";

export function useMouse() {
    const [fastMouse, setFastMouse] = useState({
        x: 0,
        y: 0,
    });

    const updateMouse = (e: MouseEvent) => {
        const { pageX, pageY } = e;

        setFastMouse({
            x: pageX,
            y: pageY,
        });
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("mousemove", updateMouse);
            return () => window.removeEventListener("mousemove", updateMouse);
        }
    }, [window, updateMouse]);

    return { mouse: fastMouse };
}
