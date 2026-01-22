export interface JokeResponse {
  id: number;
  joke: string;
  category: string;
}

const FALLBACK_JOKES = [
  { id: 1, text: "Why don't scientists trust atoms? Because they make up everything!", author: "Science" },
  { id: 2, text: "I'm on a whiskey diet. I've lost three days already.", author: "Tommy Cooper" },
  { id: 3, text: "What do you call a fake noodle? An Impasta.", author: "Foodie" },
  { id: 4, text: "Parallel lines have so much in common. It's a shame they'll never meet.", author: "Geometry" },
  { id: 5, text: "I told my wife she was drawing her eyebrows too high. She looked surprised.", author: "Unknown" }
];

export async function fetchRandomJoke() {
  try {
    const res = await fetch("https://v2.jokeapi.dev/joke/Any?type=single");
    if (!res.ok) throw new Error("Failed to fetch joke");

    const data = (await res.json()) as JokeResponse;
    return {
      id: data.id,
      text: data.joke,
      author: data.category,
    };
  } catch (error) {
    console.error("Joke fetch failed, using fallback:", error);
    return FALLBACK_JOKES[Math.floor(Math.random() * FALLBACK_JOKES.length)];
  }
}
