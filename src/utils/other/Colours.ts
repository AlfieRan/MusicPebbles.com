export function fadeBetween(
    colourA: string,
    colourB: string,
    steps: number,
    step: number
): string {
    const stepRatio = step / steps;
    let result = "#";
    for (let i = 1; i < 4; i++) {
        result += wrapResult(
            getNewFadeValue(stepRatio, colourA, colourB, i).toString(16)
        );
    }
    return result;
}

function getNewFadeValue(
    stepRatio: number,
    colourA: string,
    colourB: string,
    step: number
): number {
    const dblStep = step * 2;
    return Math.floor(
        parseInt(colourA.substring(dblStep - 1, dblStep + 1), 16) *
            (1 - stepRatio) +
            parseInt(colourB.substring(dblStep - 1, dblStep + 1), 16) *
                stepRatio
    );
}

function wrapResult(inp: string) {
    if (inp.length === 1) {
        return "0" + inp;
    }
    return inp;
}
