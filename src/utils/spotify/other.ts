import { getImageSize } from "../other/imageSize";

export async function wrapImages(images: any[]) {
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

// export async function wrapImages(images: any[]) {
//     const newImages = images.map(async (image) => {
//         const max = Math.max(image.width, image.height);
//         return {
//             height: image.height / max,
//             width: image.width / max,
//             url: image.url,
//         };
//     });
//
//     return Promise.all(newImages);
// }
