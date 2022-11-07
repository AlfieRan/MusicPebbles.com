export function min(a: number, b: number) {
    return a < b ? a : b;
}

export function Sigmoid(x: number) {
    return 1 / (1 + Math.exp(-x));
}

export function uniqueSigmoid(x: number) {
    return Sigmoid(x / 100000);
}

export function parseRating(num: number): string {
    const lastDigit = num % 10;
    let ending = "th";

    if ((num < 10 || num > 20) && lastDigit === 1) {
        ending = "st";
    } else if ((num < 10 || num > 20) && lastDigit === 2) {
        ending = "nd";
    } else if ((num < 10 || num > 20) && lastDigit === 3) {
        ending = "rd";
    }

    return num + ending;
}
