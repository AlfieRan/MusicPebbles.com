import { audioPlayerType } from "../types/state";

export function wrapNames(
    audioPlayer: audioPlayerType,
    charLimit: number = 40
) {
    if (audioPlayer.playing !== undefined) {
        let newSong = audioPlayer.playing.name;
        if (newSong.length > charLimit) {
            newSong = newSong.substring(0, charLimit) + "...";
        }

        let newArtist = audioPlayer.playing.artists
            .map((artist) => artist.name)
            .join(", ");
        if (newArtist.length > charLimit) {
            newArtist = newArtist.substring(0, charLimit) + "...";
        }

        let newAlbum = audioPlayer.playing.album.name;
        if (newAlbum.length > charLimit) {
            newAlbum = newAlbum.substring(0, charLimit) + "...";
        }

        return {
            song: newSong,
            artist: newArtist,
            album: newAlbum,
        };
    } else {
        return {
            song: "No Song Playing",
            artist: "",
            album: "",
        };
    }
}
