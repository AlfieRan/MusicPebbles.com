import { useEffect, useState } from "react";
import { songType } from "../types/spotify";
import { audioPlayerType } from "../types/state";
import { sleep } from "../other/time";

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
        audio.volume = 0;
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

    useEffect(() => {
        if (curSong === undefined && availableSongs.length > 0) {
            setSong(availableSongs[0], false).catch(console.error);
        }
    }, [availableSongs]);

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
        try {
            if (audio) {
                audio.volume = 0;
                audio.src = song.preview_url;
                audio.load();
                setCurSong(song);
                if (playSong) {
                    await sleep(50);
                    await play();
                }
            } else {
                console.error("Audio is undefined");
            }
        } catch (e) {
            console.error(e);
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
                        const percent = audio.currentTime / audio.duration;
                        setPlayBackProgress((prevState) => ({
                            ...prevState,
                            current: percent,
                        }));
                        if (percent > 0.1 && percent < 0.9) {
                            audio.volume = 1;
                        } else {
                            fadeInOut();
                        }
                    }
                }, 500),
            }));
        }
    }

    function fadeInOut() {
        if (audio) {
            const interval = setInterval(() => {
                const percent = audio.currentTime / audio.duration;
                if (percent < 0.1 || percent > 0.9) {
                    audio.volume = getSoundLevel(percent);
                } else {
                    clearInterval(interval);
                }
            }, 10);
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

function getSoundLevel(percent: number) {
    // takes a number between 0-1 and returns a number between 0-1
    if (percent < 0.1) {
        return percent * 10;
    } else if (percent > 0.9) {
        return (1 - percent) * 10;
    }
    return 1;
}
