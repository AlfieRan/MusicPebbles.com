import { useEffect, useState } from "react";
import { artistType } from "../types/spotify";
import { getImageSize } from "../other/imageSize";

export function useArtists() {
    const [artists, setArtists] = useState<artistType[]>([]);

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/user/artists");
            const data = await response.json();
            let newArtists: artistType[] = [];

            for (let artist of data) {
                newArtists.push({
                    id: artist.id,
                    name: artist.name,
                    popularity: artist.popularity,
                    genres: artist.genres,
                    images: await wrapImages(artist.images),
                    followers: artist.followers,
                    external_urls: artist.external_urls,
                    href: artist.href,
                    uri: artist.uri,
                    type: artist.type,
                });
            }

            setArtists(newArtists);
        })().catch((err) => console.error(err));
    }, []);

    return artists;
}

async function wrapImages(images: any[]) {
    const newImages = images.map(async (image) => {
        const dims = await getImageSize(image.url, {
            width: image.width,
            height: image.height,
        });
        const max = Math.max(dims.width, dims.height);
        return {
            height: dims.height / max,
            width: dims.width / max,
            url: image.url,
        };
    });

    return Promise.all(newImages);
}
