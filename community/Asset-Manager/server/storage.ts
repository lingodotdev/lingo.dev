import { users, type User, type InsertUser, memes, type Meme, type InsertMeme } from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Meme operations
  createMeme(meme: InsertMeme): Promise<Meme>;
  getMemes(): Promise<Meme[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private memes: Map<number, Meme>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.memes = new Map();
    this.currentId = 1;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.toString();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    this.currentId++;
    return user;
  }

  async createMeme(insertMeme: InsertMeme): Promise<Meme> {
    const id = this.currentId++;
    const meme: Meme = {
      ...insertMeme,
      id,
      topPosition: insertMeme.topPosition ?? 10,
      bottomPosition: insertMeme.bottomPosition ?? 10,
      topXPosition: insertMeme.topXPosition ?? 50,
      bottomXPosition: insertMeme.bottomXPosition ?? 50,
      topFontSize: insertMeme.topFontSize ?? 32,
      bottomFontSize: insertMeme.bottomFontSize ?? 32,
    };
    this.memes.set(id, meme);
    return meme;
  }

  async getMemes(): Promise<Meme[]> {
    return Array.from(this.memes.values());
  }
}

export const storage = new MemStorage();
