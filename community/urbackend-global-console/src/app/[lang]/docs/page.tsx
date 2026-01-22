import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function DocsPage() {
  const contentPath = path.join(process.cwd(), "src/content/docs.md");
  const fileContent = fs.readFileSync(contentPath, "utf8");
  const { content, data } = matter(fileContent);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href="/" className="inline-flex items-center text-[#888] hover:text-[#EDEDED] transition-colors mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="border-b border-[#1E1E1E] pb-6">
        <h1 className="text-4xl font-bold text-[#EDEDED] mb-3">{data.title}</h1>
        <p className="text-xl text-[#888]">{data.description}</p>
      </div>

      <div className="prose prose-invert max-w-none prose-headings:text-[#EDEDED] prose-p:text-[#CCC] prose-a:text-[#3ECF8E] prose-code:text-[#3ECF8E] prose-pre:bg-[#0F0F0F] prose-pre:border prose-pre:border-[#1E1E1E]">
        <MDXRemote source={content} />
      </div>
    </div>
  );
}
