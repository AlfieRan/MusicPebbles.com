import { useEffect, useState } from "react";
import {
    SingleUniqueness,
    uniqueArtistWrapperType,
    Uniqueness,
} from "../types/uniqueness";
import { useArtists } from "./useArtists";
import {
    artistEmptyObject,
    artistsType,
    artistType,
    timeFrameType,
} from "../types/spotify";
import { uniqueSigmoid } from "../other/basics";

const frequencyDependency = 0.35;
// controls how much the uniqueness rating is affected by how much the user has listened to an artist
// must be between 0 and 1
// decays exponentially, so at 0.5, the user's 50th artist has 7.7% of the effect of their 1st artist
// at 0.25, the user's 50th artist has 1.5% of the effect of their 1st artist, etc.

const emptyArtistUniqueObject = {
    artist: artistEmptyObject,
    uniqueness: 0,
    userRating: 0,
};

const emptyUnqiueObject = {
    rating: 50,
    colour: "#FFD700",
    details: getUniquenessDetails(50),
    artists: [
        emptyArtistUniqueObject,
        emptyArtistUniqueObject,
        emptyArtistUniqueObject,
        emptyArtistUniqueObject,
        emptyArtistUniqueObject,
    ],
};

export function useUniqueness(): Uniqueness {
    const [uniqueness, setUniqueness] = useState<Uniqueness>({
        short_term: emptyUnqiueObject,
        medium_term: emptyUnqiueObject,
        long_term: emptyUnqiueObject,
    });
    const [loading, setLoading] = useState({
        short_term: true,
        medium_term: true,
        long_term: true,
    });
    const [allArtists, _] = useArtists();

    useEffect(() => {
        // Medium length is the default and the first loaded, so do the calculations for that first
        setUniqueness((prevState) => ({
            ...prevState,
            medium_term: getUniquenessForTime(
                allArtists.medium_term !== false ? allArtists.medium_term : []
            ),
        }));
        // then move onto the other time periods
        setUniqueness((prevState) => ({
            ...prevState,
            short_term: getUniquenessForTime(
                allArtists.short_term !== false ? allArtists.short_term : []
            ),
            long_term: getUniquenessForTime(
                allArtists.long_term !== false ? allArtists.long_term : []
            ),
        }));
    }, [allArtists]);

    return uniqueness;
}

function getUniquenessForTime(artists: artistsType): SingleUniqueness {
    const sortedArtists = sortArtistsByUniqueness(artists);

    const portionOfArtists = sortedArtists.length * frequencyDependency;
    const exponentialFactor = (portionOfArtists - 1) / portionOfArtists;

    const sum = sortedArtists.reduce(
        (acc, artist) =>
            acc + artist.uniqueness * exponentialFactor ** artist.userRating,
        0
    );
    const rating = Math.ceil(sum / portionOfArtists);
    return {
        rating,
        colour: getUniquenessColour(rating),
        details: getUniquenessDetails(rating, artists),
        artists: sortedArtists,
    };
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
    return 0.005 * popularity ** 2 + 0.5 * popularity;
}

function getUniquenessDetails(rating: number, artists?: artistsType): string {
    return rating >= 90
        ? "Okay you definitely only listen to your own music, have fun with that. Weirdo."
        : rating >= 80
        ? "Do you only listen to artists who live in caves? Your taste is way too underground for any normal person, please just go outside."
        : rating >= 70
        ? "You definitely do something with computers for a living, probably modding discord servers. You're a little too niche for me."
        : rating >= 60
        ? "Your taste is pretty underground, but you're not too far gone. Stay off tiktok and you might be somewhat tolerable."
        : rating >= 55
        ? "100% a soundcloud user. You're not too bad, but you're not great either. You're just kinda there."
        : rating >= 45
        ? "Your taste is pretty mainstream, but you also appreciate some smaller artists. You may not be normal in many ways but at least your music taste is."
        : rating >= 35
        ? `"My favourite artist is this really underground group called ${
              artists !== undefined ? artists[0].name : "The Beatles"
          }, you should check them out." You're pretty normal, but you're also pretty boring.`
        : rating >= 25
        ? "Do you only listen to artists who live in mansions? Your taste is very mainstream, try listening to something different once in a while."
        : rating >= 15
        ? "Your taste is so mainstream that it's almost offensive. Please listen to something new right now."
        : "How did you even get a score this low, I genuinely didn't know that was possible. You're definitely a lizard pretending to be a person. (Hi Zuckberg!)";
}

function getUniquenessColour(rating: number): string {
    const max = "#00ffdf";
    const min = "#9f1d1d";

    const r = blendBetweenHex(min.substring(1, 3), max.substring(1, 3), rating);
    const g = blendBetweenHex(min.substring(3, 5), max.substring(3, 5), rating);
    const b = blendBetweenHex(min.substring(5, 7), max.substring(5, 7), rating);

    return `#${r}${g}${b}`;
}

function blendBetweenHex(a: string, b: string, percent: number) {
    return Math.floor(
        parseInt(a, 16) * (percent / 100) +
            parseInt(b, 16) * (1 - percent / 100)
    ).toString(16);
}
