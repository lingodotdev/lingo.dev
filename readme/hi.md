<p align="center">
  <a href="https://lingo.dev">
    <img src="/content/banner.dark.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡️ वेब और मोबाइल लोकलाइजेशन के लिए AI-संचालित ओपन-सोर्स CLI.</strong>
</p>

<br />

<p align="center">
  <a href="https://docs.lingo.dev">दस्तावेज़</a> •
  <a href="https://github.com/lingodotdev/lingo.dev/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">योगदान दें</a> •
  <a href="#-github-action">GitHub एक्शन</a> •
  <a href="#">रेपो को स्टार करें</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg" alt="रिलीज़" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="लाइसेंस" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="आखिरी कमिट" />
  </a>
</p>

<br />

Lingo.dev एक समुदाय-संचालित, ओपन-सोर्स CLI है जो AI-संचालित वेब और मोबाइल ऐप लोकलाइजेशन के लिए बनाया गया है।

Lingo.dev प्रामाणिक अनुवाद तुरंत प्रदान करने के लिए डिज़ाइन किया गया है, जिससे मैनुअल काम और प्रबंधन का बोझ समाप्त होता है। परिणामस्वरूप, टीमें 100 गुना तेज़ी से सटीक लोकलाइजेशन करती हैं, और दुनिया भर में अधिक खुश उपयोगकर्ताओं के लिए फीचर्स शिप करती हैं। इसका उपयोग आपके अपने LLM के साथ या Lingo.dev-प्रबंधित लोकलाइजेशन इंजन के साथ किया जा सकता है।

> **कम ज्ञात तथ्य:** Lingo.dev की शुरुआत 2023 में एक छात्र हैकाथॉन में एक छोटे प्रोजेक्ट के रूप में हुई थी! कई संशोधनों के बाद, हमें 2024 में Y Combinator में स्वीकार किया गया, और अब हम भर्ती कर रहे हैं! अगली पीढ़ी के लोकलाइजेशन टूल्स बनाने में रुचि रखते हैं? अपना CV careers@lingo.dev पर भेजें! 🚀

## 📑 इस गाइड में

