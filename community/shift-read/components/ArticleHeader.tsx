import { parsedDate } from '@/lib/utils'
import Image from 'next/image'

interface ArticleHeaderProps {
  title?: string
  author?: string
  date?: string
  image?: string
}

export default function ArticleHeader({
  title,
  author,
  date,
  image,
}: ArticleHeaderProps) {
  return (
    <header className="mb-8 pb-8 border-b border-border">
      {image && (
        <div className="relative w-full h-64 sm:h-96 mb-6 rounded-xl overflow-hidden">
          <Image
            src={image}
            alt={title || 'Article'}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>
      )}
      {title && (
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">{title}</h1>
      )}
      {(author || date) && (
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          {author && <span>By {author}</span>}
          {author && date && <span>•</span>}
          {date && <span>{parsedDate(date)}</span>}
        </div>
      )}
    </header>
  )
}
