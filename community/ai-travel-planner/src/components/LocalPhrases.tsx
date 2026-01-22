"use i18n";
import { useState, useEffect, useCallback } from "react";
import { Languages, Volume2, Copy, Check, ChevronDown, VolumeX } from "lucide-react";
import type { Destination } from "@/types";

interface LocalPhrasesProps {
  destination: Destination;
}

// Common travel phrases with translations
const phrasesData: Record<string, { phrase: string; pronunciation: string; translation: string }[]> = {
  Japanese: [
    { phrase: "こんにちは", pronunciation: "Konnichiwa", translation: "Hello" },
    { phrase: "ありがとう", pronunciation: "Arigatou", translation: "Thank you" },
    { phrase: "すみません", pronunciation: "Sumimasen", translation: "Excuse me / Sorry" },
    { phrase: "はい / いいえ", pronunciation: "Hai / Iie", translation: "Yes / No" },
    { phrase: "いくらですか？", pronunciation: "Ikura desu ka?", translation: "How much is it?" },
    { phrase: "お会計お願いします", pronunciation: "Okaikei onegaishimasu", translation: "Check, please" },
    { phrase: "トイレはどこですか？", pronunciation: "Toire wa doko desu ka?", translation: "Where is the toilet?" },
    { phrase: "英語を話せますか？", pronunciation: "Eigo wo hanasemasu ka?", translation: "Do you speak English?" },
    { phrase: "これをください", pronunciation: "Kore wo kudasai", translation: "I'll have this, please" },
    { phrase: "美味しい！", pronunciation: "Oishii!", translation: "Delicious!" },
  ],
  French: [
    { phrase: "Bonjour", pronunciation: "Bohn-zhoor", translation: "Hello / Good day" },
    { phrase: "Merci", pronunciation: "Mehr-see", translation: "Thank you" },
    { phrase: "S'il vous plaît", pronunciation: "Seel voo pleh", translation: "Please" },
    { phrase: "Excusez-moi", pronunciation: "Eks-koo-zay mwah", translation: "Excuse me" },
    { phrase: "Oui / Non", pronunciation: "Wee / Nohn", translation: "Yes / No" },
    { phrase: "Combien ça coûte?", pronunciation: "Kohm-byen sah koot?", translation: "How much does it cost?" },
    { phrase: "L'addition, s'il vous plaît", pronunciation: "Lah-dee-syon, seel voo pleh", translation: "The bill, please" },
    { phrase: "Où sont les toilettes?", pronunciation: "Oo sohn lay twah-let?", translation: "Where are the toilets?" },
    { phrase: "Je ne comprends pas", pronunciation: "Zhuh nuh kohm-prahn pah", translation: "I don't understand" },
    { phrase: "C'est délicieux!", pronunciation: "Say day-lee-syuh!", translation: "It's delicious!" },
  ],
  Spanish: [
    { phrase: "Hola", pronunciation: "Oh-lah", translation: "Hello" },
    { phrase: "Gracias", pronunciation: "Grah-syahs", translation: "Thank you" },
    { phrase: "Por favor", pronunciation: "Pohr fah-vohr", translation: "Please" },
    { phrase: "Disculpe", pronunciation: "Dees-kool-peh", translation: "Excuse me" },
    { phrase: "Sí / No", pronunciation: "See / Noh", translation: "Yes / No" },
    { phrase: "¿Cuánto cuesta?", pronunciation: "Kwahn-toh kwes-tah?", translation: "How much does it cost?" },
    { phrase: "La cuenta, por favor", pronunciation: "Lah kwen-tah, pohr fah-vohr", translation: "The bill, please" },
    { phrase: "¿Dónde está el baño?", pronunciation: "Dohn-deh es-tah el bah-nyoh?", translation: "Where is the bathroom?" },
    { phrase: "No entiendo", pronunciation: "Noh en-tyen-doh", translation: "I don't understand" },
    { phrase: "¡Está delicioso!", pronunciation: "Es-tah deh-lee-syoh-soh!", translation: "It's delicious!" },
  ],
  Indonesian: [
    { phrase: "Halo", pronunciation: "Hah-loh", translation: "Hello" },
    { phrase: "Terima kasih", pronunciation: "Tuh-ree-mah kah-see", translation: "Thank you" },
    { phrase: "Tolong", pronunciation: "Toh-long", translation: "Please / Help" },
    { phrase: "Permisi", pronunciation: "Puhr-mee-see", translation: "Excuse me" },
    { phrase: "Ya / Tidak", pronunciation: "Yah / Tee-dahk", translation: "Yes / No" },
    { phrase: "Berapa harganya?", pronunciation: "Buh-rah-pah har-gah-nyah?", translation: "How much is it?" },
    { phrase: "Minta bon", pronunciation: "Meen-tah bohn", translation: "Bill, please" },
    { phrase: "Di mana toilet?", pronunciation: "Dee mah-nah toy-let?", translation: "Where is the toilet?" },
    { phrase: "Saya tidak mengerti", pronunciation: "Sah-yah tee-dahk muh-nger-tee", translation: "I don't understand" },
    { phrase: "Enak sekali!", pronunciation: "Eh-nahk suh-kah-lee!", translation: "Very delicious!" },
  ],
  Arabic: [
    { phrase: "مرحبا", pronunciation: "Marhaba", translation: "Hello" },
    { phrase: "شكراً", pronunciation: "Shukran", translation: "Thank you" },
    { phrase: "من فضلك", pronunciation: "Min fadlak", translation: "Please" },
    { phrase: "عفواً", pronunciation: "Afwan", translation: "Excuse me" },
    { phrase: "نعم / لا", pronunciation: "Na'am / La", translation: "Yes / No" },
    { phrase: "بكم هذا؟", pronunciation: "Bikam hatha?", translation: "How much is this?" },
    { phrase: "الحساب من فضلك", pronunciation: "Al-hisab min fadlak", translation: "The bill, please" },
    { phrase: "أين الحمام؟", pronunciation: "Ayna al-hammam?", translation: "Where is the bathroom?" },
    { phrase: "لا أفهم", pronunciation: "La afham", translation: "I don't understand" },
    { phrase: "لذيذ!", pronunciation: "Latheeth!", translation: "Delicious!" },
  ],
  Greek: [
    { phrase: "Γεια σας", pronunciation: "Yah-sahs", translation: "Hello (formal)" },
    { phrase: "Ευχαριστώ", pronunciation: "Ef-hah-ree-stoh", translation: "Thank you" },
    { phrase: "Παρακαλώ", pronunciation: "Pah-rah-kah-loh", translation: "Please / You're welcome" },
    { phrase: "Συγγνώμη", pronunciation: "See-ghno-mee", translation: "Sorry / Excuse me" },
    { phrase: "Ναι / Όχι", pronunciation: "Neh / Oh-hee", translation: "Yes / No" },
    { phrase: "Πόσο κάνει;", pronunciation: "Poh-soh kah-nee?", translation: "How much is it?" },
    { phrase: "Τον λογαριασμό", pronunciation: "Ton lo-gah-ryaz-moh", translation: "The bill, please" },
    { phrase: "Πού είναι η τουαλέτα;", pronunciation: "Poo ee-neh ee too-ah-leh-tah?", translation: "Where is the toilet?" },
    { phrase: "Δεν καταλαβαίνω", pronunciation: "Then kah-tah-lah-veh-no", translation: "I don't understand" },
    { phrase: "Νόστιμο!", pronunciation: "No-stee-mo!", translation: "Delicious!" },
  ],
  Icelandic: [
    { phrase: "Halló", pronunciation: "Hah-loh", translation: "Hello" },
    { phrase: "Takk", pronunciation: "Tahk", translation: "Thank you" },
    { phrase: "Vinsamlegast", pronunciation: "Vin-sahm-leh-gahst", translation: "Please" },
    { phrase: "Afsakið", pronunciation: "Ahf-sah-kith", translation: "Excuse me" },
    { phrase: "Já / Nei", pronunciation: "Yow / Nay", translation: "Yes / No" },
    { phrase: "Hvað kostar þetta?", pronunciation: "Kvath kos-tar theh-tah?", translation: "How much does this cost?" },
    { phrase: "Reikninginn, takk", pronunciation: "Rayk-ning-in, tahk", translation: "The bill, please" },
    { phrase: "Hvar er klósettið?", pronunciation: "Kvar er kloh-seh-tith?", translation: "Where is the toilet?" },
    { phrase: "Ég skil ekki", pronunciation: "Yeg skil eh-kee", translation: "I don't understand" },
    { phrase: "Þetta er ljúffengt!", pronunciation: "Theh-tah er lyoof-fengt!", translation: "This is delicious!" },
  ],
  English: [
    { phrase: "Hello", pronunciation: "He-loh", translation: "Hello" },
    { phrase: "Thank you", pronunciation: "Thank yoo", translation: "Thank you" },
    { phrase: "Please", pronunciation: "Pleez", translation: "Please" },
    { phrase: "Excuse me", pronunciation: "Ex-kyooz mee", translation: "Excuse me" },
    { phrase: "Yes / No", pronunciation: "Yes / Noh", translation: "Yes / No" },
    { phrase: "How much is it?", pronunciation: "How much iz it?", translation: "How much is it?" },
    { phrase: "Check, please", pronunciation: "Chek, pleez", translation: "Check, please" },
    { phrase: "Where is the restroom?", pronunciation: "Wair iz the rest-room?", translation: "Where is the restroom?" },
    { phrase: "I don't understand", pronunciation: "Ai dohnt under-stand", translation: "I don't understand" },
    { phrase: "Delicious!", pronunciation: "De-li-shus!", translation: "Delicious!" },
  ],
  "Dhivehi/English": [
    { phrase: "އައްސަލާމް ޢަލައިކުމް", pronunciation: "Assalaamu Alaikum", translation: "Peace be upon you (Hello)" },
    { phrase: "ޝުކުރިއްޔާ", pronunciation: "Shukuriyya", translation: "Thank you" },
    { phrase: "Hello", pronunciation: "He-loh", translation: "Hello (English widely spoken)" },
    { phrase: "Thank you", pronunciation: "Thank yoo", translation: "Thank you" },
    { phrase: "Please", pronunciation: "Pleez", translation: "Please" },
    { phrase: "How much?", pronunciation: "How much?", translation: "How much?" },
    { phrase: "Beautiful!", pronunciation: "Byoo-ti-ful!", translation: "Beautiful!" },
    { phrase: "ރަނގަޅު", pronunciation: "Rangalhu", translation: "Good / Okay" },
  ],
};

