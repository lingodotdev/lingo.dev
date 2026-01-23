import { BrainCircuit, Code, Wrench, Image } from 'lucide-react';

export const tools = [
  {
    id: 'documentation-generator',
    name: 'Documentation Generator',
    description: 'Automatically generate clear, concise, and user-friendly documentation for your Lingo tools.',
    icon: Wrench,
  },
  {
    id: 'topic-summarizer',
    name: 'Topic Summarizer',
    description: 'Summarize any text or topic into a few key points.',
    icon: BrainCircuit,
  },
];

export const comments = [
    {
        id: 1,
        author: 'Alice',
        avatar: 'https://picsum.photos/seed/avatar1/40/40',
        text: 'This NLP tool is amazing! It saved me hours of work.',
        timestamp: '2 hours ago',
    },
    {
        id: 2,
        author: 'Bob',
        avatar: 'https://picsum.photos/seed/avatar2/40/40',
        text: 'The code generation is a game-changer for prototyping. Could use more language options though.',
        timestamp: '5 hours ago',
    },
    {
        id: 3,
        author: 'Charlie',
        avatar: 'https://picsum.photos/seed/avatar3/40/40',
        text: 'Has anyone tried connecting the automated tool creator with the code generator? The possibilities seem endless!',
        timestamp: '1 day ago',
    },
];

export type Tool = (typeof tools)[0];
export type Comment = (typeof comments)[0];
