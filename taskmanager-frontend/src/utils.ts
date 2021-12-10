export const tryParseJSONObject = (jsonString:string) => {
    try {
        const o = JSON.parse(jsonString);
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { }
    return undefined;
};