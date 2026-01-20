export enum TokenType {
  COMMENT_SINGLE = "COMMENT_SINGLE",
  COMMENT_MULTI = "COMMENT_MULTI",
  STRING = "STRING",
  EQUALS = "EQUALS",
  SEMICOLON = "SEMICOLON",
  EOF = "EOF",
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export interface Position {
  line: number;
  column: number;
}
