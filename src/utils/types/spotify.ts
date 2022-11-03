export interface imageType {
    height: number;
    url: string;
    width: number;
}

export interface artistType {
    ranking?: number;
    external_urls: {
        spotify: string;
    };
    followers: {
        href: null;
        total: number;
    };
    genres: string[];
    href: string;
    id: string;
    images: imageType[];
    name: string;
    popularity: number;
    type: string;
    uri: string;
}

export type artistsType = artistType[];

export const artistEmptyObject: artistType = {
    name: "",
    id: "",
    images: [],
    genres: [],
    popularity: 0,
    followers: {
        href: null,
        total: 0,
    },
    external_urls: {
        spotify: "",
    },
    href: "",
    type: "",
    uri: "",
};
