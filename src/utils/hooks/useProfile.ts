import { useEffect, useState } from "react";
import { profileDataType } from "../types/oauth";
import { wrapAllArtists, wrapAllSongs } from "../spotify/wrappers";
import { profileHookType } from "../types/state";

export function useProfile(): profileHookType {
    const [profile, setProfile] = useState<profileDataType>({
        profile: undefined,
        artists: undefined,
        songs: undefined,
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    async function getProfile() {
        try {
            const res = await fetch("/api/user/@me");
            const data: profileDataType = await res.json();

            if (res.status >= 400) {
                setError(true);
                setLoading(false);
                return;
            }
            const filteredData: profileDataType = {
                profile: data.profile,
                artists: await wrapAllArtists(data.artists),
                songs: await wrapAllSongs(data.songs),
            };

            setProfile(filteredData);
            setLoading(false);
        } catch (err) {
            setError(true);
            setLoading(false);
        }
    }

    useEffect(() => {
        getProfile().catch((err) => {
            console.log("ERROR - ", err);
            setError(true);
            setLoading(false);
        });
    }, []);

    setInterval(() => {
        getProfile().catch((err) => {
            console.log("ERROR - ", err);
            setError(true);
            setLoading(false);
        });
    }, 1000 * 60 * 60);

    return { profile, loading, error };
}
