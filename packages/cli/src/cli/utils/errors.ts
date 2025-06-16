export const docLinks = {
  i18nNotFound: "https://lingo.dev/cli",
  bucketNotFound: "https://lingo.dev/cli",
  authError: "https://lingo.dev/cli",
  localeTargetNotFound: "https://lingo.dev/cli",
  lockFiletNotFound: "https://lingo.dev/cli",
  failedReplexicaEngine: "https://lingo.dev/cli",
  placeHolderFailed: "https://lingo.dev/cli",
  translationFailed: "https://lingo.dev/cli",
  connectionFailed: "https://lingo.dev/cli",
  invalidType: "https://lingo.dev/cli",
  invalidPathPattern: "https://lingo.dev/cli",
  androidResouceError: "https://lingo.dev/cli",
  invalidBucketType: "https://lingo.dev/cli",
  invalidStringDict: "https://lingo.dev/cli",
};

type DocLinkKeys = keyof typeof docLinks;

export class CLIError extends Error {
  public readonly docUrl: string;

  constructor({ message, docUrl }: { message: string; docUrl: DocLinkKeys }) {
    super(message);
    this.docUrl = docLinks[docUrl];
    this.message = `${this.message}\n visit: ${this.docUrl}`;
  }
}
