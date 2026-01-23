import streamlit as st
from deep_translator import GoogleTranslator
st.set_page_config(page_title="Translator", page_icon="🌐", layout="centered")

st.title("🌐 Translator App")
st.caption("Type text and get translation instantly.")
st.divider()

text = st.text_area("Write text", height=120, placeholder="e.g., Hello how are you?")

lang = st.selectbox("Translate to", ["Urdu", "Hindi", "Arabic"])
target_map = {"Urdu": "ur", "Hindi": "hi", "Arabic": "ar"}
target = target_map[lang]

col1, col2 = st.columns(2)
with col1:
    do_translate = st.button("Translate ✅")
with col2:
    clear = st.button("Clear 🧹")
if clear:
    st.rerun()

if do_translate:
    if text.strip() == "":
        st.warning("Please write something first.")
    else:
        with st.spinner("Translating..."):
            translated = GoogleTranslator(source="auto", target=target).translate(text)
        st.success("Done!")
        st.text_area("Translation", value=translated, height=120)
        st.code(translated, language="text")

st.divider()
st.caption("Made with ❤️ using Streamlit")

