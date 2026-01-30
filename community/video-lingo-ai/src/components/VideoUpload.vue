<script setup>
import { ref } from "vue"
import axios from "axios"

const videoFile = ref(null)
const isSummarize = ref(false)
const loading = ref(false)
const result = ref(null)
const dragActive = ref(false)

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
  if (!videoFile.value) return alert("Please select a video")

  const formData = new FormData()
  formData.append("file", videoFile.value)

  loading.value = true
  result.value = null

  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/process-video",
      formData,
      {
        params: { issummarize: isSummarize.value },
        headers: { "Content-Type": "multipart/form-data" }
      }
    )

    result.value = res.data
  } catch (err) {
    console.error(err)
    alert("Upload failed")
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
      <div class="title-wrapper">
        <svg class="icon-video" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M23 7l-7 5 7 5V7z"></path>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
        </svg>
        <h1 class="title">Video Lingo AI</h1>
      </div>
      <p class="subtitle">Transform your videos into text with AI-powered transcription</p>
    </div>

    <!-- Main Card -->
    <div class="card">
      <!-- Upload Area -->
      <div 
        :class="['upload-area', { 'drag-active': dragActive }]"
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
          <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          
          <div v-if="videoFile" class="file-selected">
            <div class="file-info">
              <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <p class="file-name">{{ videoFile.name }}</p>
            </div>
            <p class="file-size">{{ (videoFile.size / 1024 / 1024).toFixed(2) }} MB</p>
          </div>
          
          <div v-else>
            <p class="upload-text">Drop your video here or click to browse</p>
            <p class="upload-subtext">Supports MP4, AVI, MOV and more</p>
          </div>
        </div>
      </div>

      <!-- Summary Toggle -->
      <div class="toggle-wrapper">
        <label class="toggle-label">
          <div class="toggle-container">
            <input 
              type="checkbox" 
              v-model="isSummarize"
              class="toggle-input"
            />
            <div class="toggle-slider"></div>
            <div class="toggle-knob"></div>
          </div>
          <span class="toggle-text">
            <svg class="sparkle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20M17 7l-5 5-5-5M7 17l5-5 5 5"></path>
            </svg>
            Generate AI Summary
          </span>
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
          Processing Your Video...
        </span>
        <span v-else class="btn-content">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          Upload & Transcribe
        </span>
      </button>
    </div>

    <!-- Results -->
    <div v-if="result" class="results">
      <!-- Summary Card -->
      <div v-if="result.summary" class="summary-card">
        <div class="summary-header">
          <svg class="summary-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v20M17 7l-5 5-5-5M7 17l5-5 5 5"></path>
          </svg>
          <h3>AI Summary</h3>
        </div>
        <p class="summary-text">{{ result.summary }}</p>
      </div>

      <!-- Transcript Card -->
      <div class="transcript-card">
        <div class="transcript-header">
          <svg class="transcript-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <h3>Full Transcript</h3>
        </div>
        
        <div class="transcript-list">
          <div 
            v-for="(seg, i) in result.segments || result" 
            :key="i"
            class="transcript-item"
          >
            <div class="timestamp">
              <svg class="clock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>{{ formatTime(seg.start) }} - {{ formatTime(seg.end) }}</span>
            </div>
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
  background: linear-gradient(135deg, #eef2ff 0%, #fae8ff 50%, #fce7f3 100%);
  padding: 3rem 1rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  animation: fadeIn 0.6s ease-out;
}

.title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.icon-video {
  width: 3rem;
  height: 3rem;
  color: #4f46e5;
}

.title {
  font-size: 3rem;
  font-weight: bold;
  background: linear-gradient(to right, #4f46e5, #7c3aed, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.subtitle {
  color: #6b7280;
  font-size: 1.125rem;
  margin: 0;
}

.card {
  max-width: 56rem;
  margin: 0 auto 2rem;
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 2rem;
  border: 1px solid #f3f4f6;
}

.upload-area {
  position: relative;
  border: 3px dashed #d1d5db;
  border-radius: 1rem;
  padding: 3rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.upload-area:hover {
  border-color: #818cf8;
  background: #f9fafb;
}

.upload-area.drag-active {
  border-color: #4f46e5;
  background: #eef2ff;
  transform: scale(1.02);
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

.upload-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  color: #6366f1;
}

.file-selected {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #059669;
}

.check-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.file-name {
  font-weight: 600;
  margin: 0;
}

.file-size {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.upload-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.upload-subtext {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.toggle-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.toggle-container {
  position: relative;
  width: 3.5rem;
  height: 1.75rem;
}

.toggle-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  inset: 0;
  background: #d1d5db;
  border-radius: 9999px;
  transition: all 0.3s ease;
}

.toggle-input:checked + .toggle-slider {
  background: linear-gradient(to right, #6366f1, #a855f7);
}

.toggle-knob {
  position: absolute;
  left: 0.25rem;
  top: 0.25rem;
  width: 1.25rem;
  height: 1.25rem;
  background: white;
  border-radius: 9999px;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toggle-input:checked ~ .toggle-knob {
  transform: translateX(1.75rem);
}

.toggle-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 500;
  color: #374151;
  transition: color 0.3s ease;
}

.toggle-label:hover .toggle-text {
  color: #4f46e5;
}

.sparkle-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.upload-btn {
  width: 100%;
  margin-top: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1.125rem;
  color: white;
  background: linear-gradient(to right, #4f46e5, #7c3aed, #ec4899);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.upload-btn:hover:not(:disabled) {
  background: linear-gradient(to right, #4338ca, #6d28d9, #db2777);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  transform: scale(1.02);
}

.upload-btn:active:not(:disabled) {
  transform: scale(0.98);
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

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 3px solid white;
  border-top-color: transparent;
  border-radius: 9999px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.results {
  max-width: 56rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: fadeIn 0.6s ease-out;
}

.summary-card {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border-radius: 1.5rem;
  padding: 2rem;
  color: white;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.summary-icon {
  width: 2rem;
  height: 2rem;
}

.summary-header h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.summary-text {
  font-size: 1.125rem;
  line-height: 1.75;
  opacity: 0.95;
  margin: 0;
}

.transcript-card {
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  border: 1px solid #f3f4f6;
}

.transcript-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.transcript-icon {
  width: 2rem;
  height: 2rem;
  color: #4f46e5;
}

.transcript-header h3 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

.transcript-list {
  max-height: 24rem;
  overflow-y: auto;
  padding-right: 1rem;
}

.transcript-list::-webkit-scrollbar {
  width: 8px;
}

.transcript-list::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 10px;
}

.transcript-list::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #6366f1, #a855f7);
  border-radius: 10px;
}

.transcript-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #4f46e5, #9333ea);
}

.transcript-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.75rem;
  transition: background 0.2s ease;
  margin-bottom: 1rem;
}

.transcript-item:hover {
  background: #eef2ff;
}

.timestamp {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4f46e5;
  font-weight: 600;
  font-size: 0.875rem;
  min-width: fit-content;
}

.clock-icon {
  width: 1rem;
  height: 1rem;
}

.transcript-text {
  color: #374151;
  line-height: 1.75;
  margin: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>