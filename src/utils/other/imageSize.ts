export async function getImageSize(
    src: string,
    override: { width: number; height: number }
): Promise<{ width: number; height: number }> {
    return new Promise<{ width: number; height: number }>((resolve) => {
        try {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                resolve({ width: img.width, height: img.height });
            };
        } catch (err) {
            resolve(override);
        }
    });
}
