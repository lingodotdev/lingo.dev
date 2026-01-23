const targetLanguageSelect = document.getElementById("targetLanguage");
const translateBtn = document.getElementById("translateBtn");
const restoreBtn = document.getElementById("restoreBtn");

const statusDiv = document.getElementById("status");
const progressContainer = document.getElementById("progress");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

// -------------------- UI Helpers --------------------
function showStatus(message, type = "info") {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.classList.remove("hidden");

  // auto hide for success/error
  if (type === "success" || type === "error") {
    setTimeout(() => {
      statusDiv.classList.add("hidden");
    }, 2500);
  }
}

function showProgress(percent, message = "Working...") {
  progressContainer.classList.remove("hidden");
  progressBar.style.width = `${percent}%`;
  progressText.textContent = message;
}

function hideProgress() {
  progressContainer.classList.add("hidden");
  progressBar.style.width = "0%";
  progressText.textContent = "Translating...";
}

function setButtonsDisabled(disabled) {
  translateBtn.disabled = disabled;
  restoreBtn.disabled = disabled;
}

// -------------------- Translate --------------------
translateBtn.addEventListener("click", async () => {
  try {
    setButtonsDisabled(true);
    showStatus("Starting translation...", "info");
    showProgress(10, "Extracting text...");

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.tabs.sendMessage(
      tab.id,
      { action: "translatePage", targetLocale: targetLanguageSelect.value },
      (res) => {
        if (chrome.runtime.lastError) {
          showStatus("Error: refresh the page and try again.", "error");
          hideProgress();
          setButtonsDisabled(false);
          return;
        }

        if (res?.success) {
          showProgress(100, "Done!");
          showStatus("✅ Page translated successfully!", "success");
        } else {
          showStatus(`❌ ${res?.error || "Translation failed"}`, "error");
        }

        hideProgress();
        setButtonsDisabled(false);
      }
    );
  } catch (err) {
    showStatus(`❌ ${err.message}`, "error");
    hideProgress();
    setButtonsDisabled(false);
  }
});

// -------------------- Restore --------------------
restoreBtn.addEventListener("click", async () => {
  try {
    showStatus("Restoring original content...", "info");
    showProgress(50, "Restoring...");

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.tabs.sendMessage(tab.id, { action: "restoreOriginal" }, (res) => {
      if (chrome.runtime.lastError) {
        showStatus("Error: Could not restore. Try refreshing.", "error");
        hideProgress();
        return;
      }

      showProgress(100, "Restored!");
      showStatus("↩️ Original text restored!", "success");
      hideProgress();
    });
  } catch (err) {
    showStatus(`❌ ${err.message}`, "error");
    hideProgress();
  }
});