// Map destination language to phrases
const getLanguagePhrases = (language: string) => {
  // Handle combined languages like "Spanish/Catalan"
  const primaryLanguage = language.split("/")[0].trim();
  return phrasesData[primaryLanguage] || phrasesData["English"] || [];
};

export default function LocalPhrases({ destination }: LocalPhrasesProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const phrases = getLanguagePhrases(destination.language);

  // Load voices when component mounts
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSpeechSupported(false);
      return;
    }

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    // Load voices immediately if already available
    loadVoices();

    // Chrome loads voices asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Also try loading after a delay (some browsers need this)
    const timer = setTimeout(loadVoices, 100);

    return () => {
      clearTimeout(timer);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakPhrase = useCallback((text: string, pronunciation: string, index: number) => {
    if (!speechSupported || typeof window === "undefined") {
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Reset state
    setPlayingIndex(index);

    // Language mapping
    const langMap: Record<string, string> = {
      Japanese: "ja-JP",
      French: "fr-FR",
      Spanish: "es-ES",
      Indonesian: "id-ID",
      Arabic: "ar-SA",
      Greek: "el-GR",
      Icelandic: "is-IS",
      English: "en-US",
      "Dhivehi/English": "en-US",
    };
    
    const primaryLang = destination.language.split("/")[0].trim();
    const targetLang = langMap[primaryLang] || "en-US";
    
    // Get voices (use cached or fetch new)
    const availableVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
    
    // Find best voice for the language
    let selectedVoice = availableVoices.find(v => v.lang === targetLang);
    if (!selectedVoice) {
      selectedVoice = availableVoices.find(v => v.lang.startsWith(targetLang.split("-")[0]));
    }
    
    // Decide what to speak
    const textToSpeak = selectedVoice ? text : pronunciation;
    const langToUse = selectedVoice ? targetLang : "en-US";
    
    // If no native voice, find English voice for pronunciation
    if (!selectedVoice) {
      selectedVoice = availableVoices.find(v => v.lang.startsWith("en"));
    }

    // Create and configure utterance
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = langToUse;
    utterance.rate = 0.7;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setPlayingIndex(index);
    };

    utterance.onend = () => {
      setPlayingIndex(null);
    };

    utterance.onerror = (event) => {
      console.error("Speech error:", event.error);
      setPlayingIndex(null);
    };

    // Small delay helps with Chrome's speech synthesis bugs
    setTimeout(() => {
      try {
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error("Failed to speak:", err);
        setPlayingIndex(null);
      }
    }, 10);
  }, [speechSupported, voices, destination.language]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setPlayingIndex(null);
    }
  }, []);

  const copyPhrase = async (phrase: string, index: number) => {
    try {
      await navigator.clipboard.writeText(phrase);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
        <Languages className="w-5 h-5 text-violet-400" />
        <>Local Phrases</>
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        <>Essential phrases in</> {destination.language}
      </p>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {phrases.map((item, index) => (
          <div
            key={index}
            className="rounded-xl bg-white/5 overflow-hidden transition-all"
          >
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="text-left">
                <p className="text-white font-medium">{item.translation}</p>
                <p className="text-sm text-violet-400">{item.phrase}</p>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedIndex === index && (
              <div className="px-4 pb-4 space-y-3">
                <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <p className="text-xs text-gray-500 mb-1"><>Pronunciation</></p>
                  <p className="text-violet-300 font-mono">{item.pronunciation}</p>
                </div>

                <div className="flex gap-2">
                  {speechSupported ? (
                    <button
                      onClick={() => playingIndex === index ? stopSpeaking() : speakPhrase(item.phrase, item.pronunciation, index)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
                        playingIndex === index
                          ? "bg-violet-500 text-white"
                          : "bg-white/10 hover:bg-white/20 text-gray-300"
                      }`}
                    >
                      {playingIndex === index ? (
                        <>
                          <VolumeX className="w-4 h-4 animate-pulse" />
                          <span className="text-sm"><>Stop</></span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" />
                          <span className="text-sm"><>Listen</></span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 text-gray-500 cursor-not-allowed"
                    >
                      <VolumeX className="w-4 h-4" />
                      <span className="text-sm"><>Audio unavailable</></span>
                    </button>
                  )}
                  <button
                    onClick={() => copyPhrase(item.phrase, index)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
                      copiedIndex === index
                        ? "bg-emerald-500 text-white"
                        : "bg-white/10 hover:bg-white/20 text-gray-300"
                    }`}
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="text-sm"><>Copied!</></span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-sm"><>Copy</></span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <p className="text-xs text-amber-400">
          <>Tip: Learning just a few local phrases can greatly enhance your travel experience and show respect for the local culture!</>
        </p>
      </div>
    </div>
  );
}
