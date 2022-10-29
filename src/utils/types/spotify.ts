export interface imageType {
    height: number;
    url: string;
    width: number;
}

export interface artistType {
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
