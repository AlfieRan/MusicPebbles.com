import { artistType } from "./spotify";

export type SingleUniqueness = {
    rating: number;
    colour: string;
    details: string;
    artists: uniqueArtistWrapperType[];
};

export type Uniqueness = {
    short_term: SingleUniqueness;
    medium_term: SingleUniqueness;
    long_term: SingleUniqueness;
};

export interface uniqueArtistWrapperType {
    artist: artistType;
    uniqueness: number;
    userRating: number; // 0-50, 0 being the most listened to
}
