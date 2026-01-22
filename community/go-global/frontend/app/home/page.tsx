"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ModeToggle } from "@/components/mode-toggle"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Copy, Check } from "lucide-react"
import { CodeBlock } from "@/components/code-block"

const LANGUAGES = [
    { label: "es", value: "es" },
    { label: "es", value: "es1" },
    { label: "es", value: "es2" },
    { label: "es", value: "es43" },
    { label: "es", value: "es3" },
]

export default function Home() {
    const [url, setUrl] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [language, setLanguage] = useState<string | null>(null)
    const [status, setStatus] = useState<string | null>(null)
    const [html, setHtml] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const resetState = () => {
        setUrl("")
        setFile(null)
        setLanguage(null)
    }

    const handleUrlSubmit = async () => {
        if (!url || !language) {
            setStatus("URL and language are required")
            return
        }

        try {
            await fetch("/api/submit-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, language }),
            })

            setStatus("URL sent successfully")
            resetState()
        } catch {
            setStatus("Failed to send URL")
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0]
        if (!selected) return

        const allowed = [".tsx", ".jsx", ".html"]
        const isValid = allowed.some(ext => selected.name.endsWith(ext))

        if (!isValid) {
            setStatus("Only .tsx, .jsx or .html files are allowed")
            return
        }

        setFile(selected)
        setUrl("")
        setStatus(null)
    }

    const handleFileUpload = async () => {
        if (!file || !language) {
            setStatus("File and language are required")
            return
        }

        const formData = new FormData()
        formData.append("file", file)
        formData.append("language", language)

        try {
            const result = await fetch("/api/upload-file", {
                method: "POST",
                body: formData,
            })

            setStatus("File uploaded successfully")
            const data = await result.json();
            if (!result.ok) {
                setStatus(data.message || "Upload failed")
                return
            }
            setHtml(data.html)
            setStatus("File uploaded successfully")
            resetState()

        } catch {
            setStatus("File upload failed")
        }
    }

    return (
        <main className="container mx-auto max-w-4xl py-10 space-y-8">
            <div className="w-full flex justify-between">
                <h1 className="text-3xl font-semibold">
                    Translation Dashboard
                </h1>
                <ModeToggle />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Submit Website URL</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="url">Website URL</Label>
                        <Input
                            id="url"
                            type="url"
                            placeholder="https://example.com"
                            value={url}
                            onChange={(e) => {
                                setUrl(e.target.value)
                                setFile(null)
                            }}
                        />
                    </div>

                    {url && (
                        <div className="space-y-2">
                            <Label>Language</Label>
                            <Select onValueChange={setLanguage}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LANGUAGES.map(lang => (
                                        <SelectItem key={lang.value} value={lang.value}>
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <Button onClick={handleUrlSubmit}>
                        Send URL
                    </Button>
                </CardContent>
            </Card>

            <p className="w-full text-center">OR</p>
            <Card>
                <CardHeader>
                    <CardTitle>Upload Source File</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="file">Source File</Label>
                        <Input
                            id="file"
                            type="file"
                            accept=".tsx,.jsx,.html"
                            onChange={handleFileChange}
                        />
                    </div>

                    {file && (
                        <div className="space-y-2">
                            <Label>Language</Label>
                            <Select onValueChange={setLanguage}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LANGUAGES.map(lang => (
                                        <SelectItem key={lang.value} value={lang.value}>
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <Button onClick={handleFileUpload}>
                        Upload File
                    </Button>
                </CardContent>
            </Card>

            {status && (
                <p className="text-sm text-muted-foreground">
                    {status}
                </p>
            )}

            {html && (
                <Tabs defaultValue="preview" className="w-full">
                    <TabsList>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        <TabsTrigger value="code">Code</TabsTrigger>
                    </TabsList>

                    <TabsContent value="preview" className="mt-4">
                        <iframe
                            srcDoc={html}
                            className="w-full h-100 rounded-md border bg-white"
                            sandbox=""
                        />
                    </TabsContent>

                    <TabsContent value="code" className="mt-4 relative">
                        <CodeBlock code={html} lang="html" />

                        <Button
                            size="icon"
                            variant="secondary"
                            className="absolute top-2 right-2"
                            onClick={async () => {
                                await navigator.clipboard.writeText(html)
                                setCopied(true)
                                setTimeout(() => setCopied(false), 1500)
                            }}
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                        </Button>
                    </TabsContent>

                </Tabs>

            )}
        </main>
    )
}