- [क्विकस्टार्ट](#-quickstart) - मिनटों में शुरू करें
- [कैशिंग](#-caching-with-i18nlock) - अनुवाद अपडेट को अनुकूलित करें
- [GitHub एक्शन](#-github-action) - CI/CD में लोकलाइजेशन को स्वचालित करें
- [फीचर्स](#-supercharged-features) - क्या Lingo.dev को शक्तिशाली बनाता है
- [दस्तावेज़ीकरण](#-documentation) - विस्तृत गाइड और संदर्भ
- [योगदान](#-contribute) - हमारे समुदाय में शामिल हों

## 💫 क्विकस्टार्ट

Lingo.dev CLI को आपके अपने LLM और Lingo.dev-प्रबंधित लोकलाइजेशन इंजन दोनों के साथ काम करने के लिए डिज़ाइन किया गया है जो नवीनतम SOTA (स्टेट-ऑफ-द-आर्ट) LLM पर आधारित है।

### अपने खुद के LLM का उपयोग करना (BYOK या अपनी खुद की कुंजी लाएं)

1. एक `i18n.json` कॉन्फ़िगरेशन फ़ाइल बनाएँ:

json
{
"version": 1.5,
"provider": {
"id": "anthropic",
"model": "claude-3-7-sonnet-latest",
"prompt": "You're translating text from {source} to {target}."
},
"locale": {
"source": "en",
"targets": ["es", "fr", "de"]
}
}

````

2. अपनी API कुंजी को पर्यावरण चर के रूप में सेट करें:

```bash
export ANTHROPIC_API_KEY=your_anthropic_api_key

# या OpenAI के लिए

export OPENAI_API_KEY=your_openai_api_key
````

3. स्थानीयकरण चलाएँ:

```bash
npx lingo.dev@latest i18n
```

### Lingo.dev क्लाउड का उपयोग करना

अक्सर, प्रोडक्शन-ग्रेड ऐप्स को अनुवाद मेमोरी, शब्दावली समर्थन और स्थानीयकरण गुणवत्ता आश्वासन जैसी सुविधाओं की आवश्यकता होती है। कभी-कभी, आप चाहते हैं कि कोई विशेषज्ञ आपके लिए यह तय करे कि कौन सा LLM प्रदाता और मॉडल उपयोग करना है, और नए मॉडल जारी होने पर उन्हें स्वचालित रूप से अपडेट करना है। Lingo.dev एक प्रबंधित स्थानीयकरण इंजन है जो इन सुविधाओं को प्रदान करता है:

1. एक `i18n.json` कॉन्फ़िगरेशन फ़ाइल बनाएँ (प्रदाता नोड के बिना):

```json
{
  "version": 1.5,
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. Lingo.dev के साथ प्रमाणीकरण करें:

```bash
npx lingo.dev@latest auth --login
```

3. स्थानीयकरण चलाएँ:

```bash
npx lingo.dev@latest i18n
```

## 📖 दस्तावेज़ीकरण

विस्तृत गाइड और API संदर्भों के लिए, [दस्तावेज़ीकरण](https://lingo.dev/go/docs) पर जाएँ।

## 🔒 `i18n.lock` के साथ कैशिंग

Lingo.dev सामग्री चेकसम को ट्रैक करने के लिए `i18n.lock` फ़ाइल का उपयोग करता है, यह सुनिश्चित करता है कि केवल बदले गए टेक्स्ट का अनुवाद किया जाए। यह निम्न में सुधार करता है:

- ⚡️ **गति**: पहले से अनुवादित सामग्री को छोड़ें
- 🔄 **स्थिरता**: अनावश्यक पुनः अनुवाद को रोकें
- 💰 **लागत**: दोहराए गए अनुवादों के लिए कोई बिलिंग नहीं

## 🤖 GitHub एक्शन

Lingo.dev आपके CI/CD पाइपलाइन में स्थानीयकरण को स्वचालित करने के लिए एक GitHub एक्शन प्रदान करता है। यहाँ एक बुनियादी सेटअप है:

```yaml
- uses: lingodotdev/lingo.dev@main
  with:
    api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

यह एक्शन हर पुश पर `lingo.dev i18n` चलाता है, जिससे आपके अनुवाद स्वचालित रूप से अप-टू-डेट रहते हैं।

पुल रिक्वेस्ट मोड और अन्य कॉन्फ़िगरेशन विकल्पों के लिए, हमारे [GitHub एक्शन दस्तावेज़ीकरण](https://docs.lingo.dev/setup/gha) पर जाएँ।

## ⚡️ Lingo.dev की सुपरपावर्स

- 🔥 **तत्काल एकीकरण**: मिनटों में आपके कोडबेस के साथ काम करता है
- 🔄 **CI/CD ऑटोमेशन**: सेट करें और भूल जाएं
- 🌍 **वैश्विक पहुंच**: हर जगह उपयोगकर्ताओं तक पहुंचें
- 🧠 **AI-संचालित**: प्राकृतिक अनुवाद के लिए नवीनतम भाषा मॉडल का उपयोग करता है
- 📊 **फॉर्मेट-अज्ञेयवादी**: JSON, YAML, CSV, Markdown, Android, iOS, और बहुत कुछ
- 🔍 **स्वच्छ अंतर**: आपकी फ़ाइल संरचना को बिल्कुल सही रखता है
- ⚡️ **बिजली की गति**: दिनों नहीं, सेकंडों में अनुवाद
- 🔄 **हमेशा सिंक**: सामग्री बदलने पर स्वचालित रूप से अपडेट होता है
- 🌟 **मानव गुणवत्ता**: अनुवाद जो रोबोटिक नहीं लगते
- 👨‍💻 **डेवलपर्स द्वारा, डेवलपर्स के लिए बनाया गया**: हम इसे खुद रोजाना उपयोग करते हैं
- 📈 **आपके साथ बढ़ता है**: साइड प्रोजेक्ट से लेकर एंटरप्राइज स्केल तक

## 🤝 योगदान दें

Lingo.dev समुदाय-संचालित है, इसलिए हम सभी योगदानों का स्वागत करते हैं!

किसी नई सुविधा के लिए विचार है? GitHub इश्यू बनाएँ!

योगदान देना चाहते हैं? पुल रिक्वेस्ट बनाएँ!

## 🌐 अन्य भाषाओं में रीडमी

- [English](https://github.com/lingodotdev/lingo.dev)
- [Spanish](/readme/es.md)
- [French](/readme/fr.md)
- [Russian](/readme/ru.md)
- [German](/readme/de.md)
- [Chinese](/readme/zh-Hans.md)
- [Korean](/readme/ko.md)
- [Japanese](/readme/ja.md)
- [Italian](/readme/it.md)
- [Arabic](/readme/ar.md)
- [Hindi](/readme/hi.md)

अपनी भाषा नहीं दिख रही है? बस [`i18n.json`](./i18n.json) फ़ाइल में एक नया भाषा कोड जोड़ें और एक PR खोलें।
