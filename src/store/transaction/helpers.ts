export const calcServerTimeOffset = (serverTimeUnix: number) => {
    return serverTimeUnix * 1_000 - Date.now();
};