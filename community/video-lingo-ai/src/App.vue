<script setup>
import { ref, computed } from "vue"
import axios from "axios"
import { useI18n } from "./composables/useI18n"

const { t, lang, setLang } = useI18n()

const videoFile = ref(null)
const isSummarize = ref(false)
const loading = ref(false)
const result = ref(null)
const dragActive = ref(false)

const safeSegments = computed(() => {
  if (Array.isArray(result.value?.segments)) {
    return result.value.segments.filter(
      seg =>
        seg &&
        typeof seg.start === 'number' &&
        typeof seg.text === 'string'
    )
  }

  // Optional fallback if API returns plain text
  if (typeof result.value === 'string') {
    return [{ start: 0, text: result.value }]
  }

  return []
})


const handleDrag = (e) => {
  e.preventDefault()
  e.stopPropagation()
  if (e.type === "dragenter" || e.type === "dragover") {
    dragActive.value = true
  } else if (e.type === "dragleave") {
    dragActive.value = false
  }
}

const handleDrop = (e) => {
  e.preventDefault()
  e.stopPropagation()
  dragActive.value = false
  
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    videoFile.value = e.dataTransfer.files[0]
  }
}

const handleUpload = async () => {
  if (!videoFile.value) return alert(t("selectVideoAlert"))

  const formData = new FormData()
  formData.append("file", videoFile.value)

  loading.value = true
  result.value = null

  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/process-video",
      formData,
      {
        params: { issummarize: isSummarize.value, lang: lang.value },
        headers: { "Content-Type": "multipart/form-data" }
      }
    )

    result.value = res.data
  } catch (err) {
    console.error(err)
    alert(t("uploadFailed"))
  } finally {
    loading.value = false
  }
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>
<template>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1 class="title">{{ t("title") }}</h1>
      <p class="subtitle">{{ t("subtitle") }}</p>

      <!-- Language Switcher -->
      <div class="lang-switch">
        <button :class="{ active: lang==='en' }" @click="setLang('en')">EN</button>
        <button :class="{ active: lang==='hi' }" @click="setLang('hi')">हिंदी</button>
      </div>
    </div>

    <!-- Main Card -->
    <div class="card">
      <!-- Upload Area -->
      <div 
        :class="['upload-area', { 'drag-active': dragActive, 'has-file': videoFile }]"
        @dragenter="handleDrag"
        @dragleave="handleDrag"
        @dragover="handleDrag"
        @drop="handleDrop"
      >
        <input 
          type="file" 
          accept="video/*" 
          @change="e => videoFile = e.target.files[0]"
          class="file-input"
        />
        
        <div class="upload-content">
          <div v-if="videoFile" class="file-selected">
            <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <div>
              <p class="file-name">{{ videoFile.name }}</p>
              <p class="file-size">{{ (videoFile.size / 1024 / 1024).toFixed(2) }} MB</p>
            </div>
          </div>
          
          <div v-else class="upload-placeholder">
            <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <p class="upload-text">{{ t("uploadText") }}</p>
            <p class="upload-subtext">{{ t("uploadSubtext") }}</p>
          </div>
        </div>
      </div>

      <!-- Summary Toggle -->
      <div class="options">
        <label class="toggle-label">
          <input 
            type="checkbox" 
            v-model="isSummarize"
            class="toggle-input"
          />
          <span class="toggle-switch"></span>
          <span class="toggle-text">{{ t("generateSummary") }}</span>
        </label>
      </div>

      <!-- Upload Button -->
      <button 
        @click="handleUpload" 
        :disabled="loading || !videoFile"
        class="upload-btn"
      >
        <span v-if="loading" class="btn-content">
          <span class="spinner"></span>
          {{ t("processing") }}
        </span>
        <span v-else>{{ t("uploadBtn") }}</span>
      </button>
    </div>

    <!-- Results -->
    <div v-if="result" class="results">
      <!-- Summary Card -->
      <div v-if="result.summary" class="result-card summary-card">
        <h3 class="result-title">{{ t("summaryTitle") }}</h3>
        <p class="summary-text">{{ result.summary }}</p>
      </div>

      <!-- Transcript Card -->
    <div class="result-card" v-if="safeSegments.length">
      <h3 class="result-title">{{ t('transcriptTitle') }}</h3>

      <div class="transcript-list">
        <div
          v-for="(seg, i) in safeSegments"
          :key="i"
          class="transcript-item"
        >
          <span class="timestamp">
            {{ formatTime(seg.start) }}
          </span>
          <p class="transcript-text">{{ seg.text }}</p>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.container {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2.5rem 1.25rem;
}

