import { useEffect, useState } from "react";

export function useTutorial() {
    const [showTutorial, setShowTutorial] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("skipTutorial") === "true") {
            setShowTutorial(false);
        } else {
            setShowTutorial(true);
        }
    }, [localStorage]);

    function skip() {
        setShowTutorial(false);
        localStorage.setItem("skipTutorial", "true");
    }

    return { showTutorial, skip };
}
