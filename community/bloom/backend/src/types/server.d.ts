export interface ServerResponse {
    success: boolean;
    message: string;
    data: any
}

export interface User {
    id: string;
    displayName: string;
    email: string,
    createdAt: Date,
    lastLogin: Date,
    status: "online" | "offline" | "matched",
    connectedEmails: string[],
    connectedWith: string | null,
    connectionId: string | null,
    emotionalScore: number,
    emotionalLevel: "Calm" | "Balanced" | "Stressed"
}

export interface Conversation {
    id: string;
    userId: string
    messages: Message[] 
    createdAt: Date
}

export enum Role {
  user,
  model
}

export interface Message {
  id: string;
  conversationId: string;
  parts: Part[];
  role: Role;
  timeStamp: Date;
}