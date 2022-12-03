import { useEffect, useState } from "react";

export function usePopUp() {
    const [shouldPopUp, setShouldPopUp] = useState(false);
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);

    useEffect(() => {
        const getLocal = localStorage.getItem("seenPopUp");
        if (getLocal) {
            setShouldPopUp(false);
        } else {
            setShouldPopUp(true);
        }
    }, []);

    useEffect(() => {
        // delay to prevent showing during page load
        if (shouldPopUp) {
            setTimeout(() => {
                setIsPopUpOpen(true);
            }, 3500);
        } else {
            setIsPopUpOpen(false);
        }
    }, [shouldPopUp]);

    function closePopUp() {
        setIsPopUpOpen(false);
        localStorage.setItem("seenPopUp", "true");
    }

    return { isPopUpOpen, closePopUp };
}
