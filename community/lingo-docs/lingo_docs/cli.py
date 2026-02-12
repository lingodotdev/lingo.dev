"""
lingo-docs: Translate markdown documentation to multiple languages using Lingo.dev
"""

import asyncio
import os
import re
from collections.abc import Callable
from pathlib import Path

import typer
from dotenv import load_dotenv
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from lingodotdev import LingoDotDevEngine

load_dotenv()

app = typer.Typer(
    name="lingo-docs",
    help="Translate markdown documentation to multiple languages using Lingo.dev",
    add_completion=False,
)
console = Console()

# Language display names for badges
LANG_NAMES = {
    "en": "English",
    "es": "Español",
    "fr": "Français",
    "de": "Deutsch",
    "ja": "日本語",
    "zh-CN": "简体中文",
    "zh-TW": "繁體中文",
    "ko": "한국어",
    "pt": "Português",
    "pt-BR": "Português (Brasil)",
    "it": "Italiano",
    "ru": "Русский",
    "ar": "العربية",
    "hi": "हिन्दी",
    "nl": "Nederlands",
    "pl": "Polski",
    "tr": "Türkçe",
    "vi": "Tiếng Việt",
    "th": "ไทย",
    "id": "Bahasa Indonesia",
}


def extract_code_blocks(content: str) -> tuple[str, list[str]]:
    """Extract code blocks and replace with placeholders to preserve them during translation."""
    code_blocks = []

    def replacer(match):
        code_blocks.append(match.group(0))
        return f"__CODE_BLOCK_{len(code_blocks) - 1}__"

    # Match fenced code blocks (``` or ~~~)
    pattern = r"(```[\s\S]*?```|~~~[\s\S]*?~~~)"
    processed = re.sub(pattern, replacer, content)
    return processed, code_blocks


def restore_code_blocks(content: str, code_blocks: list[str]) -> str:
    """Restore code blocks from placeholders."""
    for i, block in enumerate(code_blocks):
        content = content.replace(f"__CODE_BLOCK_{i}__", block)
    return content


def generate_badge(original_file: Path, languages: list[str], source_lang: str) -> str:
    """Generate a language selector badge line."""
    badges = []

    # Add source language first
    source_name = LANG_NAMES.get(source_lang, source_lang)
    badges.append(f"[{source_name}]({original_file.name})")

    # Add translated languages
    for lang in languages:
        lang_name = LANG_NAMES.get(lang, lang)
        filename = f"{original_file.stem}.{lang}{original_file.suffix}"
        badges.append(f"[{lang_name}]({filename})")

    return " | ".join(badges)


def validate_placeholders(translated: str, code_blocks: list[str]) -> bool:
    """Validate that all code block placeholders are present in translated content."""
    for i in range(len(code_blocks)):
        if f"__CODE_BLOCK_{i}__" not in translated:
            return False
    return True


async def translate_to_languages(
    content: str,
    source_locale: str,
    target_locales: list[str],
    api_key: str,
    on_progress: Callable[[str, str], None] | None = None,
) -> dict[str, str | Exception]:
    """Translate markdown content to multiple languages, preserving code blocks."""
    # Extract code blocks once
    processed_content, code_blocks = extract_code_blocks(content)

    results = {}

    async with LingoDotDevEngine({"api_key": api_key}) as engine:
        for locale in target_locales:
            if on_progress:
                on_progress(locale, "start")
            try:
                translated = await engine.localize_text(
                    processed_content,
                    {"source_locale": source_locale, "target_locale": locale},
                )
                # Validate that all placeholders are preserved
                if not validate_placeholders(translated, code_blocks):
                    raise ValueError("Translation corrupted code block placeholders")
                results[locale] = restore_code_blocks(translated, code_blocks)
                if on_progress:
                    on_progress(locale, "done")
            except Exception as e:
                results[locale] = e
                if on_progress:
                    on_progress(locale, "error")

    return results


def parse_languages(langs: str) -> list[str]:
    """Parse comma-separated language codes, removing duplicates while preserving order."""
    seen = set()
    result = []
    for lang in langs.split(","):
        lang = lang.strip()
        if lang and lang not in seen:
            seen.add(lang)
            result.append(lang)
    return result


def format_error(e: Exception) -> str:
    """Extract a clean, readable error message."""
    msg = str(e)
    # Handle HTML error pages from API
    if "<html" in msg.lower() or "<!doctype" in msg.lower():
        if "502" in msg or "Bad Gateway" in msg:
            return "API temporarily unavailable (502). Try again shortly."
        if "503" in msg or "Service Unavailable" in msg:
            return "API temporarily unavailable (503). Try again shortly."
        return "API error. Try again shortly."
    # Truncate long messages
    if len(msg) > 80:
        return msg[:77] + "..."
    return msg


