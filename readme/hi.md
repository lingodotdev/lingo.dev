<p align="center">
  <a href="https://lingo.dev">
    <img src="/content/banner.dark.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡️ वेब और मोबाइल के लिए AI लोकलाइजेशन टूलकिट, सीधे CI/CD से।</strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev">वेबसाइट</a> •
  <a href="https://github.com/lingodotdev/lingo.dev/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">योगदान करें</a> •
  <a href="#-github-action">GitHub Action</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg" alt="Release" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="License" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Last Commit" />
  </a>
</p>

<br />

Lingo.dev नवीनतम LLM मॉडल्स का उपयोग करके सॉफ्टवेयर लोकलाइजेशन को एंड-टू-एंड स्वचालित करता है।

यह तुरंत प्रामाणिक अनुवाद प्रदान करता है, जिससे मैनुअल काम और प्रबंधन ओवरहेड समाप्त हो जाता है। Lingo.dev लोकलाइजेशन इंजन प्रोडक्ट कॉन्टेक्स्ट को समझता है, और 60+ भाषाओं में नेटिव स्पीकर्स की अपेक्षाओं के अनुरूप परफेक्ट अनुवाद तैयार करता है। परिणामस्वरूप, टीमें 100 गुना तेजी से लोकलाइजेशन कर सकती हैं, स्टेट-ऑफ-द-आर्ट क्वालिटी के साथ, और दुनिया भर में अधिक पेइंग कस्टमर्स को फीचर्स डिलीवर कर सकती हैं।

## 💫 क्विकस्टार्ट

1. [वेबसाइट](https://lingo.dev) पर एक अकाउंट बनाएं

2. अपने प्रोजेक्ट को इनिशियलाइज करें:

   ```bash
   npx lingo.dev@latest init
   ```

3. हमारा डॉक्स देखें: [docs.lingo.dev](https://docs.lingo.dev)

4. अपने ऐप का लोकलाइजेशन करें (सेकंड्स में):
   ```bash
   npx lingo.dev@latest i18n
   ```

## 🤖 GitHub Action

Lingo.dev आपके सीआई/सीडी पाइपलाइन में लोकलाइजेशन को ऑटोमेट करने के लिए GitHub Action प्रदान करता है। यहाँ एक बेसिक सेटअप है:

```yaml
- uses: lingodotdev/lingo.dev@main
  with:
    api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

यह एक्शन हर पुश पर `lingo.dev i18n` चलाता है, जिससे आपके अनुवाद स्वचालित रूप से अप-टू-डेट रहते हैं।

पुल रिक्वेस्ट मोड और अन्य कॉन्फ़िगरेशन विकल्पों के लिए, हमारा [GitHub Action डॉक्यूमेंटेशन](https://docs.lingo.dev/setup/gha) देखें।

## 🥇 टीमें Lingo.dev को क्यों चुनती हैं

- 🔥 **इंस्टेंट इंटीग्रेशन**: मिनटों में सेटअप करें
- 🔄 **CI/CD ऑटोमेशन**: डेव पाइपलाइन में सहज एकीकरण
- 🌍 **60+ भाषाएं**: आसानी से वैश्विक स्तर पर विस्तार करें
- 🧠 **AI लोकलाइजेशन इंजन**: अनुवाद जो वास्तव में आपके प्रोडक्ट के अनुरूप हैं
- 📊 **फॉर्मेट फ्लेक्सिबल**: JSON, YAML, CSV, मार्कडाउन और अधिक का समर्थन करता है

## 🛠️ सुपरचार्ज्ड फीचर्स

- ⚡️ **बिजली की गति**: सेकंडों में AI लोकलाइजेशन
- 🔄 **ऑटो-अपडेट**: नवीनतम कंटेंट के साथ सिंक
- 🌟 **नेटिव क्वालिटी**: प्रामाणिक लगने वाले अनुवाद
- 👨‍💻 **डेवलपर-फ्रेंडली**: आपके वर्कफ्लो के साथ एकीकृत CLI
- 📈 **स्केलेबल**: बढ़ते स्टार्टअप्स और एंटरप्राइज टीमों के लिए

## 📚 डॉक्युमेंटेशन

विस्तृत गाइड और एपीआई रेफरेंस के लिए, [डॉक्युमेंटेशन](https://lingo.dev/go/docs) देखें।

## 🤝 योगदान

योगदान करने में रुचि है, भले ही आप कस्टमर नहीं हैं?

[गुड फर्स्ट इश्यूज](https://github.com/lingodotdev/lingo.dev/labels/good%20first%20issue) देखें और [कंट्रिब्यूटिंग गाइड](./CONTRIBUTING.md) पढ़ें।

## 👨‍💻 टीम

- **[वेरोनिका](https://github.com/vrcprl)**
- **[मैक्स](https://github.com/maxprilutskiy)**
- **[मातेज](https://github.com/mathio)**

कोई सवाल या पूछताछ? veronica@lingo.dev पर ईमेल करें

## 🌐 अन्य भाषाओं में रीडमी

- [अंग्रेजी](https://github.com/lingodotdev/lingo.dev)
- [स्पेनिश](/readme/es.md)
- [फ्रेंच](/readme/fr.md)
- [रूसी](/readme/ru.md)
- [जर्मन](/readme/de.md)
- [चीनी](/readme/zh-Hans.md)
- [कोरियाई](/readme/ko.md)
- [जापानी](/readme/ja.md)
- [इतालवी](/readme/it.md)
- [अरबी](/readme/ar.md)
- [हिंदी](/readme/hi.md)

अपनी भाषा नहीं दिख रही? बस [`i18n.json`](./i18n.json) फाइल में एक नई भाषा कोड जोड़ें और एक PR खोलें।
