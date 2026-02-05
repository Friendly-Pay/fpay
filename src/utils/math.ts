export const toMinorUnits = (amount: number, minority: number): number => {
    return Math.round(amount * minority);
};

export const fromMinorUnits = (minorAmount: number, minority: number): number => {
    return minorAmount / minority;
};