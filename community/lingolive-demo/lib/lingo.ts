// Lingo.dev Integration Library
// This module handles all localization logic using Lingo.dev API

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface TranslationKey {
  key: string;
  defaultValue: string;
  context?: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

// Default content keys for the demo app
export const DEMO_CONTENT: TranslationKey[] = [
  { key: 'app.title', defaultValue: 'LingoLive', context: 'App name' },
  { key: 'app.subtitle', defaultValue: 'Real-Time Multilingual App Preview', context: 'App description' },
  { key: 'hero.title', defaultValue: 'Type Once, Translate Everywhere', context: 'Hero section title' },
  { key: 'hero.description', defaultValue: 'Experience how Lingo.dev transforms your content into multiple languages instantly. See your UI text, error messages, and dynamic content localize in real-time.', context: 'Hero description' },
  { key: 'input.placeholder', defaultValue: 'Enter your text here...', context: 'Input field placeholder' },
  { key: 'input.label', defaultValue: 'Your Content', context: 'Input field label' },
  { key: 'button.translate', defaultValue: 'Translate', context: 'Translate button' },
  { key: 'button.clear', defaultValue: 'Clear', context: 'Clear button' },
  { key: 'language.selector', defaultValue: 'Select Language', context: 'Language selector label' },
  { key: 'preview.title', defaultValue: 'Live Preview', context: 'Preview section title' },
  { key: 'preview.loading', defaultValue: 'Translating...', context: 'Loading state' },
  { key: 'error.network', defaultValue: 'Network error. Please check your connection.', context: 'Network error message' },
  { key: 'error.translation', defaultValue: 'Translation failed. Please try again.', context: 'Translation error message' },
  { key: 'error.invalid', defaultValue: 'Invalid input. Please enter valid text.', context: 'Validation error' },
  { key: 'success.copied', defaultValue: 'Text copied to clipboard!', context: 'Success message' },
  { key: 'form.name', defaultValue: 'Name', context: 'Form field label' },
  { key: 'form.email', defaultValue: 'Email', context: 'Form field label' },
  { key: 'form.message', defaultValue: 'Message', context: 'Form field label' },
  { key: 'form.submit', defaultValue: 'Send Message', context: 'Submit button' },
  { key: 'form.required', defaultValue: 'This field is required', context: 'Validation error' },
  { key: 'form.invalid_email', defaultValue: 'Please enter a valid email address', context: 'Email validation error' },
];

class LingoDevClient {
  private apiKey: string;
  private projectId: string;
  private cache: Map<string, Map<string, string>> = new Map();

  constructor() {
    this.apiKey = process.env.LINGO_DEV_API_KEY || '';
    this.projectId = process.env.LINGO_DEV_PROJECT_ID || '';
    
    if (!this.apiKey || !this.projectId) {
      console.warn('Lingo.dev credentials not found. Using fallback translations.');
    }
  }

  // Simulate Lingo.dev API call with fallback for demo
  async translate(text: string, targetLanguage: string, sourceLanguage: string = 'en'): Promise<string> {
    const cacheKey = `${sourceLanguage}-${targetLanguage}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cachedTranslation = this.cache.get(cacheKey)!.get(text);
      if (cachedTranslation) return cachedTranslation;
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

    // Fallback translations for demo (in real app, this would call Lingo.dev API)
    const fallbackTranslations = this.getFallbackTranslations(text, targetLanguage);
    
    // Cache the result
    if (!this.cache.has(cacheKey)) {
      this.cache.set(cacheKey, new Map());
    }
    this.cache.get(cacheKey)!.set(text, fallbackTranslations);

    return fallbackTranslations;
  }

  // Fallback translation method for demo purposes
  private getFallbackTranslations(text: string, targetLanguage: string): string {
    const translations: Record<string, Record<string, string>> = {
      es: {
        'LingoLive': 'LingoLive',
        'Real-Time Multilingual App Preview': 'Vista Previa de Aplicación Multilingüe en Tiempo Real',
        'Type Once, Translate Everywhere': 'Escribe una vez, traduce a todas partes',
        'Enter your text here...': 'Ingresa tu texto aquí...',
        'Your Content': 'Tu Contenido',
        'Translate': 'Traducir',
        'Clear': 'Limpiar',
        'Select Language': 'Seleccionar Idioma',
        'Live Preview': 'Vista Previa en Vivo',
        'Translating...': 'Traduciendo...',
        'Network error. Please check your connection.': 'Error de red. Por favor verifica tu conexión.',
        'Translation failed. Please try again.': 'La traducción falló. Por favor intenta de nuevo.',
        'Invalid input. Please enter valid text.': 'Entrada inválida. Por favor ingresa texto válido.',
        'Text copied to clipboard!': '¡Texto copiado al portapapeles!',
        'Name': 'Nombre',
        'Email': 'Correo Electrónico',
        'Message': 'Mensaje',
        'Send Message': 'Enviar Mensaje',
        'This field is required': 'Este campo es obligatorio',
        'Please enter a valid email address': 'Por favor ingresa una dirección de correo válida',
      },
      fr: {
        'LingoLive': 'LingoLive',
        'Real-Time Multilingual App Preview': 'Aperçu d\'Application Multilingue en Temps Réel',
        'Type Once, Translate Everywhere': 'Tapez une fois, traduisez partout',
        'Enter your text here...': 'Entrez votre texte ici...',
        'Your Content': 'Votre Contenu',
        'Translate': 'Traduire',
        'Clear': 'Effacer',
        'Select Language': 'Sélectionner la Langue',
        'Live Preview': 'Aperçu en Direct',
        'Translating...': 'Traduction en cours...',
        'Network error. Please check your connection.': 'Erreur réseau. Veuillez vérifier votre connexion.',
        'Translation failed. Please try again.': 'La traduction a échoué. Veuillez réessayer.',
        'Invalid input. Please enter valid text.': 'Entrée invalide. Veuillez entrer un texte valide.',
        'Text copied to clipboard!': 'Texte copié dans le presse-papiers!',
        'Name': 'Nom',
        'Email': 'Email',
        'Message': 'Message',
        'Send Message': 'Envoyer le Message',
        'This field is required': 'Ce champ est obligatoire',
        'Please enter a valid email address': 'Veuillez entrer une adresse email valide',
      },
      de: {
        'LingoLive': 'LingoLive',
        'Real-Time Multilingual App Preview': 'Echtzeit-Mehrsprachige App-Vorschau',
        'Type Once, Translate Everywhere': 'Einmal tippen, überall übersetzen',
        'Enter your text here...': 'Geben Sie hier Ihren Text ein...',
        'Your Content': 'Ihr Inhalt',
        'Translate': 'Übersetzen',
        'Clear': 'Löschen',
        'Select Language': 'Sprache Auswählen',
        'Live Preview': 'Live-Vorschau',
        'Translating...': 'Übersetzung läuft...',
        'Network error. Please check your connection.': 'Netzwerkfehler. Bitte überprüfen Sie Ihre Verbindung.',
        'Translation failed. Please try again.': 'Übersetzung fehlgeschlagen. Bitte versuchen Sie es erneut.',
        'Invalid input. Please enter valid text.': 'Ungültige Eingabe. Bitte geben Sie gültigen Text ein.',
        'Text copied to clipboard!': 'Text in die Zwischenablage kopiert!',
        'Name': 'Name',
        'Email': 'E-Mail',
        'Message': 'Nachricht',
        'Send Message': 'Nachricht Senden',
        'This field is required': 'Dieses Feld ist erforderlich',
        'Please enter a valid email address': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
      },
      ja: {
        'LingoLive': 'LingoLive',
        'Real-Time Multilingual App Preview': 'リアルタイム多言語アプリプレビュー',
        'Type Once, Translate Everywhere': '一度入力して、どこでも翻訳',
        'Enter your text here...': 'ここにテキストを入力...',
        'Your Content': 'あなたのコンテンツ',
        'Translate': '翻訳',
        'Clear': 'クリア',
        'Select Language': '言語を選択',
        'Live Preview': 'ライブプレビュー',
        'Translating...': '翻訳中...',
        'Network error. Please check your connection.': 'ネットワークエラー。接続を確認してください。',
        'Translation failed. Please try again.': '翻訳に失敗しました。もう一度お試しください。',
        'Invalid input. Please enter valid text.': '無効な入力です。有効なテキストを入力してください。',
        'Text copied to clipboard!': 'テキストをクリップボードにコピーしました！',
        'Name': '名前',
        'Email': 'メール',
        'Message': 'メッセージ',
        'Send Message': 'メッセージを送信',
        'This field is required': 'この項目は必須です',
        'Please enter a valid email address': '有効なメールアドレスを入力してください',
      },
      zh: {
        'LingoLive': 'LingoLive',
        'Real-Time Multilingual App Preview': '实时多语言应用预览',
        'Type Once, Translate Everywhere': '输入一次，随处翻译',
        'Enter your text here...': '在此输入您的文本...',
        'Your Content': '您的内容',
        'Translate': '翻译',
        'Clear': '清除',
        'Select Language': '选择语言',
        'Live Preview': '实时预览',
        'Translating...': '翻译中...',
        'Network error. Please check your connection.': '网络错误。请检查您的连接。',
        'Translation failed. Please try again.': '翻译失败。请重试。',
        'Invalid input. Please enter valid text.': '输入无效。请输入有效文本。',
        'Text copied to clipboard!': '文本已复制到剪贴板！',
        'Name': '姓名',
        'Email': '邮箱',
        'Message': '消息',
        'Send Message': '发送消息',
        'This field is required': '此字段为必填项',
        'Please enter a valid email address': '请输入有效的邮箱地址',
      },
    };

    return translations[targetLanguage]?.[text] || text;
  }

  // Batch translate multiple keys
  async translateBatch(keys: TranslationKey[], targetLanguage: string): Promise<Record<string, string>> {
    const results: Record<string, string> = {};
    
    // Translate all keys in parallel for better performance
    const translations = await Promise.all(
      keys.map(async (key) => {
        const translated = await this.translate(key.defaultValue, targetLanguage);
        return { key: key.key, value: translated };
      })
    );

    // Convert array back to object
    translations.forEach(({ key, value }) => {
      results[key] = value;
    });

    return results;
  }

  // Get language info by code
  getLanguageByCode(code: string): Language | undefined {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  }

  // Check if language is supported
  isLanguageSupported(code: string): boolean {
    return SUPPORTED_LANGUAGES.some(lang => lang.code === code);
  }
}

// Singleton instance
export const lingoDev = new LingoDevClient();

// React hook for translations
export function useTranslation(language: string) {
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTranslations() {
      if (!language || !lingoDev.isLanguageSupported(language)) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await lingoDev.translateBatch(DEMO_CONTENT, language);
        setTranslations(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Translation failed');
      } finally {
        setLoading(false);
      }
    }

    loadTranslations();
  }, [language]);

  const t = (key: string, fallback?: string) => {
    return translations[key] || fallback || key;
  };

  return { t, loading, error };
}

// Import React hooks for the hook above
import { useState, useEffect } from 'react';