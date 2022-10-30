import { useEffect, useState } from "react";
import { artistType } from "../types/spotify";

export function useArtists() {
    const [artists, setArtists] = useState<artistType[]>([]);

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/user/artists");
            const data = await response.json();
            setArtists(data);
        })().catch((err) => console.error(err));
    }, []);

    return artists;
}
