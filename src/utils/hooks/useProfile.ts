import { useEffect, useState } from "react";
import { profileType } from "../types/oauth";

export function useProfile() {
    const [profile, setProfile] = useState<profileType | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        async function getProfile() {
            try {
                const res = await fetch("/api/user/@me");
                const data = await res.json();

                if (res.status >= 400) {
                    setError(true);
                    setLoading(false);
                } else {
                    setProfile(data);
                    setLoading(false);
                }
            } catch (err) {
                setError(true);
                setLoading(false);
            }
        }

        getProfile().catch((err) => {
            console.log("ERROR - ", err);
            setError(true);
            setLoading(false);
        });
    }, []);

    return { profile, loading, error };
}