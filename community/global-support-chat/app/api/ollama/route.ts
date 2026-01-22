import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { history, locale } = await request.json();

  // Construct a prompt from history
  // History is array of { role: 'user'|'agent', content: string }
  // We want the AI (which plays the 'user' in this simulation context? 
  // Wait, spec says "simulateUserReply". 
  // "AI Auto-Response": A toggleable AI mode where an LLM generates context-aware replies in the user's native language.
  // So the AI pretends to be the Customer (User).
  // The Agent (Real Human) is English.
  // So AI Prompt: "You are a customer communicating with support. Speak in {locale}. Here is the conversation..."
  
  const prompt = `Roleplay Instructions:
You are a customer communicating with a customer support agent.
- Your language is '${locale}'.
- Respond naturally to the support agent's last message in your language.
- Do NOT repeat your previous messages.
- If the agent asks a question, answer it directly.
- Keep your response concise (1-2 sentences).
- Act like a real person with a specific issue (e.g., login problem, refund, product question).

Conversation history:
${history.map((m: any) => `${m.role === 'agent' ? 'Support Agent' : 'Customer'}: ${m.content}`).join('\n')}

Response (as Customer):`;

  try {
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen3:4b', // Configurable, but using a reasonable default
        prompt,
        stream: false
      }),
    });

    if (!res.ok) {
        throw new Error(`Ollama status: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json({ reply: data.response });

  } catch (error) {
    console.error('Ollama Error:', error);
    return NextResponse.json({ 
        reply: `(AI Error: Ensure Ollama is running. Mock response in ${locale})` 
    });
  }
}
