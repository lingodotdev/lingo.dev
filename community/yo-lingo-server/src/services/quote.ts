export interface QuoteResponse {
  text: string;
  author: string;
  tags: string[];
  id: number;
  author_id: string;
}

const FALLBACK_QUOTES = [
  { id: 6, text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { id: 7, text: "So many books, so little time.", author: "Frank Zappa" },
  { id: 8, text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.", author: "Albert Einstein" },
  { id: 9, text: "A room without books is like a body without a soul.", author: "Marcus Tullius Cicero" }
];

export async function fetchRandomQuote() {
  try {
    const res = await fetch("https://thequoteshub.com/api/random-quote");
    if (!res.ok) throw new Error("Failed to fetch quote");

    const data = (await res.json()) as QuoteResponse;
    return {
      id: data.id,
      text: data.text,
      author: data.author,
    };
  } catch (error) {
    console.error("Quote fetch failed, using fallback:", error);
    return FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
  }
}
