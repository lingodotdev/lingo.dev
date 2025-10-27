import { Token, TokenType } from "./types";
import { unescapeString } from "./escape";

export class Parser {
  private tokens: Token[];
  private pos: number;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.pos = 0;
  }

  parse(): Record<string, string> {
    const result: Record<string, string> = {};

    while (this.pos < this.tokens.length) {
      const token = this.current();

      // Skip comments
      if (
        token.type === TokenType.COMMENT_SINGLE ||
        token.type === TokenType.COMMENT_MULTI
      ) {
        this.advance();
        continue;
      }

      // End of file
      if (token.type === TokenType.EOF) {
        break;
      }

      // Expect entry: STRING "=" STRING ";"
      if (token.type === TokenType.STRING) {
        const entry = this.parseEntry();
        if (entry) {
          result[entry.key] = entry.value;
        }
        continue;
      }

      // Skip unexpected tokens gracefully
      this.advance();
    }

    return result;
  }

  private parseEntry(): { key: string; value: string } | null {
    // Current token should be STRING (key)
    const keyToken = this.current();
    if (keyToken.type !== TokenType.STRING) {
      return null;
    }
    const key = keyToken.value;
    this.advance();

    // Expect '='
    if (!this.expect(TokenType.EQUALS)) {
      // Missing '=' - skip this entry
      return null;
    }

    // Expect STRING (value)
    const valueToken = this.current();
    if (valueToken.type !== TokenType.STRING) {
      // Missing value - skip this entry
      return null;
    }
    const rawValue = valueToken.value;
    this.advance();

    // Expect ';'
    if (!this.expect(TokenType.SEMICOLON)) {
      // Missing ';' - but still process the entry
      // (more forgiving)
    }

    // Unescape the value
    const value = unescapeString(rawValue);

    return { key, value };
  }

  private current(): Token {
    return this.tokens[this.pos];
  }

  private advance(): void {
    if (this.pos < this.tokens.length) {
      this.pos++;
    }
  }

  private expect(type: TokenType): boolean {
    if (this.current()?.type === type) {
      this.advance();
      return true;
    }
    return false;
  }
}
