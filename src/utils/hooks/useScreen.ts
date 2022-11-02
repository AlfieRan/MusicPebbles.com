import { useEffect, useState } from "react";

export function useScreen() {
    const [screen, setScreen] = useState<{ width: number; height: number }>({
        width: 1440,
        height: 810,
    });

    useEffect(() => {
        setScreen({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        window.addEventListener("resize", () => {
            setScreen({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        });

        return () => {
            window.removeEventListener("resize", () => {
                setScreen({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            });
        };
    }, []);

    return screen;
}
