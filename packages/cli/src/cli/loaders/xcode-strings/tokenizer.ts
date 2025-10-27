import { Token, TokenType, Position } from "./types";

export class Tokenizer {
  private input: string;
  private pos: number;
  private line: number;
  private column: number;

  constructor(input: string) {
    this.input = input;
    this.pos = 0;
    this.line = 1;
    this.column = 1;
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.pos < this.input.length) {
      const char = this.current();

      // Skip whitespace
      if (this.isWhitespace(char)) {
        this.advance();
        continue;
      }

      // Handle comments
      if (char === "/" && this.peek() === "/") {
        tokens.push(this.scanSingleLineComment());
        continue;
      }

      if (char === "/" && this.peek() === "*") {
        tokens.push(this.scanMultiLineComment());
        continue;
      }

      // Handle strings
      if (char === '"') {
        tokens.push(this.scanString());
        continue;
      }

      // Handle operators
      if (char === "=") {
        tokens.push(this.makeToken(TokenType.EQUALS, "="));
        this.advance();
        continue;
      }

      if (char === ";") {
        tokens.push(this.makeToken(TokenType.SEMICOLON, ";"));
        this.advance();
        continue;
      }

      // Unexpected character - skip it
      // (More forgiving than throwing error)
      this.advance();
    }

    tokens.push(this.makeToken(TokenType.EOF, ""));
    return tokens;
  }

  private scanString(): Token {
    const start = this.getPosition();
    let value = "";

    this.advance(); // Skip opening "

    while (this.pos < this.input.length) {
      const char = this.current();

      if (char === "\\") {
        // Escape sequence - preserve both \ and next char
        this.advance();
        if (this.pos < this.input.length) {
          const nextChar = this.current();
          value += "\\" + nextChar;
          this.advance();
        }
        continue;
      }

      if (char === '"') {
        // End of string
        this.advance(); // Skip closing "
        return {
          type: TokenType.STRING,
          value,
          ...start,
        };
      }

      // Regular character (including actual newlines)
      value += char;
      this.advance();
    }

    // Unterminated string - return what we have
    return {
      type: TokenType.STRING,
      value,
      ...start,
    };
  }

  private scanSingleLineComment(): Token {
    const start = this.getPosition();
    let value = "";

    this.advance(); // Skip first '/'
    this.advance(); // Skip second '/'

    while (this.pos < this.input.length && this.current() !== "\n") {
      value += this.current();
      this.advance();
    }

    return {
      type: TokenType.COMMENT_SINGLE,
      value,
      ...start,
    };
  }

  private scanMultiLineComment(): Token {
    const start = this.getPosition();
    let value = "";

    this.advance(); // Skip '/'
    this.advance(); // Skip '*'

    while (this.pos < this.input.length) {
      if (this.current() === "*" && this.peek() === "/") {
        this.advance(); // Skip '*'
        this.advance(); // Skip '/'
        return {
          type: TokenType.COMMENT_MULTI,
          value,
          ...start,
        };
      }

      value += this.current();
      this.advance();
    }

    // Unterminated comment - return what we have
    return {
      type: TokenType.COMMENT_MULTI,
      value,
      ...start,
    };
  }

  private current(): string {
    return this.input[this.pos];
  }

  private peek(): string | null {
    if (this.pos + 1 < this.input.length) {
      return this.input[this.pos + 1];
    }
    return null;
  }

  private advance(): void {
    if (this.pos < this.input.length) {
      if (this.current() === "\n") {
        this.line++;
        this.column = 1;
      } else {
        this.column++;
      }
      this.pos++;
    }
  }

  private isWhitespace(char: string): boolean {
    return char === " " || char === "\t" || char === "\n" || char === "\r";
  }

  private getPosition(): Position {
    return {
      line: this.line,
      column: this.column,
    };
  }

  private makeToken(type: TokenType, value: string): Token {
    return {
      type,
      value,
      ...this.getPosition(),
    };
  }
}
