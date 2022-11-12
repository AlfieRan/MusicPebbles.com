import { useEffect, useState } from "react";
import { songType } from "../types/spotify";
import { audioPlayerType } from "../types/state";

export function useAudio(): audioPlayerType {
    const [audio, setAudio] = useState<HTMLAudioElement | undefined>(undefined);

    const [curSong, setCurSong] = useState<songType | undefined>(undefined);
    const [paused, setPaused] = useState<boolean>(true);
    const [availableSongs, setAvailableSongs] = useState<songType[]>([]);

    const [playBackProgress, setPlayBackProgress] = useState<{
        interval: NodeJS.Timer | undefined;
        current: number;
    }>({ interval: undefined, current: 0 });

    useEffect(() => {
        const audio = new Audio();
        setAudio(audio);
        return () => {
            audio.pause();
            audio.src = "";
        };
    }, []);

    useEffect(() => {
        if (audio) {
            audio.onplay = () => {
                setPaused(false);
            };
            audio.onpause = () => {
                setPaused(true);
            };
        }
    }, [audio]);

    async function play() {
        if (audio) {
            if (audio.src === "") {
                await nextSong(false);
            }
            await audio.play();
            createInterval();
        } else {
            console.error("Audio is undefined");
        }
    }

    async function pause() {
        if (audio) {
            await audio.pause();
        } else {
            console.error("Audio is undefined");
        }
    }

    async function playPause() {
        if (audio && !audio.paused) {
            await pause();
        } else {
            await play();
        }
    }

    async function setSong(song: songType, playSong: boolean = true) {
        if (audio) {
            audio.src = song.preview_url;
            audio.load();
            setCurSong(song);
            if (playSong) {
                await play();
            }
        } else {
            console.error("Audio is undefined");
        }
    }

    function addSongs(songs: songType[]) {
        setAvailableSongs((prevState) => [...prevState, ...songs]);
    }

    async function nextSong(playSong: boolean = true) {
        if (availableSongs.length > 0) {
            let randomSong = curSong;
            while (randomSong === curSong) {
                randomSong =
                    availableSongs[
                        Math.floor(Math.random() * availableSongs.length)
                    ];
            }
            await setSong(
                availableSongs[
                    Math.floor(Math.random() * availableSongs.length)
                ],
                playSong
            );
        } else {
            console.error("No songs available");
        }
    }

    async function prevSong() {
        console.error("Previous Song clicked but Not implemented");
    }

    function createInterval() {
        if (audio) {
            clearInterval(playBackProgress.interval);
            setPlayBackProgress((prevState) => ({
                ...prevState,
                interval: setInterval(async () => {
                    if (audio.ended) {
                        await nextSong();
                    } else {
                        setPlayBackProgress((prevState) => ({
                            ...prevState,
                            current: audio.currentTime / 30,
                        }));
                    }
                }, 1000),
            }));
        }
    }

    return {
        playPause,
        paused,
        setSong,
        addSongs,
        nextSong,
        prevSong,
        playing: curSong,
    };
}
