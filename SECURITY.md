# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < Latest| :x:                |

We recommend always using the latest version of Lingo.dev to ensure you have the latest security updates.

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

We take the security of Lingo.dev seriously. If you believe you have found a security vulnerability, please report it to us responsibly.

### How to Report

1. **Email**: Send details to security@lingo.dev (or the maintainer's email if available)
2. **Discord**: Contact the maintainers privately on our [Discord server](https://lingo.dev/go/discord)
3. **GitHub Security Advisory**: Use GitHub's [private vulnerability reporting](https://github.com/lingodotdev/lingo.dev/security/advisories/new)

### What to Include

Please include the following information in your report:

- **Type of vulnerability** (e.g., XSS, SQL injection, authentication bypass)
- **Full paths of affected source files**
- **Location of the affected code** (tag/branch/commit or direct URL)
- **Step-by-step instructions to reproduce the issue**
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the vulnerability** (what an attacker could do)
- **Suggested fix** (if you have one)

### What to Expect

- **Acknowledgment**: We'll acknowledge receipt of your report within 48 hours
- **Updates**: We'll keep you informed about our progress
- **Timeline**: We aim to release a fix within 90 days of disclosure
- **Credit**: We'll credit you in the security advisory (unless you prefer to remain anonymous)

## Security Best Practices

When using Lingo.dev, follow these security best practices:

### API Keys
- **Never commit API keys** to version control
- Store API keys in environment variables or secure vaults
- Use `.env` files and add them to `.gitignore`
- Rotate API keys regularly
- Use different keys for development and production

### Configuration
- Review your `i18n.json` configuration for sensitive data
- Avoid including sensitive information in translation strings
- Use appropriate file permissions for configuration files

### Dependencies
- Keep Lingo.dev and its dependencies up to date
- Regularly run `pnpm audit` to check for vulnerabilities
- Review dependency updates before applying them

### CI/CD
- Secure your CI/CD secrets (e.g., `LINGODOTDEV_API_KEY`)
- Use GitHub's encrypted secrets for sensitive data
- Limit access to CI/CD configurations
- Review workflow permissions regularly

### LLM Provider Keys
When using LLM providers (Groq, Google, Mistral):
- Store provider API keys securely
- Never expose keys in client-side code
- Monitor API usage for anomalies
- Set up usage limits and alerts
- Revoke compromised keys immediately

## Known Security Considerations

### Translation Content
- Translations are processed by third-party LLM providers
- Avoid translating sensitive or confidential information
- Review translations before deploying to production
- Consider data residency requirements for your use case

### Network Security
- Lingo.dev makes API calls to LLM providers
- Ensure your network allows HTTPS connections
- Consider using a proxy for additional security
- Monitor outbound API traffic

## Security Updates

Security updates are released as soon as possible after a vulnerability is confirmed. Updates are announced through:

- GitHub Security Advisories
- Release notes
- Discord announcements
- Email notifications (for critical issues)

## Scope

This security policy applies to:

- Lingo.dev CLI (`packages/cli`)
- Lingo.dev Compiler (`packages/compiler`)
- Lingo.dev SDK (`packages/sdk`)
- Lingo.dev React package (`packages/react`)
- CI/CD integrations
- Official documentation and examples

## Out of Scope

The following are generally out of scope:

- Third-party LLM provider vulnerabilities (report to the provider)
- Social engineering attacks
- Physical attacks
- Denial of service attacks
- Issues in outdated versions

## Bug Bounty

We currently do not offer a paid bug bounty program, but we deeply appreciate security researchers who help keep Lingo.dev secure. We will:

- Publicly acknowledge your contribution (with your permission)
- Credit you in our security advisories
- Provide swag or recognition for significant findings

## Questions?

If you have questions about this security policy, please:
- Join our [Discord server](https://lingo.dev/go/discord)
- Open a discussion on GitHub
- Contact the maintainers

---

**Thank you for helping keep Lingo.dev and our community safe!** 🔒
