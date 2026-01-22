const form = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const fileNameHint = document.getElementById("fileNameHint");
const sourceLanguage = document.getElementById("sourceLanguage");
const targetLanguage = document.getElementById("targetLanguage");
const errorBanner = document.getElementById("formError");
const successBanner = document.getElementById("successBanner");
const loadingState = document.getElementById("loadingState");
const submitButton = document.getElementById("submitButton");
const resetButton = document.getElementById("resetButton");
const languageList = document.getElementById("languageList");
const POPULAR_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "zh", label: "Chinese" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "ur", label: "Urdu" },
  { code: "vi", label: "Vietnamese" },
  { code: "tr", label: "Turkish" },
  { code: "ta", label: "Tamil" },
  { code: "sr", label: "Serbian" },
  { code: "hu", label: "Hungarian" },
  { code: "he", label: "Hebrew" },
  { code: "et", label: "Estonian" },
  { code: "el", label: "Greek" },
];

// Keep client-side validation in sync with backend upload constraints.
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ACCEPTED_EXTENSIONS = ["pdf", "docx"];
// Remember the live language list so resets keep parity with the backend.
let availableLanguages = [];

document.addEventListener("DOMContentLoaded", () => {
  renderLanguageTags();
  hydrateLanguages();
  form?.addEventListener("submit", handleSubmit);
  resetButton?.addEventListener("click", resetForm);
  fileInput?.addEventListener("change", handleFileChange);
});

// Prefer the backend list of languages; gracefully fall back to defaults.
async function hydrateLanguages() {
  try {
    const response = await fetch("/api/v1/translate/supported-languages");
    if (!response.ok) return; // Use defaults silently

    const payload = await response.json();
    const languages = payload?.data?.languages;
    if (!Array.isArray(languages) || languages.length === 0) return;

    availableLanguages = languages;

    // Populate selects from live list to stay in sync with backend
    sourceLanguage.innerHTML =
      "<option value='' disabled selected>Select source</option>";
    targetLanguage.innerHTML =
      "<option value='' disabled selected>Select target</option>";

    languages.forEach(({ code, label }) => {
      const optA = new Option(label, code);
      const optB = new Option(label, code);
      sourceLanguage.appendChild(optA);
      targetLanguage.appendChild(optB);
    });

    renderLanguageTags();
  } catch (err) {
    // Network failures should not block the form; defaults remain available.
    renderLanguageTags();
  }
}

function renderLanguageTags() {
  if (!languageList) return;
  const list = POPULAR_LANGUAGES;
  languageList.innerHTML = "";

  list.forEach(({ code, label }) => {
    const badge = document.createElement("button");
    badge.type = "button";
    badge.className =
      "inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:ring-emerald-300 hover:text-emerald-700 transition";
    badge.textContent = `${label} (${code})`;
    badge.addEventListener("click", () =>
      handleLanguageQuickSelect(code, label),
    );
    languageList.appendChild(badge);
  });
}

// Submit the form, stream the PDF response, and trigger a download.
async function handleSubmit(event) {
  event.preventDefault();
  clearStatus();

  const validationError = validateForm();
  if (validationError) {
    showError(validationError);
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  formData.append("sourceLanguage", sourceLanguage.value);
  formData.append("targetLanguage", targetLanguage.value);

  setLoading(true);

  try {
    const response = await fetch("/api/v1/translate", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message =
        errorData?.message || "Translation failed. Please try again.";
      throw new Error(message);
    }

    const filename =
      getFilenameFromHeaders(response.headers) || "translated-resume.pdf";
    await downloadPdf(response, filename);
    showSuccess(`✅ Your PDF is downloading as ${filename}`);
  } catch (err) {
    showError(err.message || "Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
}

// Guardrails to avoid unnecessary requests to the API.
function validateForm() {
  const file = fileInput.files[0];
  if (!file) return "Please upload a resume file.";

  const extension = file.name.split(".").pop()?.toLowerCase();
  const mimeOkay = ACCEPTED_MIME_TYPES.includes(file.type);
  const extensionOkay = extension && ACCEPTED_EXTENSIONS.includes(extension);

  if (!mimeOkay && !extensionOkay) {
    return "Unsupported file type. Use PDF or DOCX.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "File is too large. Max size is 5 MB.";
  }

  if (!sourceLanguage.value || !targetLanguage.value) {
    return "Please select both source and target languages.";
  }

  if (sourceLanguage.value === targetLanguage.value) {
    return "Source and target languages must differ.";
  }

  return null;
}

function getFilenameFromHeaders(headers) {
  const disposition = headers.get("content-disposition");
  if (!disposition) return null;

  const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  if (match && match[1]) {
    return match[1].replace(/['"]/g, "");
  }
  return null;
}

async function downloadPdf(response, filename) {
  // Convert the streamed response into a Blob and trigger a download.
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(anchor);
}

function showError(message) {
  errorBanner.textContent = message;
  errorBanner.classList.remove("hidden");
  successBanner.classList.add("hidden");
}

function showSuccess(message) {
  successBanner.textContent = message;
  successBanner.classList.remove("hidden");
  errorBanner.classList.add("hidden");
}

function clearStatus() {
  errorBanner.classList.add("hidden");
  successBanner.classList.add("hidden");
}

function setLoading(isLoading) {
  if (isLoading) {
    loadingState.classList.remove("hidden");
    submitButton.disabled = true;
    resetButton.disabled = true;
  } else {
    loadingState.classList.add("hidden");
    submitButton.disabled = false;
    resetButton.disabled = false;
  }
}

function resetForm() {
  form.reset();
  clearStatus();
  sourceLanguage.selectedIndex = 0;
  targetLanguage.selectedIndex = 0;
  if (fileInput) fileInput.value = "";
  if (fileNameHint) fileNameHint.textContent = "No file selected yet.";
  renderLanguageTags();
}

function handleFileChange() {
  const file = fileInput.files[0];
  if (!fileNameHint) return;
  if (!file) {
    fileNameHint.textContent = "No file selected yet.";
    return;
  }
  fileNameHint.textContent = `${file.name} • ${(file.size / (1024 * 1024)).toFixed(1)} MB`;
}

function handleLanguageQuickSelect(code, label) {
  // If the option doesn't exist yet (e.g., before hydrate), add it on the fly.
  const optionExists = Array.from(targetLanguage.options).some(
    (opt) => opt.value === code,
  );

  if (!optionExists) {
    targetLanguage.appendChild(new Option(label, code));
  }

  targetLanguage.value = code;
  showSuccess(`Target language set to ${label}.`);
}
