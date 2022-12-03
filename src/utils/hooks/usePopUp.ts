import { useEffect, useState } from "react";

export function usePopUp() {
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);

    useEffect(() => {
        const getLocal = localStorage.getItem("seenPopUp");
        if (getLocal) {
            setIsPopUpOpen(false);
        } else {
            setIsPopUpOpen(true);
        }
    }, []);

    function closePopUp() {
        setIsPopUpOpen(false);
        localStorage.setItem("seenPopUp", "true");
    }

    return { isPopUpOpen, closePopUp };
}
