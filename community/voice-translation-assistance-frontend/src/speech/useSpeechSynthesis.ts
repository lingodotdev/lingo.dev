export default function useSpeechSynthesis() {
  function speak(text: string, locale: string) {
    const msg = new SpeechSynthesisUtterance(text);

    const voices = speechSynthesis.getVoices();
    const voice = voices.find((v) => v.lang.startsWith(locale));

    if (voice) msg.voice = voice;

    speechSynthesis.speak(msg);
  }

  return { speak };
}
