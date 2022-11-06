import { useEffect, useState } from "react";
import { Uniqueness } from "../types/uniqueness";
import { useArtists } from "./useArtists";

export function useUniqueness() {
    const [uniqueness, setUniqueness] = useState<Uniqueness>({
        rating: 0,
        artists: [],
    });
    const artists = useArtists();

    useEffect(() => {
        const sum = artists.reduce((acc, artist) => acc + artist.popularity, 0);
        const rating = 100 - Math.ceil(sum / artists.length);
        setUniqueness({ rating, artists });
        // TODO: add some sort of influence from artists' followers
    }, [artists]);

    return uniqueness;
}
