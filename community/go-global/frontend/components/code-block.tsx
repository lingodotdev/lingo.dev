"use client"

import { useEffect, useState } from "react"
import { codeToHtml } from "shiki"

interface CodeBlockProps {
    code: string
    lang?: string
}

export function CodeBlock({ code, lang = "html" }: CodeBlockProps) {
    const [html, setHtml] = useState<string>("")

    useEffect(() => {
        let cancelled = false

        codeToHtml(code, {
            lang,
            theme: "github-dark",
        }).then((highlighted) => {
            if (!cancelled) setHtml(highlighted)
        })

        return () => {
            cancelled = true
        }
    }, [code, lang])

    return (
        <div
            className="w-full overflow-auto text-sm"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    )
}
