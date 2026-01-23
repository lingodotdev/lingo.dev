from flask import Flask, render_template, request
import requests

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    translated_text = ""

    if request.method == "POST":
        text = request.form["text"]
        source = request.form["source"]
        target = request.form["target"]

        # 🔴 Lingo.dev API call (replace API key)
        url = "https://api.lingo.dev/translate"
        headers = {
            "Authorization": "Bearer YOUR_LINGO_API_KEY",
            "Content-Type": "application/json"
        }
        payload = {
            "text": text,
            "source": source,
            "target": target
        }

        try:
            response = requests.post(url, json=payload, headers=headers)
            data = response.json()
            translated_text = data.get("translation", "Translation failed")
        except:
            translated_text = "Error connecting to Lingo.dev API"

    return render_template("index.html", translated=translated_text)

if __name__ == "__main__":
    app.run(debug=True)
