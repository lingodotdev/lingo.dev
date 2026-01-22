// ===================== DOM Elements =====================
const messageInput = document.querySelector(".message-input");
const chatBody = document.querySelector(".chatbot-body");
const sendMessage = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const previewImage = document.querySelector("#preview-image");
const cancelButton = document.querySelector("#file-cancel");
const fileUpload = document.querySelector("#file-upload");
const chatBotToggle = document.querySelector("#chatbot-toogle");
const closeChatBot = document.querySelector("#close-chatbot");
const languageSelector = document.querySelector("#language-selector");

// ===================== Translations =====================
const translations = {
  en: {
    welcome: "Hello! How can I help you?",
    send: "Send",
    thinking: "Thinking..."
  },
  hi: {
    welcome: "नमस्ते! मैं आपकी मदद कैसे कर सकता हूँ?",
    send: "भेजें",
    thinking: "सोच रहे हैं..."
  }
};

let currentLanguage = localStorage.getItem("chatbot-language") || "en";

// ===================== Translation Helper =====================
function t(key) {
  return translations[currentLanguage][key] || translations.en[key];
}

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem("chatbot-language", lang);
  languageSelector.value = lang;
}

// ===================== Chat State =====================
let chatHistory = [];
let userData = {
  message: null,
  file: { data: null, mime_type: null }
};

const initialHeight = messageInput.scrollHeight;

// ===================== Create Message Element =====================
function createMessageElement(content, ...classes) {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
}

// Gemini REST API Call
async function getBotResponse(incomingMessageDiv) {
  try {
    const API_KEY = "AIzaSyAD1WdiQlndRaayFLX3XTJk0SZNmeSmZEk"; 
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

    const languageInstruction = currentLanguage === "hi" 
      ? "Please respond in Hindi only." 
      : "Please respond in English only.";

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY
      },
      body: JSON.stringify({
        "contents": [
          { "parts": [{ "text": `${languageInstruction}\n\n${userData.message}` }] }
        ]
      })
    });

    const data = await res.json();

    // Log response for debugging
    console.log("API Response:", data);

    // ---------------- Safe parsing ----------------
    let botReply = "Sorry, I didn't understand.";

    if (data?.candidates?.length > 0) {
      const firstCandidate = data.candidates[0];
      if (firstCandidate?.content?.parts?.length > 0) {
        botReply = firstCandidate.content.parts.map(p => p.text || "").join("");
      }
    }

    // Check for errors in response
    if (data?.error) {
      botReply = "API Error: " + (data.error.message || "Unknown error");
    }

    incomingMessageDiv.querySelector(".message-text").textContent = botReply;
    chatHistory.push({ role: "model", text: botReply });

  } catch (error) {
    incomingMessageDiv.querySelector(".message-text").textContent = "Error: " + error.message;
  } finally {
    incomingMessageDiv.classList.remove("thinking");
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    userData.file = { data: null, mime_type: null };
  }
}

// ===================== Handle Outgoing Message =====================
function handleOutgoingMessage(e) {
  e.preventDefault();

  userData.message = messageInput.value.trim();
  if (!userData.message && !userData.file.data) return;

  const messageContent = `<div class="message-text"></div>
      ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attach" />` : ""}`;

  const outgoingDiv = createMessageElement(messageContent, "user-message");
  outgoingDiv.querySelector(".message-text").textContent = userData.message;
  chatBody.appendChild(outgoingDiv);
  messageInput.value = "";
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

  // Bot thinking
  setTimeout(() => {
    const incomingDiv = createMessageElement(
      `<div class="message-text thinking">${t('thinking')}</div>`,
      "bot-message",
      "thinking"
    );
    chatBody.appendChild(incomingDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

    getBotResponse(incomingDiv);
  }, 500);
}

// ===================== Event Listeners =====================
messageInput.addEventListener("keydown", e => {
  if (e.key === "Enter") handleOutgoingMessage(e);
});

sendMessage.addEventListener("click", handleOutgoingMessage);

messageInput.addEventListener("input", () => {
  messageInput.style.height = `${initialHeight}px`;
  messageInput.style.height = `${messageInput.scrollHeight}px`;
});

// ===================== File Upload =====================
fileUpload.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    fileUploadWrapper.querySelector("img").src = e.target.result;
    fileUploadWrapper.classList.add("file-uploaded");
    const base64String = e.target.result.split(",")[1];
    userData.file = { data: base64String, mime_type: file.type };
    fileInput.value = "";
  };
  reader.readAsDataURL(file);
});

cancelButton.addEventListener("click", () => {
  userData.file = { data: null, mime_type: null };
  fileUploadWrapper.querySelector("img").src = "";
  fileUploadWrapper.classList.remove("file-uploaded");
});

// ===================== Chatbot Toggle =====================
chatBotToggle.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);

closeChatBot.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
);

// ===================== Language Selector =====================
languageSelector.value = currentLanguage;
languageSelector.addEventListener("change", (e) => {
  setLanguage(e.target.value);
});
