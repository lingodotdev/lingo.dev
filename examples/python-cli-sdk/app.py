import os
import json
from dotenv import load_dotenv

load_dotenv()

try:
    from lingo_sdk import LingoClient
except ImportError:
    print("Error: The 'lingo-sdk' package is not installed. Please run 'pip install -r requirements.txt'")
    exit()

API_KEY = os.getenv("LINGO_API_KEY")

def load_static_content(locale="en"):
    file_path = f"locales/{locale}.json"
    if not os.path.exists(file_path):
        return {"error": f"File not found: {file_path}. Did you run 'npx lingo.dev run'?"}
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def translate_dynamic_content(text, target_locale):
    if not API_KEY:
        return "Error: LINGO_API_KEY environment variable is not set."

    try:
        client = LingoClient(api_key=API_KEY)
        response = client.translate(
            text=text,
            target_locale=target_locale,
            source_locale="en"
        )
        return response.get('translatedText', 'Translation result missing from SDK response.')
    except Exception as e:
        return f"Dynamic translation failed: {e}"

if __name__ == "__main__":
    translations_en = load_static_content("en")
    
    print("-" * 50)
    print(f"1. Static Content (CLI Workflow) - Source Language")
    print(f"Title: {translations_en.get('app_title', 'Error')}")
    print(f"Message: {translations_en.get('static_message', 'Error')}")
    print("-" * 50)

    translations_es = load_static_content("es")
    if "error" not in translations_es:
        print(f"1. Static Content (CLI Workflow) - Target Language (ES)")
        print(f"Message (ES): {translations_es.get('static_message')}")
        print("-" * 50)

    print("2. Dynamic Content (SDK Workflow)")
    user_input = input(f"{translations_en.get('prompt_user')} ")
    
    translated_text = translate_dynamic_content(user_input, "fr")
    
    print(f"Original Text: {user_input}")
    print(f"Translated (FR): {translated_text}")
    print("-" * 50)
