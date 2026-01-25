import axios from "axios";

export async function translateObjectData(
    data: any,
    sourceLang: string,
    targetLang: string
): Promise<any> {
    const res = await axios.post("/api/translate", {
        data,
        sourceLang,
        targetLang,
    }, { timeout: 100000 });

    return res.data.data;
}