@app.command()
def translate(
    file: Path = typer.Argument(..., help="Markdown file to translate", exists=True),
    langs: str = typer.Option(..., "--langs", "-l", help="Target languages (comma-separated, e.g., 'es,ja,zh-CN')"),
    source: str = typer.Option("en", "--source", "-s", help="Source language code"),
    add_badge: bool = typer.Option(False, "--badge", "-b", help="Add language selector badge to original file"),
):
    """Translate a markdown file to multiple languages using Lingo.dev."""

    api_key = os.environ.get("LINGODOTDEV_API_KEY")
    if not api_key:
        console.print(
            Panel(
                "[red]LINGODOTDEV_API_KEY not found![/red]\n\n"
                "Get your free API key:\n"
                "1. Sign up at [link=https://lingo.dev/en/auth]https://lingo.dev/en/auth[/link]\n"
                "2. Go to Projects → API key → Copy\n"
                "3. Add to .env file or export as environment variable",
                title="API Key Required",
                border_style="red",
            )
        )
        raise typer.Exit(1)

    target_languages = parse_languages(langs)
    if not target_languages:
        console.print("[red]No target languages specified![/red]")
        raise typer.Exit(1)

    content = file.read_text(encoding="utf-8")

    console.print()
    console.print(Panel(
        f"[bold]{file.name}[/bold] → {', '.join(target_languages)}",
        title="lingo-docs",
        subtitle="Powered by Lingo.dev",
        border_style="blue",
    ))
    console.print()

    results = []

    with console.status("[bold blue]Translating...[/bold blue]") as status:
        def on_progress(locale: str, state: str):
            lang_name = LANG_NAMES.get(locale, locale)
            if state == "start":
                status.update(f"[bold blue]Translating to {lang_name}...[/bold blue]")

        translations = asyncio.run(
            translate_to_languages(content, source, target_languages, api_key, on_progress)
        )

    for lang in target_languages:
        result = translations[lang]
        if isinstance(result, Exception):
            results.append({"lang": lang, "file": "-", "error": format_error(result)})
        else:
            output_file = file.parent / f"{file.stem}.{lang}{file.suffix}"
            output_file.write_text(result, encoding="utf-8")
            results.append({"lang": lang, "file": output_file.name, "error": None})

    # Show results table
    table = Table(title="Translation Results", border_style="blue")
    table.add_column("Language", style="cyan")
    table.add_column("Output File", style="green")
    table.add_column("Status")

    for result in results:
        lang_name = LANG_NAMES.get(result["lang"], result["lang"])
        status_icon = "[green]✓[/green]" if result["error"] is None else f"[red]✗ {result['error']}[/red]"
        table.add_row(lang_name, result["file"], status_icon)

    console.print(table)

    # Add badge if requested
    successful_langs = [r["lang"] for r in results if r["error"] is None]
    if add_badge and successful_langs:
        badge = generate_badge(file, successful_langs, source)
        console.print()
        console.print(Panel(
            f"[dim]Add this to your {file.name}:[/dim]\n\n{badge}",
            title="Language Badge",
            border_style="green",
        ))

        # Inject or update badge at top of original file
        badge_comment = f"<!-- lingo-docs-badge -->\n{badge}\n<!-- /lingo-docs-badge -->"
        badge_pattern = r"<!-- lingo-docs-badge -->.*?<!-- /lingo-docs-badge -->"
        if re.search(badge_pattern, content, re.DOTALL):
            # Update existing badge
            updated_content = re.sub(badge_pattern, badge_comment, content, flags=re.DOTALL)
            file.write_text(updated_content, encoding="utf-8")
            console.print(f"[green]✓[/green] Badge updated in {file.name}")
        else:
            # Insert new badge
            updated_content = badge_comment + "\n\n" + content
            file.write_text(updated_content, encoding="utf-8")
            console.print(f"[green]✓[/green] Badge added to {file.name}")

    console.print()


@app.command()
def badge(
    file: Path = typer.Argument(..., help="Original markdown file", exists=True),
    langs: str = typer.Option(..., "--langs", "-l", help="Languages to include (comma-separated)"),
    source: str = typer.Option("en", "--source", "-s", help="Source language code"),
):
    """Generate a language selector badge (without translating)."""
    target_languages = parse_languages(langs)
    badge_text = generate_badge(file, target_languages, source)

    console.print()
    console.print(Panel(
        badge_text,
        title="Language Badge",
        subtitle=f"For {file.name}",
        border_style="green",
    ))
    console.print()


if __name__ == "__main__":
    app()
