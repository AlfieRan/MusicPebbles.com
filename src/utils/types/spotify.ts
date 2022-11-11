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
    images: [
        {
            url: "/unknown.png",
            width: 400,
            height: 400,
        },
    ],
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

export type songType = {
    ranking?: number;
    album: {
        name: string;
        images: imageType[];
        release_date: string;
    };
    artists: { name: string }[];
    duration_ms: number;
    explicit: boolean;
    external_urls: {
        spotify: string;
    };
    href: string;
    name: string;
    popularity: number;
    preview_url: string;
};

export const songEmptyObject: songType = {
    album: {
        name: "",
        images: [
            {
                url: "/unknown.png",
                width: 400,
                height: 400,
            },
        ],
        release_date: "",
    },
    artists: [{ name: "" }],
    duration_ms: 0,
    explicit: false,
    external_urls: {
        spotify: "",
    },
    href: "",
    name: "",
    popularity: 0,
    preview_url: "",
};

export type timeFrameType = "short_term" | "medium_term" | "long_term";

export type artistApiResponseType = {
    short_term: artistsType | false;
    medium_term: artistsType | false;
    long_term: artistsType | false;
};

export type songApiResponseType = {
    short_term: songType[] | false;
    medium_term: songType[] | false;
    long_term: songType[] | false;
};
