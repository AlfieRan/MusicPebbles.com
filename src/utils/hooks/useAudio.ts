import { useEffect, useState } from "react";

export function useAudio() {
    const [audio, setAudio] = useState<HTMLAudioElement | undefined>(undefined);

    useEffect(() => {
        const audio = new Audio();
        setAudio(audio);
        return () => {
            audio.pause();
            audio.src = "";
        };
    }, []);

    function play() {
        audio?.play();
    }

    function pause() {
        audio?.pause();
    }

    function setSrc(src: string) {
        pause();
        if (audio !== undefined) {
            audio.src = src;
            audio.load();
        }
    }

    return {
        play,
        pause,
        setSrc,
    };
}
