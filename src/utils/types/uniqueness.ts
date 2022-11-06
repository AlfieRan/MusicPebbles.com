import { artistType } from "./spotify";

export type Uniqueness = {
    rating: number;
    details: string;
    artists: uniqueArtistWrapperType[];
};

export interface uniqueArtistWrapperType {
    artist: artistType;
    uniqueness: number;
    userRating: number; // 0-50, 0 being the most listened to
}
