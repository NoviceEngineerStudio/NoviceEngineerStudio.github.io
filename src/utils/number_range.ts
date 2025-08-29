export default interface NumberRange {
    low: number;
    high?: number | "+";
}

export function rangeToText(
    range: NumberRange,
    valPrefix: string = ""
): string {
    let result: string = `${valPrefix}${range.low}`;

    switch (range.high) {
        case undefined:
            break;
        case "+":
            result += range.high;
            break;
        default:
            result += ` - ${valPrefix}${range.high}`;
            break;
    }

    return result;
}