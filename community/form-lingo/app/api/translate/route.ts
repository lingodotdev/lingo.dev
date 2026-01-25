import { lingoDotDev } from "@/lib/lingo-dot-dev";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { data, sourceLang, targetLang } = await req.json();

        console.log(data, sourceLang, targetLang);
        const res = await lingoDotDev.localizeObject(data, {
            sourceLocale: sourceLang,
            targetLocale: targetLang,
            fast: true
        });

        return NextResponse.json({ message: "Translation successful", data: res });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Translation failed" }, { status: 500 });
    }
}
