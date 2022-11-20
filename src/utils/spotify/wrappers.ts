import {
    artistApiResponseType,
    artistType,
    songApiResponseType,
    songType,
} from "../types/spotify";
import { wrapImages } from "./other";

async function wrapSong(song: songType): Promise<songType> {
    return {
        ...song,
        album: { ...song.album, images: await wrapImages(song.album.images) },
    };
}

export async function wrapSongs(
    songs: songType[] | false
): Promise<songType[] | false> {
    if (!songs) return false;
    const newSongs: songType[] = [];

    for (let i = 0; i < songs.length; i++) {
        const song = songs[i];
        newSongs.push(await wrapSong(song));
    }

    return newSongs;
}

async function wrapArtist(artist: artistType): Promise<artistType> {
    return {
        ...artist,
        images: await wrapImages(artist.images),
    };
}

export async function wrapArtists(
    artists: artistType[] | false
): Promise<artistType[] | false> {
    if (!artists) return false;
    const newArtists: artistType[] = [];

    for (let i = 0; i < artists.length; i++) {
        const artist = artists[i];
        newArtists.push(await wrapArtist(artist));
    }

    return newArtists;
}

export async function wrapAllArtists(
    data: artistApiResponseType | undefined
): Promise<artistApiResponseType> {
    return {
        short_term:
            data !== undefined ? await wrapArtists(data.short_term) : false,
        medium_term:
            data !== undefined ? await wrapArtists(data.medium_term) : false,
        long_term:
            data !== undefined ? await wrapArtists(data.long_term) : false,
    };
}

export async function wrapAllSongs(
    data: songApiResponseType | undefined
): Promise<songApiResponseType> {
    return {
        short_term:
            data !== undefined ? await wrapSongs(data.short_term) : false,
        medium_term:
            data !== undefined ? await wrapSongs(data.medium_term) : false,
        long_term: data !== undefined ? await wrapSongs(data.long_term) : false,
    };
}
