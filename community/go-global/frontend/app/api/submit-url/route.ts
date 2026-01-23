import { NextResponse } from "next/server";
import { lingoDotDev } from "@/config/lingo";
import puppeteer from 'puppeteer';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const url = formData.get("url") as string | null;
        const language = formData.get("language");

        if (!url) {
            return NextResponse.json(
                { message: "No url uploaded" },
                { status: 400 }
            );
        }

        if (!language) {
            return NextResponse.json(
                { message: "Language is required" },
                { status: 400 }
            );
        }

        let parsedUrl: URL;
        try {
            parsedUrl = new URL(url);
        } catch {
            return NextResponse.json(
                { message: "Invalid URL" },
                { status: 400 }
            );
        }

        const browser = await puppeteer.launch({
            headless: true
        });
        const page = await browser.newPage();
        await page.goto(`${parsedUrl}`, {
            waitUntil: "networkidle2",
            timeout: 60000
        });
        const htmlString = await page.content();
        await browser.close();


        // console.log(parsedUrl);
        // console.log(language);


        const translated = await lingoDotDev.localizeHtml(htmlString, {
            sourceLocale: "en",
            targetLocale: String(language),
        });

        return NextResponse.json({
            translated: translated,
            language: language,
            message: "HTML translated successfully",
        });

    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Translation failed";
        console.log(error);

        return NextResponse.json(
            { message },
            { status: 500 }
        );
    }
}
