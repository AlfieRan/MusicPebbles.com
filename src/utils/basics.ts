export function min(a: number, b: number) {
    return a < b ? a : b;
}

export function Sigmoid(x: number) {
    return 1 / (1 + Math.exp(-x));
}

export function uniqueSigmoid(x: number) {
    return Sigmoid(x / 100000);
}
