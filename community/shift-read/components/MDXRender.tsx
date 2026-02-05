"use client";

import ReactMarkdown from "react-markdown";

interface MDXRenderProps {
	content: string;
	className?: string;
}

export function MDXRender({
	content,
	className = "",
}: MDXRenderProps) {
	return (
		<div
			className={`mdx-content text-foreground ${className}`}
			style={{
				lineHeight: "1.75",
			}}
		>
			<ReactMarkdown
				components={{
					h1: ({ children }) => (
						<h1 className="my-4 font-bold text-3xl first:mt-0">{children}</h1>
					),
					h2: ({ children }) => (
						<h2 className="my-3 font-semibold text-2xl first:mt-0">
							{children}
						</h2>
					),
					h3: ({ children }) => (
						<h3 className="my-2 font-semibold text-xl first:mt-0">
							{children}
						</h3>
					),
					p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
					ul: ({ children }) => (
						<ul className="mb-4 list-outside list-disc space-y-1 pl-4">{children}</ul>
					),
					ol: ({ children }) => (
						<ol className="mb-4 list-outside list-decimal space-y-1 pl-4">
							{children}
						</ol>
					),
					li: ({ children }) => <li className="pl-1">{children}</li>,
					code: ({ children, className }) => {
						const isInline = !className;
						return isInline ? (
							<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
								{children}
							</code>
						) : (
							<code className={className}>{children}</code>
						);
					},
					pre: ({ children }) => (
						<pre className="mb-4 overflow-x-auto rounded-lg bg-muted p-4">
							{children}
						</pre>
					),
					blockquote: ({ children }) => (
						<blockquote className="my-4 border-muted-foreground border-l-4 pl-4 italic">
							{children}
						</blockquote>
					),
					a: ({ children, href }) => (
						<a
							href={href}
							className="text-primary underline hover:text-primary/80"
							target="_blank"
							rel="noopener noreferrer"
						>
							{children}
						</a>
					),
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}