.header {
  max-width: 42rem;
  margin: 0 auto 2.5rem;
}

.title {
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.subtitle {
  color: #666;
  font-size: 1rem;
  margin: 0 0 1.25rem 0;
  font-weight: 400;
}

.lang-switch {
  display: inline-flex;
  gap: 0.5rem;
  background: #fff;
  padding: 0.25rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e5e5;
}

.lang-switch button {
  padding: 0.375rem 0.875rem;
  border-radius: 0.375rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  color: #666;
  transition: all 0.15s ease;
}

.lang-switch button.active {
  background: #2563eb;
  color: white;
}

.card {
  max-width: 42rem;
  margin: 0 auto 2rem;
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e5e5e5;
  padding: 1.75rem;
}

.upload-area {
  position: relative;
  border: 2px dashed #d4d4d8;
  border-radius: 0.625rem;
  padding: 2.5rem 1.5rem;
  transition: all 0.2s ease;
  background: #fafafa;
}

.upload-area:hover {
  border-color: #a1a1aa;
  background: #f4f4f5;
}

.upload-area.drag-active {
  border-color: #2563eb;
  background: #eff6ff;
}

.upload-area.has-file {
  background: #f0fdf4;
  border-color: #86efac;
}

.file-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-content {
  text-align: center;
  pointer-events: none;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-icon {
  width: 3rem;
  height: 3rem;
  margin-bottom: 1rem;
  color: #71717a;
}

.file-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.875rem;
}

.check-icon {
  width: 2rem;
  height: 2rem;
  color: #16a34a;
  flex-shrink: 0;
}

.file-name {
  font-weight: 500;
  color: #1a1a1a;
  margin: 0 0 0.25rem 0;
  text-align: left;
}

.file-size {
  font-size: 0.875rem;
  color: #737373;
  margin: 0;
  text-align: left;
}

.upload-text {
  font-size: 1rem;
  font-weight: 500;
  color: #262626;
  margin: 0 0 0.375rem 0;
}

.upload-subtext {
  font-size: 0.875rem;
  color: #737373;
  margin: 0;
}

.options {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f4f4f5;
}

.toggle-label {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.toggle-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch {
  position: relative;
  width: 2.75rem;
  height: 1.5rem;
  background: #e5e5e5;
  border-radius: 0.75rem;
  transition: background 0.2s ease;
}

.toggle-switch::after {
  content: '';
  position: absolute;
  left: 0.125rem;
  top: 0.125rem;
  width: 1.25rem;
  height: 1.25rem;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toggle-input:checked + .toggle-switch {
  background: #2563eb;
}

.toggle-input:checked + .toggle-switch::after {
  transform: translateX(1.25rem);
}

.toggle-text {
  font-size: 0.9375rem;
  color: #404040;
  font-weight: 500;
}

.upload-btn {
  width: 100%;
  margin-top: 1.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.9375rem;
  color: white;
  background: #2563eb;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
}

.upload-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.upload-btn:active:not(:disabled) {
  background: #1e40af;
}

.upload-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.results {
  max-width: 42rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.result-card {
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e5e5e5;
  padding: 1.5rem;
}

.summary-card {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.result-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 1rem 0;
}

.summary-text {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #404040;
  margin: 0;
}

.transcript-list {
  max-height: 28rem;
  overflow-y: auto;
  margin: -0.25rem;
  padding: 0.25rem;
}

.transcript-list::-webkit-scrollbar {
  width: 6px;
}

.transcript-list::-webkit-scrollbar-track {
  background: transparent;
}

.transcript-list::-webkit-scrollbar-thumb {
  background: #d4d4d8;
  border-radius: 3px;
}

.transcript-list::-webkit-scrollbar-thumb:hover {
  background: #a1a1aa;
}

.transcript-item {
  display: grid;
  grid-template-columns: 5rem 1fr;
  gap: 1rem;
  padding: 0.875rem 0;
  border-bottom: 1px solid #f4f4f5;
}

.transcript-item:last-child {
  border-bottom: none;
}

.timestamp {
  color: #71717a;
  font-size: 0.8125rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  padding-top: 0.125rem;
}

.transcript-text {
  color: #262626;
  line-height: 1.6;
  font-size: 0.9375rem;
  margin: 0;
}
</style>