"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Copy, Check, Globe, FileCode, Upload, Link2, Loader2, Download, Eye, Code2, Sparkles, AlertCircle } from "lucide-react"
import { CodeBlock } from "@/components/code-block"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

const LANGUAGES = [
    { label: "Spanish", value: "es", flag: "🇪🇸" },
    { label: "French", value: "fr", flag: "🇫🇷" },
    { label: "German", value: "de", flag: "🇩🇪" },
    { label: "Portuguese", value: "pt", flag: "🇵🇹" },
    { label: "Italian", value: "it", flag: "🇮🇹" },
    { label: "Japanese", value: "ja", flag: "🇯🇵" },
    { label: "Chinese", value: "zh", flag: "🇨🇳" },
]

export default function Home() {
    const [url, setUrl] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [language, setLanguage] = useState<string | null>(null)
    const [status, setStatus] = useState<string | null>(null)
    const [html, setHtml] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const [loading, setLoading] = useState(false)
    const [inputMethod, setInputMethod] = useState<"url" | "file">("url")

    const resetState = () => {
        setUrl("")
        setFile(null)
        setLanguage(null)
        setStatus(null)
    }

    const handleUrlSubmit = async () => {
        if (!url || !language) {
            setStatus("error:URL and language are required")
            return
        }

        setLoading(true)
        const formData = new FormData()
        formData.append("url", url)
        formData.append("language", language)

        try {
            const result = await fetch("/api/submit-url", {
                method: "POST",
                body: formData,
            })

            const data = await result.json()
            setHtml(data.translated)
            setStatus("success:Translation completed successfully!")
        } catch (error) {
            console.log(error)
            setStatus("error:Failed to translate URL")
        } finally {
            setLoading(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0]
        if (!selected) return

        const allowed = [".tsx", ".jsx", ".html"]
        const isValid = allowed.some(ext => selected.name.endsWith(ext))

        if (!isValid) {
            setStatus("error:Only .tsx, .jsx or .html files are allowed")
            return
        }

        setFile(selected)
        setUrl("")
        setStatus(null)
    }

    const handleFileUpload = async () => {
        if (!file || !language) {
            setStatus("error:File and language are required")
            return
        }

        setLoading(true)
        const formData = new FormData()
        formData.append("file", file)
        formData.append("language", language)

        try {
            const result = await fetch("/api/upload-file", {
                method: "POST",
                body: formData,
            })

            const data = await result.json()
            if (!result.ok) {
                setStatus(`error:${data.message || "Upload failed"}`)
                return
            }
            setHtml(data.html)
            setStatus("success:File translated successfully!")
        } catch {
            setStatus("error:File upload failed")
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = () => {
        if (!html) return
        const blob = new Blob([html], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `translated-${language}.html`
        a.click()
        URL.revokeObjectURL(url)
    }

    const statusType = status?.split(":")[0]
    const statusMessage = status?.split(":")[1]

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="container mx-auto max-w-6xl py-8 px-4 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Globe className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold text-foreground">
                                Translation Dashboard
                            </h1>
                        </div>
                        <p className="text-muted-foreground">
                            Translate your web content into multiple languages instantly
                        </p>
                    </div>
                    <ModeToggle />
                </div>

                {/* Input Method Toggle */}
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            Choose Input Method
                        </CardTitle>
                        <CardDescription>
                            Select how you&apos;d like to provide your content
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={inputMethod} onValueChange={(v) => setInputMethod(v as "url" | "file")} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="url" className="gap-2">
                                    <Link2 className="w-4 h-4" />
                                    Website URL
                                </TabsTrigger>
                                <TabsTrigger value="file" className="gap-2">
                                    <FileCode className="w-4 h-4" />
                                    Upload File
                                </TabsTrigger>
                            </TabsList>

                            {/* URL Input Tab */}
                            <TabsContent value="url" className="space-y-4 mt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="url" className="text-base font-medium">
                                        Website URL
                                    </Label>
                                    <div className="relative">
                                        <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="url"
                                            type="url"
                                            placeholder="https://example.com"
                                            className="pl-10 h-12"
                                            value={url}
                                            onChange={(e) => {
                                                setUrl(e.target.value)
                                                setFile(null)
                                                setStatus(null)
                                            }}
                                        />
                                    </div>
                                </div>

                                {url && (
                                    <>
                                        <div className="space-y-2">
                                            <Label className="text-base font-medium">Target Language</Label>
                                            <Select onValueChange={setLanguage}>
                                                <SelectTrigger className="h-12">
                                                    <SelectValue placeholder="Select target language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {LANGUAGES.map(lang => (
                                                        <SelectItem key={lang.value} value={lang.value}>
                                                            <span className="flex items-center gap-2">
                                                                <span>{lang.flag}</span>
                                                                <span>{lang.label}</span>
                                                            </span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button
                                            onClick={handleUrlSubmit}
                                            className="w-full h-12 text-base"
                                            disabled={!language || loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Translating...
                                                </>
                                            ) : (
                                                <>
                                                    <Globe className="w-4 h-4 mr-2" />
                                                    Translate Website
                                                </>
                                            )}
                                        </Button>
                                    </>
                                )}
                            </TabsContent>

                            {/* File Upload Tab */}
                            <TabsContent value="file" className="space-y-4 mt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="file" className="text-base font-medium">
                                        Source File
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="file"
                                            type="file"
                                            accept=".tsx,.jsx,.html"
                                            onChange={handleFileChange}
                                            className="h-12 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:opacity-90"
                                        />
                                    </div>
                                    {file && (
                                        <Badge variant="secondary" className="mt-2">
                                            <FileCode className="w-3 h-3 mr-1" />
                                            {file.name}
                                        </Badge>
                                    )}
                                </div>

                                {file && (
                                    <>
                                        <div className="space-y-2">
                                            <Label className="text-base font-medium">Target Language</Label>
                                            <Select onValueChange={setLanguage}>
                                                <SelectTrigger className="h-12">
                                                    <SelectValue placeholder="Select target language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {LANGUAGES.map(lang => (
                                                        <SelectItem key={lang.value} value={lang.value}>
                                                            <span className="flex items-center gap-2">
                                                                <span>{lang.flag}</span>
                                                                <span>{lang.label}</span>
                                                            </span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button
                                            onClick={handleFileUpload}
                                            className="w-full h-12 text-base"
                                            disabled={!language || loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Translating...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    Translate File
                                                </>
                                            )}
                                        </Button>
                                    </>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Status Alert */}
                {status && (
                    <Alert variant={statusType === "error" ? "destructive" : "default"} className="border-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="font-medium">
                            {statusMessage}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Results Section */}
                {html && (
                    <Card className="border-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2">
                                        <Check className="w-5 h-5 text-primary" />
                                        Translation Complete
                                    </CardTitle>
                                    <CardDescription>
                                        Your content has been translated to {LANGUAGES.find(l => l.value === language)?.label}
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
                                    <Download className="w-4 h-4" />
                                    Download HTML
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="preview" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="preview" className="gap-2">
                                        <Eye className="w-4 h-4" />
                                        Preview
                                    </TabsTrigger>
                                    <TabsTrigger value="code" className="gap-2">
                                        <Code2 className="w-4 h-4" />
                                        Source Code
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="preview" className="mt-4">
                                    <div className="rounded-lg border-2 overflow-hidden bg-white dark:bg-zinc-950">
                                        <div className="bg-muted px-4 py-2 border-b flex items-center gap-2">
                                            <div className="flex gap-1.5">
                                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            </div>
                                            <span className="text-xs text-muted-foreground ml-2">Preview</span>
                                        </div>
                                        <iframe
                                            srcDoc={html}
                                            className="w-full h-[600px] bg-white"
                                            sandbox=""
                                            title="Translation Preview"
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="code" className="mt-4 relative">
                                    <div className="rounded-lg border-2 overflow-hidden">
                                        <div className="bg-muted px-4 py-2 border-b flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground">HTML</span>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 gap-2"
                                                onClick={async () => {
                                                    await navigator.clipboard.writeText(html)
                                                    setCopied(true)
                                                    setTimeout(() => setCopied(false), 1500)
                                                }}
                                            >
                                                {copied ? (
                                                    <>
                                                        <Check className="w-3 h-3" />
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3 h-3" />
                                                        Copy
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                        <div className="max-h-[600px] overflow-auto">
                                            <CodeBlock code={html} lang="html" />
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                )}

                {/* Empty State */}
                {!html && !loading && (
                    <Card className="border-dashed border-2">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Globe className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No Translation Yet</h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                Enter a URL or upload a file above to get started with your translation
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}