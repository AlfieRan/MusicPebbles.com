import { useEffect, useState } from "react";
import {
    SingleUniqueness,
    uniqueArtistWrapperType,
    Uniqueness,
} from "../types/uniqueness";
import {
    artistApiResponseType,
    artistEmptyObject,
    artistsType,
    artistType,
} from "../types/spotify";
import { shortString, uniqueSigmoid } from "../other/basics";
import { fadeBetween } from "../other/Colours";

const frequencyDependency = 0.35;
const artistPopularityVariation = 0.25;
const maxPopularity = 80;
const artistPopularityVariationSquare =
    (maxPopularity - artistPopularityVariation * 100) / 10000;

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

export type useUniquenessType = {
    uniqueness: Uniqueness;
    loading: {
        short_term: boolean;
        medium_term: boolean;
        long_term: boolean;
    };
    setArtists: (artists: artistApiResponseType) => void;
};

export function useUniqueness(): useUniquenessType {
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
    const [allArtists, setAllArtists] = useState<artistApiResponseType>({
        short_term: false,
        long_term: false,
        medium_term: false,
    });

    function setArtists(newArtists: artistApiResponseType) {
        setAllArtists(newArtists);
    }

    useEffect(() => {
        setLoading({
            short_term: true,
            medium_term: true,
            long_term: true,
        });
        // Medium length is the default and the first loaded, so do the calculations for that first
        setUniqueness((prevState) => ({
            ...prevState,
            medium_term: getUniquenessForTime(
                allArtists.medium_term !== false ? allArtists.medium_term : []
            ),
        }));
        setLoading({
            short_term: true,
            medium_term: false,
            long_term: true,
        });
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
        setLoading({
            short_term: false,
            medium_term: false,
            long_term: false,
        });
    }, [allArtists]);

    return { uniqueness, loading, setArtists };
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
        details: getUniquenessDetails(
            rating,
            sortedArtists.map((artist) => artist.artist)
        ),
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
    return (
        artistPopularityVariationSquare * popularity ** 2 +
        artistPopularityVariation * popularity
    );
}

function getUniquenessDetails(rating: number, artists?: artistsType): string {
    return rating >= 90
        ? "Okay you definitely only listen to your own music, have fun with that. Weirdo."
        : rating >= 80
        ? "Do you only listen to artists who live in caves? Your taste is way too underground for any normal person, please just go outside."
        : rating >= 70
        ? "You definitely do something with computers for a living, probably modding discord servers. You're a little too niche for me."
        : rating >= 65
        ? "Okay, you're a little too niche for me, but I can see why you like this music. Just please don't tell me you're a reddit user."
        : rating >= 60
        ? "Your taste is pretty underground, but you're not too far gone. Stay off tiktok and you might be somewhat tolerable."
        : rating >= 55
        ? `Your taste is pretty mainstream, but you appear to be a human. Your music taste is probably the only normal thing about you.`
        : rating >= 50
        ? "Okay, you're pretty normal. kind of boring, but normal. Maybe try listening to some music that's not on the radio."
        : rating >= 45
        ? "You're a little too mainstream for me, try listening to some artists that don't have a Wikipedia page."
        : rating >= 40
        ? "Wow, you're really mainstream. You probably listen to the radio, and are either over 35 or upper class 🥲 (if so, please donate!)"
        : rating >= 35
        ? `"My favourite artist is this really underground group called ${getShortTopArtist(
              artists
          )}, you should check them out." - You, probably.`
        : rating >= 25
        ? "Do you only listen to artists who live in mansions? Your taste is very mainstream, try listening to something different once in a while."
        : rating >= 15
        ? "Your taste is so mainstream that it's almost offensive. Please listen to something new right now."
        : "How did you even get a score this low, I genuinely didn't know that was possible. Are you Mark Zuckerberg?";
}

function getUniquenessColour(rating: number): string {
    return fadeBetween("#ff0000", "#11ff00", 100, rating);
}

function getShortTopArtist(artists: artistsType | undefined) {
    if (artists === undefined) return "The Beatles";

    let topArtist = "The Beatles";
    for (let i = 1; i < Math.min(artists.length, 5); i++) {
        if (artists[i].name.length < 30) topArtist = artists[i].name;
    }

    return topArtist;
}
