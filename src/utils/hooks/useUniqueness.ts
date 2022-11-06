import { useEffect, useState } from "react";
import { uniqueArtistWrapperType, Uniqueness } from "../types/uniqueness";
import { useArtists } from "./useArtists";
import { artistType } from "../types/spotify";
import { uniqueSigmoid } from "../basics";

const frequencyDependency = 0.35;
// controls how much the uniqueness rating is affected by how much the user has listened to an artist
// must be between 0 and 1
// decays exponentially, so at 0.5, the user's 50th artist has 7.7% of the effect of their 1st artist
// at 0.25, the user's 50th artist has 1.5% of the effect of their 1st artist, etc.

export function useUniqueness() {
    const [uniqueness, setUniqueness] = useState<Uniqueness>({
        rating: 0,
        details: "",
        artists: [],
    });
    const artists = useArtists();

    useEffect(() => {
        const sortedArtists = sortArtistsByUniqueness(artists);

        const portionOfArtists = sortedArtists.length * frequencyDependency;
        const exponentialFactor = (portionOfArtists - 1) / portionOfArtists;

        const sum = sortedArtists.reduce(
            (acc, artist) =>
                acc +
                artist.uniqueness * exponentialFactor ** artist.userRating,
            0
        );
        const rating = Math.ceil(sum / portionOfArtists);
        setUniqueness({
            rating,
            details: getUniquenessDetails(rating),
            artists: sortedArtists,
        });
        // TODO: add some sort of influence from artists' followers
        // TODO: add influence based upon which number of artist it is
    }, [artists]);

    return uniqueness;
}

function sortArtistsByUniqueness(
    artists: artistType[]
): uniqueArtistWrapperType[] {
    let uniqueArtists: uniqueArtistWrapperType[] = [];
    artists.forEach((artist, index) => {
        uniqueArtists = binaryInsert(uniqueArtists, artist, index);
    });
    return uniqueArtists;
}

function binaryInsert(
    artists: uniqueArtistWrapperType[],
    newArtist: artistType,
    userRating: number
) {
    let left = 0;
    let right = artists.length - 1;
    const artistUniqueness = getArtistUniqueness(newArtist);
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (artists[mid].uniqueness < artistUniqueness) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }
    artists.splice(left, 0, {
        artist: newArtist,
        uniqueness: artistUniqueness,
        userRating: userRating,
    });
    return artists;
}

function getArtistUniqueness(artist: artistType): number {
    return (
        100 -
        adjustPopularity(artist.popularity) *
            uniqueSigmoid(artist.followers.total)
    );
}

function adjustPopularity(popularity: number) {
    return 0.01 * popularity ** 2;
}

function getUniquenessDetails(rating: number) {
    return rating >= 90
        ? "Okay you definitely only listen to your own music, have fun with that. Weirdo."
        : rating >= 80
        ? "Do you only listen to artists who live in caves? Your taste is way too underground for any normal person, please just go outside."
        : rating >= 70
        ? "You definitely do something with computers for a living, probably modding discord servers. You're a little too niche for me."
        : rating >= 60
        ? "Your taste is pretty underground, but you're not too far gone. Stay off reddit and you might be somewhat tolerable."
        : rating >= 55
        ? "100% a soundcloud user. You're not too bad, but you're not great either. You're just kinda there."
        : rating >= 45
        ? "Your taste is pretty mainstream, but you also appreciate some smaller artists. You may not be normal in many ways but at least your music taste is."
        : rating >= 30
        ? "My favourite artist is this really underground group called The Beatles, you should check them out."
        : rating >= 20
        ? "Do you only listen to artists who live in mansions? Your taste is very mainstream, try listening to something different once in a while."
        : rating >= 10
        ? "Your taste is so mainstream that it's almost offensive. Please listen to something new right now."
        : "How did you even get a score this low, I genuinely didn't know that was possible. You're definitely a lizard pretending to be a person. (Hi Zuck!)";
}
