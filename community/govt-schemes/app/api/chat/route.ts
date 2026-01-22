import { NextRequest } from "next/server";
import { MOCK_SCHEMES } from "@/app/lib/scheme-service";

export const runtime = "edge";

// Simple translations for basic responses
const translations: Record<string, Record<string, string>> = {
  en: {
    find_schemes: "Find Schemes",
    farmer_schemes: "Farmer Schemes",
    student_schemes: "Student Schemes",
    women_schemes: "Women Schemes",
    here_are_schemes:
      "Here are some government schemes you might be eligible for:",
    farmer_schemes_desc:
      "Here are government schemes specifically for farmers:",
    student_schemes_desc:
      "Here are education and scholarship schemes for students:",
    women_schemes_desc: "Here are empowerment schemes for women:",
    no_schemes_found:
      "Sorry, no schemes found in this category. Please try other categories or ask about specific schemes.",
    department: "Department",
    description: "Description",
    benefits: "Benefits",
    eligibility: "Eligibility",
    apply: "Apply",
    click_here: "Click here",
    tip: "💡 Tip: Tell me your age, occupation, and location for personalized recommendations!",
    important:
      "⚠️ Important: Always verify eligibility on official government websites before applying.",
  },
  hi: {
    find_schemes: "योजनाएं खोजें",
    farmer_schemes: "किसान योजनाएं",
    student_schemes: "छात्र योजनाएं",
    women_schemes: "महिला योजनाएं",
    here_are_schemes:
      "यहाँ कुछ सरकारी योजनाएं हैं जिनके लिए आप पात्र हो सकते हैं:",
    farmer_schemes_desc: "यहाँ किसानों के लिए विशेष सरकारी योजनाएं हैं:",
    student_schemes_desc:
      "यहाँ छात्रों के लिए शिक्षा और छात्रवृत्ति योजनाएं हैं:",
    women_schemes_desc: "यहाँ महिलाओं के लिए सशक्तिकरण योजनाएं हैं:",
    no_schemes_found:
      "इस श्रेणी में कोई योजना नहीं मिली। कृपया अन्य श्रेणियों को आज़माएं।",
    department: "विभाग",
    description: "विवरण",
    benefits: "लाभ",
    eligibility: "पात्रता",
    apply: "आवेदन करें",
    click_here: "यहाँ क्लिक करें",
    tip: "💡 सुझाव: व्यक्तिगत सिफारिशों के लिए मुझे अपनी उम्र, व्यवसाय और स्थान बताएं!",
    important:
      "⚠️ महत्वपूर्ण: आवेदन करने से पहले हमेशा आधिकारिक सरकारी वेबसाइटों पर पात्रता की पुष्टि करें।",
  },
  bn: {
    find_schemes: "স্কিম খুঁজুন",
    farmer_schemes: "কৃষক স্কিম",
    student_schemes: "ছাত্র স্কিম",
    women_schemes: "মহিলা স্কিম",
    here_are_schemes:
      "এখানে কিছু সরকারি স্কিম রয়েছে যার জন্য আপনি যোগ্য হতে পারেন:",
    farmer_schemes_desc: "এখানে কৃষকদের জন্য বিশেষ সরকারি স্কিম রয়েছে:",
    student_schemes_desc: "এখানে ছাত্রদের জন্য শিক্ষা ও বৃত্তি স্কিম রয়েছে:",
    women_schemes_desc: "এখানে মহিলাদের জন্য ক্ষমতায়ন স্কিম রয়েছে:",
    no_schemes_found: "দুঃখিত, এই বিভাগে কোনো স্কিম পাওয়া যায়নি।",
    department: "বিভাগ",
    description: "বিবরণ",
    benefits: "সুবিধা",
    eligibility: "যোগ্যতা",
    apply: "আবেদন করুন",
    click_here: "এখানে ক্লিক করুন",
    tip: "💡 পরামর্শ: ব্যক্তিগত সুপারিশের জন্য আমাকে আপনার বয়স, পেশা এবং অবস্থান বলুন!",
    important:
      "⚠️ গুরুত্বপূর্ণ: আবেদন করার আগে সর্বদা সরকারি ওয়েবসাইটে যোগ্যতা যাচাই করুন।",
  },
  te: {
    find_schemes: "పథకాలను కనుగొనండి",
    farmer_schemes: "రైతు పథకాలు",
    student_schemes: "విద్యార్థి పథకాలు",
    women_schemes: "మహిళా పథకాలు",
    here_are_schemes: "మీరు అర్హత పొందగల కొన్ని ప్రభుత్వ పథకాలు ఇక్కడ ఉన్నాయి:",
    farmer_schemes_desc: "రైతుల కోసం ప్రత్యేక ప్రభుత్వ పథకాలు ఇక్కడ ఉన్నాయి:",
    student_schemes_desc:
      "విద్యార్థుల కోసం విద్యా మరియు స్కాలర్‌షిప్ పథకాలు ఇక్కడ ఉన్నాయి:",
    women_schemes_desc: "మహిళల సాధికారత పథకాలు ఇక్కడ ఉన్నాయి:",
    no_schemes_found: "క్షమించండి, ఈ వర్గంలో పథకాలు కనుగొనబడలేదు.",
    department: "శాఖ",
    description: "వివరణ",
    benefits: "ప్రయోజనాలు",
    eligibility: "అర్హత",
    apply: "దరఖాస్తు చేయండి",
    click_here: "ఇక్కడ క్లిక్ చేయండి",
    tip: "💡 చిట్కా: వ్యక్తిగత సిఫార్సుల కోసం మీ వయస్సు, వృత్తి మరియు ప్రాంతాన్ని చెప్పండి!",
    important:
      "⚠️ ముఖ్యం: దరఖాస్తు చేయడానికి ముందు ఎల్లప్పుడూ అధికారిక వెబ్‌సైట్‌లలో అర్హతను ధృవీకరించుకోండి.",
  },
  mr: {
    find_schemes: "योजना शोधा",
    farmer_schemes: "शेतकरी योजना",
    student_schemes: "विद्यार्थी योजना",
    women_schemes: "महिला योजना",
    here_are_schemes:
      "येथे काही सरकारी योजना आहेत ज्यासाठी आपण पात्र असू शकता:",
    farmer_schemes_desc: "येथे शेतकऱ्यांसाठी विशेष सरकारी योजना आहेत:",
    student_schemes_desc:
      "येथे विद्यार्थ्यांसाठी शिक्षण आणि शिष्यवृत्ती योजना आहेत:",
    women_schemes_desc: "येथे महिलांसाठी सक्षमीकरण योजना आहेत:",
    no_schemes_found: "क्षमस्व, या श्रेणीत कोणतीही योजना सापडली नाही.",
    department: "विभाग",
    description: "वर्णन",
    benefits: "फायदे",
    eligibility: "पात्रता",
    apply: "अर्ज करा",
    click_here: "येथे क्लिक करा",
    tip: "💡 टीप: वैयक्तिक शिफारसींसाठी मला तुमचे वय, व्यवसाय आणि स्थान सांगा!",
    important:
      "⚠️ महत्वाचे: अर्ज करण्यापूर्वी नेहमी अधिकृत सरकारी वेबसाइटवर पात्रता तपासा.",
  },
  ta: {
    find_schemes: "திட்டங்களைக் கண்டறியவும்",
    farmer_schemes: "விவசாயிகள் திட்டங்கள்",
    student_schemes: "மாணவர் திட்டங்கள்",
    women_schemes: "பெண்கள் திட்டங்கள்",
    here_are_schemes: "நீங்கள் தகுதிபெறக்கூடிய சில அரசுத் திட்டங்கள் இங்கே:",
    farmer_schemes_desc: "விவசாயிகளுக்கான அரசுத் திட்டங்கள் இங்கே:",
    student_schemes_desc:
      "மாணவர்களுக்கான கல்வி மற்றும் உதவித்தொகை திட்டங்கள் இங்கே:",
    women_schemes_desc: "பெண்களுக்கான அதிகாரமளித்தல் திட்டங்கள் இங்கே:",
    no_schemes_found:
      "மன்னிக்கவும், இந்த வகையிலான திட்டங்கள் எதுவும் கிடைக்கவில்லை.",
    department: "துறை",
    description: "விளக்கம்",
    benefits: "நன்மைகள்",
    eligibility: "தகுதி",
    apply: "விண்ணப்பிக்கவும்",
    click_here: "இங்கே கிளிக் செய்யவும்",
    tip: "💡 உதவிக்குறிப்பு: தனிப்பயனாக்கப்பட்ட பரிந்துரைகளுக்கு உங்கள் வயது, தொழில் மற்றும் இருப்பிடத்தைச் சொல்லுங்கள்!",
    important:
      "⚠️ முக்கியம்: விண்ணப்பிப்பதற்கு முன் எப்போதும் அதிகாரப்பூர்வ அரசு இணையதளங்களில் தகுதியைச் சரிபார்க்கவும்.",
  },
  gu: {
    find_schemes: "યોજનાઓ શોધો",
    farmer_schemes: "ખેડૂત યોજનાઓ",
    student_schemes: "વિદ્યાર્થી યોજનાઓ",
    women_schemes: "મહિલા યોજનાઓ",
    here_are_schemes:
      "અહીં કેટલીક સરકારી યોજનાઓ છે જેના માટે તમે પાત્ર હોઈ શકો છો:",
    farmer_schemes_desc: "અહીં ખેડૂતો માટે ખાસ સરકારી યોજનાઓ છે:",
    student_schemes_desc:
      "અહીં વિદ્યાર્થીઓ માટે શિક્ષણ અને શિષ્યવૃત્તિ યોજનાઓ છે:",
    women_schemes_desc: "અહીં મહિલા સશક્તિકરણ યોજનાઓ છે:",
    no_schemes_found: "ક્ષમા કરશો, આ શ્રેણીમાં કોઈ યોજના મળી નથી.",
    department: "વિભાગ",
    description: "વર્ણન",
    benefits: "ફાયદા",
    eligibility: "પાત્રતા",
    apply: "અરજી કરો",
    click_here: "અહીં ક્લિક કરો",
    tip: "💡 ટીપ: વ્યક્તિગત ભલામણો માટે મને તમારી ઉંમર, વ્યવસાય અને સ્થાન જણાવો!",
    important:
      "⚠️ મહત્વપૂર્ણ: અરજી કરતા પહેલા હંમેશા સત્તાવાર સરકારી વેબસાઇટ્સ પર પાત્રતા ચકાસો.",
  },
  ur: {
    find_schemes: "اسکیمیں تلاش کریں",
    farmer_schemes: "کسان اسکیمیں",
    student_schemes: "طالب علم اسکیمیں",
    women_schemes: "خواتین اسکیمیں",
    here_are_schemes:
      "یہاں کچھ سرکاری سکیمیں ہیں جن کے لیے آپ اہل ہو سکتے ہیں:",
    farmer_schemes_desc: "یہاں کسانوں کے لیے خصوصی سرکاری سکیمیں ہیں:",
    student_schemes_desc: "یہاں طلباء کے لیے تعلیم اور وظیفے کی سکیمیں ہیں:",
    women_schemes_desc: "یہاں خواتین کے لیے بااختیار بنانے کی سکیمیں ہیں:",
    no_schemes_found: "معذرت، اس زمرے میں کوئی سکیم نہیں ملی۔",
    department: "محکمہ",
    description: "تفصیل",
    benefits: "فوائد",
    eligibility: "اہلیت",
    apply: "درخواست دیں",
    click_here: "یہاں کلک کریں",
    tip: "💡 مشورہ: ذاتی سفارشات کے لیے مجھے اپنی عمر، پیشہ اور مقام بتائیں!",
    important:
      "⚠️ اہم: درخواست دینے سے پہلے ہمیشہ سرکاری ویب سائٹس پر اہلیت کی تصدیق کریں۔",
  },
  kn: {
    find_schemes: "ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ",
    farmer_schemes: "ರೈತ ಯೋಜನೆಗಳು",
    student_schemes: "ವಿದ್ಯಾರ್ಥಿ ಯೋಜನೆಗಳು",
    women_schemes: "ಮಹಿಳಾ ಯೋಜನೆಗಳು",
    here_are_schemes: "ನೀವು ಅರ್ಹರಾಗಿರುವ ಕೆಲವು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಇಲ್ಲಿವೆ:",
    farmer_schemes_desc: "ರೈತರಿಗಾಗಿ ವಿಶೇಷ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಇಲ್ಲಿವೆ:",
    student_schemes_desc:
      "ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಶಿಕ್ಷಣ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿವೇತನ ಯೋಜನೆಗಳು ಇಲ್ಲಿವೆ:",
    women_schemes_desc: "ಮಹಿಳೆಯರಿಗಾಗಿ ಸಬಲೀಕರಣ ಯೋಜನೆಗಳು ಇಲ್ಲಿವೆ:",
    no_schemes_found: "ಕ್ಷಮಿಸಿ, ಈ ವರ್ಗದಲ್ಲಿ ಯಾವುದೇ ಯೋಜನೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
    department: "ಇಲಾಖೆ",
    description: "ವಿವರಣೆ",
    benefits: "ಪ್ರಯೋಜನಗಳು",
    eligibility: "ಅರ್ಹತೆ",
    apply: "ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
    click_here: "ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ",
    tip: "💡 ಸಲಹೆ: ವೈಯಕ್ತಿಕ ಶಿಫಾರಸುಗಳಿಗಾಗಿ ನಿಮ್ಮ ವಯಸ್ಸು, ಉದ್ಯೋಗ ಮತ್ತು ಸ್ಥಳವನ್ನು ತಿಳಿಸಿ!",
    important:
      "⚠️ ಮುಖ್ಯ: ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಮುನ್ನ ಯಾವಾಗಲೂ ಅಧಿಕೃತ ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ.",
  },
  ml: {
    find_schemes: "പദ്ധതികൾ കണ്ടെത്തുക",
    farmer_schemes: "കർഷക പദ്ധതികൾ",
    student_schemes: "വിദ്യാർത്ഥി പദ്ധതികൾ",
    women_schemes: "വനിതാ പദ്ധതികൾ",
    here_are_schemes: "നിങ്ങൾക്ക് അർഹതയുള്ള ചില സർക്കാർ പദ്ധതികൾ ഇതാ:",
    farmer_schemes_desc: "കർഷകർക്കുള്ള പ്രത്യേക സർക്കാർ പദ്ധതികൾ ഇതാ:",
    student_schemes_desc:
      "വിദ്യാർത്ഥികൾക്കുള്ള വിദ്യാഭ്യാസ, സ്കോളർഷിപ്പ് പദ്ധതികൾ ഇതാ:",
    women_schemes_desc: "വനിതാ ശാക്തീകരണ പദ്ധതികൾ ഇതാ:",
    no_schemes_found: "ക്ഷമിക്കണം, ഈ വിഭാഗത്തിൽ പദ്ധതികളൊന്നും കണ്ടെത്തിയില്ല.",
    department: "വകുപ്പ്",
    description: "വിവരണം",
    benefits: "ആനുകൂല്യങ്ങൾ",
    eligibility: "യോഗ്യത",
    apply: "അപേക്ഷിക്കുക",
    click_here: "ഇവിടെ ക്ലിക്ക് ചെയ്യുക",
    tip: "💡 നിർദ്ദേശം: വ്യക്തിപരമായ ശുപാർശകൾക്കായി നിങ്ങളുടെ പ്രായം, ജോലി, സ്ഥലം എന്നിവ പറയുക!",
    important:
      "⚠️ പ്രധാനം: അപേക്ഷിക്കുന്നതിന് മുമ്പ് ഔദ്യോഗിക സർക്കാർ വെബ്സൈറ്റുകളിൽ യോഗ്യത പരിശോധക്കുക.",
  },
  pa: {
    find_schemes: "ਸਕੀਮਾਂ ਲੱਭੋ",
    farmer_schemes: "ਕਿਸਾਨ ਸਕੀਮਾਂ",
    student_schemes: "ਵਿਦਿਆਰਥੀ ਸਕੀਮਾਂ",
    women_schemes: "ਮਹਿਲਾ ਸਕੀਮਾਂ",
    here_are_schemes:
      "ਇੱਥੇ ਕੁਝ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਹਨ ਜਿਨ੍ਹਾਂ ਲਈ ਤੁਸੀਂ ਯੋਗ ਹੋ ਸਕਦੇ ਹੋ:",
    farmer_schemes_desc: "ਇੱਥੇ ਕਿਸਾਨਾਂ ਲਈ ਵਿਸ਼ੇਸ਼ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਹਨ:",
    student_schemes_desc: "ਇੱਥੇ ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਸਿੱਖਿਆ ਅਤੇ ਵਜ਼ੀਫ਼ਾ ਸਕੀਮਾਂ ਹਨ:",
    women_schemes_desc: "ਇੱਥੇ ਔਰਤਾਂ ਲਈ ਸਸ਼ਕਤੀਕਰਨ ਸਕੀਮਾਂ ਹਨ:",
    no_schemes_found: "ਮੁਆਫ ਕਰੋ, ਇਸ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਕੋਈ ਸਕੀਮ ਨਹੀਂ ਮਿਲੀ।",
    department: "ਵਿਭਾਗ",
    description: "ਵੇਰਵਾ",
    benefits: "ਲਾਭ",
    eligibility: "ਯੋਗਤਾ",
    apply: "ਅਪਲਾਈ ਕਰੋ",
    click_here: "ਇੱਥੇ ਕਲਿੱਕ ਕਰੋ",
    tip: "💡 ਸੁਝਾਅ: ਨਿੱਜੀ ਸਿਫ਼ਾਰਸ਼ਾਂ ਲਈ ਮੈਨੂੰ ਆਪਣੀ ਉਮਰ, ਕਿੱਤਾ ਅਤੇ ਸਥਾਨ ਦੱਸੋ!",
    important:
      "⚠️ ਮਹੱਤਵਪੂਰਨ: ਅਪਲਾਈ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਹਮੇਸ਼ਾਂ ਅਧਿਕਾਰਤ ਸਰਕਾਰੀ ਵੈੱਬਸਾਈਟਾਂ 'ਤੇ ਯੋਗਤਾ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ।",
  },
  or: {
    find_schemes: "ଯୋଜନା ଖୋଜନ୍ତୁ",
    farmer_schemes: "କୃଷକ ଯୋଜନା",
    student_schemes: "ଛାତ୍ର ଯୋଜନା",
    women_schemes: "ମହିଳା ଯୋଜନା",
    here_are_schemes:
      "ଏଠାରେ କିଛି ସରକାରୀ ଯୋଜନା ଅଛି ଯାହା ପାଇଁ ଆପଣ ଯୋଗ୍ୟ ହୋଇପାରନ୍ତି:",
    farmer_schemes_desc: "ଏଠାରେ କୃଷକମାନଙ୍କ ପାଇଁ ବିଶେଷ ସରକାରୀ ଯୋଜନା ଅଛି:",
    student_schemes_desc: "ଏଠାରେ ଛାତ୍ରମାନଙ୍କ ପାଇଁ ଶିକ୍ଷା ଏବଂ ବୃତ୍ତି ଯୋଜନା ଅଛି:",
    women_schemes_desc: "ଏଠାରେ ମହିଳାମାନଙ୍କ ପାଇଁ ସଶକ୍ତିକରଣ ଯୋଜନା ଅଛି:",
    no_schemes_found: "କ୍ଷମା କରନ୍ତୁ, ଏହି ବର୍ଗରେ କୌଣସି ଯୋଜନା ମିଳିଲା ନାହିଁ |",
    department: "ବିଭାଗ",
    description: "ବିବରଣୀ",
    benefits: "ଲାଭ",
    eligibility: "ଯୋଗ୍ୟତା",
    apply: "ଆବେଦନ କରନ୍ତୁ",
    click_here: "ଏଠାରେ କ୍ଲିକ କରନ୍ତୁ",
    tip: "💡 ପରାମର୍ଶ: ବ୍ୟକ୍ତିଗତ ସୁପାରିଶ ପାଇଁ ମୋତେ ଆପଣଙ୍କ ବୟସ, ବୃତ୍ତି ଏବଂ ସ୍ଥାନ କୁହନ୍ତୁ!",
    important:
      "⚠️ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ: ଆବେଦନ କରିବା ପୂର୍ବରୁ ସର୍ବଦା ଅଧିକାରୀ ସରକାରୀ ୱେବସାଇଟ୍ ରେ ଯୋଗ୍ୟତା ଯାଞ୍ଚ କରନ୍ତୁ |",
  },
  as: {
    find_schemes: "আঁচনি বিচাৰক",
    farmer_schemes: "কৃষক আঁচনি",
    student_schemes: "ছাত্ৰ-ছাত্ৰীৰ আঁচনি",
    women_schemes: "মহিলা আঁচনি",
    here_are_schemes:
      "ইয়াত কিছুমান চৰকাৰী আঁচনি দিয়া হৈছে যাৰ বাবে আপুনি যোগ্য হ'ব পাৰে:",
    farmer_schemes_desc: "ইয়াত কৃষকসকলৰ বাবে বিশেষ চৰকাৰী আঁচনি দিয়া হৈছে:",
    student_schemes_desc:
      "ইয়াত ছাত্ৰ-ছাত্ৰীসকলৰ বাবে শিক্ষা আৰু জলপাণি আঁচনি দিয়া হৈছে:",
    women_schemes_desc: "ইয়াত মহিলাসকলৰ বাবে সৱলীকৰণ আঁচনি দিয়া হৈছে:",
    no_schemes_found: "দুখিত, এই শ্ৰেণীত কোনো আঁচনি পোৱা নগ’ল।",
    department: "বিভাগ",
    description: "বিৱৰণ",
    benefits: "সুবিধাসমূহ",
    eligibility: "যোগ্যতা",
    apply: "আবেদন কৰক",
    click_here: "ইয়াত ক্লিক কৰক",
    tip: "💡 পৰামৰ্শ: ব্যক্তিগত অনুমোদনৰ বাবে আপোনাৰ বয়স, বৃত্তি আৰু স্থান জনাওক!",
    important:
      "⚠️ গুৰুত্বপূৰ্ণ: আবেদন কৰাৰ আগতে সদায় চৰকাৰী ৱেবছাইটত যোগ্যতা পৰীক্ষা কৰিব।",
  },
  ks: {
    find_schemes: "سکیمہٕ ژھارِو",
    farmer_schemes: "زَمیندار سِکیمہٕ",
    student_schemes: "تٲلیمی سِکیمہٕ",
    women_schemes: "خواتین ہٕنٛز سِکیمہٕ",
    here_are_schemes:
      "یَتہٕ چھِ کیہہ سَركٲرۍ سِکیمہٕ یِمن خٲطرٕ تُہۍ اَہَل ہِکیو ٲسِتھ:",
    farmer_schemes_desc: "یَتہٕ چھِ زَمیندارن خٲطرٕ خُصوصی سَركٲرۍ سِکیمہٕ:",
    student_schemes_desc:
      "یَتہٕ چھِ طالبہٕ علمن خٲطرٕ تٲلیمی تَہ وَظیفہٕ سِکیمہٕ:",
    women_schemes_desc: "یَتہٕ چھِ زنانن ہٕنٛز  بااختیار سِکیمہٕ:",
    no_schemes_found: "معاف کٔرِو، اَتھ زُمرَس منٛز میج نہٕ کانٛہہ سِکیم۔",
    department: "مَحکمہٕ",
    description: "تَفصيل",
    benefits: "فٲئدہٕ",
    eligibility: "اہلیت",
    apply: "درخواست دِیِو",
    click_here: "یَتہٕ کِلِک کٔرِو",
    tip: "💡 مشورہ: نِجی سِفارِشن خٲطرٕ وَنِو میہٕ پَنِن وٲنٛس، پیشہٕ تَہ ڈِش!",
    important:
      "⚠️ ضٔروری: درخواست دِینہٕ برونٛہہ کٔرِو ہَمیشہٕ سَركٲرۍ ویب سائٹن پؠٹھ اہلیت یَقیٖنی۔",
  },
  mai: {
    find_schemes: "योजना खोजू",
    farmer_schemes: "किसान योजना",
    student_schemes: "छात्र योजना",
    women_schemes: "महिला योजना",
    here_are_schemes: "एतय किछु सरकारी योजना अछि जाहि लेल अहाँ पात्र भ सकय छी:",
    farmer_schemes_desc: "एतय किसान लेल विशेष सरकारी योजना अछि:",
    student_schemes_desc: "एतय छात्र लेल शिक्षा आ छात्रवृत्ति योजना अछि:",
    women_schemes_desc: "एतय महिला लेल सशक्तिकरण योजना अछि:",
    no_schemes_found: "क्षमा करू, अहि श्रेणी में कोनो योजना नहि भेटल।",
    department: "विभाग",
    description: "विवरण",
    benefits: "लाभ",
    eligibility: "पात्रता",
    apply: "आवेदन करू",
    click_here: "एतय क्लिक करू",
    tip: "💡 सुझाव: व्यक्तिगत सिफारिश लेल हमरा अपन उमर, पेशा आ स्थान बताउ!",
    important:
      "⚠️ महत्वपूर्ण: आवेदन करय सं पहिने हमेशा आधिकारिक सरकारी वेबसाइट पर पात्रता के सत्यापन करू।",
  },
};

// Get translation for a key in specified language
function getTranslation(key: string, language: string): string {
  return translations[language]?.[key] || translations["en"][key] || key;
}

// Rate limiting (simple in-memory store for demo)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10; // 10 requests per minute

  const current = rateLimitMap.get(ip);

  if (!current || now > current.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count++;
  return true;
}

// Helper function to generate intelligent responses based on database data
function generateResponse(
  schemes: any[],
  query: string,
  language: string = "en",
  menuAction?: string,
): string {
  if (menuAction) {
    switch (menuAction) {
      case "1":
        return generateSchemeListResponse(
          schemes,
          getTranslation("find_schemes", language),
          getTranslation("here_are_schemes", language),
          language,
        );
      case "2":
        const farmerSchemes = schemes.filter(
          (s) =>
            s.category?.toLowerCase().includes("farmer") ||
            s.category?.toLowerCase().includes("agriculture") ||
            s.name?.toLowerCase().includes("farmer") ||
            s.name?.toLowerCase().includes("kisan") ||
            s.description?.toLowerCase().includes("agriculture") ||
            s.description?.toLowerCase().includes("farmer") ||
            s.description?.toLowerCase().includes("crop"),
        );
        return generateSchemeListResponse(
          farmerSchemes,
          getTranslation("farmer_schemes", language),
          getTranslation("farmer_schemes_desc", language),
          language,
        );
      case "3":
        const studentSchemes = schemes.filter(
          (s) =>
            s.category?.toLowerCase().includes("student") ||
            s.category?.toLowerCase().includes("education") ||
            s.category?.toLowerCase().includes("scholarship") ||
            s.name?.toLowerCase().includes("student") ||
            s.name?.toLowerCase().includes("scholarship") ||
            s.name?.toLowerCase().includes("education") ||
            s.description?.toLowerCase().includes("education") ||
            s.description?.toLowerCase().includes("student") ||
            s.description?.toLowerCase().includes("scholarship"),
        );
        return generateSchemeListResponse(
          studentSchemes,
          getTranslation("student_schemes", language),
          getTranslation("student_schemes_desc", language),
          language,
        );
      case "4":
        const womenSchemes = schemes.filter(
          (s) =>
            s.category?.toLowerCase().includes("women") ||
            s.name?.toLowerCase().includes("women") ||
            s.description?.toLowerCase().includes("women"),
        );
        return generateSchemeListResponse(
          womenSchemes,
          getTranslation("women_schemes", language),
          getTranslation("women_schemes_desc", language),
          language,
        );
      case "5":
        const businessSchemes = schemes.filter(
          (s) =>
            s.category?.toLowerCase().includes("business") ||
            s.name?.toLowerCase().includes("business") ||
            s.description?.toLowerCase().includes("startup"),
        );
        return generateSchemeListResponse(
          businessSchemes,
          "Business Schemes",
          "Here are schemes for business and startups:",
          language,
        );
      case "6":
        return "### Change Language\n\nYou can change the language using the language selector in the top navigation. We support 15+ Indian languages including Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Urdu, Kannada, Malayalam, Punjabi, Odia, Assamese, Kashmiri, and Maithili.";
      case "7":
        return '### How to Use SchemeSaathi\n\n**SchemeSaathi** helps you find government schemes you\'re eligible for:\n\n• **Ask Questions**: Type your questions about schemes\n• **Quick Actions**: Use numbered buttons (1-5) for categories\n• **Profile Matching**: Tell me your age, occupation, income for personalized results\n• **Language Support**: Switch languages using the selector above\n\n**Example Questions:**\n• "I\'m a 25-year-old farmer from Maharashtra"\n• "What schemes are available for women entrepreneurs?"\n• "Tell me about PM Awas Yojana"';
      default:
        return generateSchemeListResponse(
          schemes,
          "Government Schemes",
          "Here are some available government schemes:",
          language,
        );
    }
  }

  // For regular queries, search and respond based on content
  // Simple Mock Search
  const matchingSchemes = schemes.filter(
    (s) =>
      s.name.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      s.category?.toLowerCase().includes(query),
  );

  if (matchingSchemes.length === 0) {
    return `### No Specific Schemes Found\n\nI couldn't find schemes matching "${query}" in our database. However, here are some popular schemes you might be interested in:\n\n• **PM-Kisan**: Direct income support for farmers\n• **PM Awas Yojana**: Housing for all\n• **Ayushman Bharat**: Health insurance scheme\n• **Mudra Loan**: Micro-finance for small businesses\n\nPlease try asking about specific categories like "farmer schemes" or "student scholarships".`;
  }

  return generateSchemeListResponse(
    matchingSchemes,
    "Matching Schemes",
    `Here are schemes matching "${query}":`,
    language,
  );
}

function generateSchemeListResponse(
  schemes: any[],
  title: string,
  intro: string,
  language: string = "en",
): string {
  // Re-declare for clarity in full file replacement
  // (The tool allows pasting partial code, but I'll paste the full function to be safe if `generateSchemeListResponse` was part of the replacement scope.
  // Wait, I am replacing the whole file. So I need to include `generateSchemeListResponse` completely.)

  if (schemes.length === 0) {
    return `### ${title}\n\n${intro}\n\n${getTranslation(
      "no_schemes_found",
      language,
    )}`;
  }

  let response = `### ${title}\n\n${intro}\n\n`;

  schemes.slice(0, 5).forEach((scheme) => {
    response += `**${scheme.name}**\n`;
    response += `*${getTranslation("department", language)}:* ${
      scheme.department || "Government of India"
    }\n`;
    response += `*${getTranslation("description", language)}:* ${
      scheme.description
    }\n`;

    if (scheme.benefits) {
      response += `*${getTranslation("benefits", language)}:* ${
        scheme.benefits
      }\n`;
    }

    if (
      scheme.eligibility_criteria &&
      Object.keys(scheme.eligibility_criteria).length > 0
    ) {
      response += `*${getTranslation("eligibility", language)}:* `;
      const criteria = scheme.eligibility_criteria;
      const eligibilityParts = [];

      if (criteria.age_min || criteria.age_max) {
        eligibilityParts.push(
          `Age: ${criteria.age_min || 0}-${criteria.age_max || "No limit"}`,
        );
      }
      if (criteria.occupation) {
        const occupations = Array.isArray(criteria.occupation)
          ? criteria.occupation.join(", ")
          : criteria.occupation;
        eligibilityParts.push(`Occupation: ${occupations}`);
      }
      if (criteria.income_max) {
        eligibilityParts.push(
          `Max Income: ₹${criteria.income_max.toLocaleString()}`,
        );
      }
      if (criteria.gender) {
        eligibilityParts.push(`Gender: ${criteria.gender}`);
      }

      response += eligibilityParts.join(", ") || "Check official guidelines";
      response += "\n";
    }

    if (scheme.application_url) {
      response += `*${getTranslation("apply", language)}:* [${getTranslation(
        "click_here",
        language,
      )}](${scheme.application_url})\n`;
    }

    response += "\n";
  });

  if (schemes.length > 5) {
    response += `*Showing 5 of ${schemes.length} schemes. Ask for more specific criteria to see additional schemes.*\n\n`;
  }

  response += `${getTranslation("tip", language)}\n\n`;
  response += getTranslation("important", language);

  return response;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return new Response("Rate limit exceeded", { status: 429 });
    }

    // Input validation
    const body = await req.json();
    const { messages, language = "en" } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response("Invalid messages format", { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];

    if (!lastMessage?.content || typeof lastMessage.content !== "string") {
      return new Response("Invalid message content", { status: 400 });
    }

    // Sanitize search query
    const sanitizeQuery = (query: string): string => {
      return query
        .replace(/[^\w\s]/gi, "")
        .trim()
        .toLowerCase();
    };

    // Map quick actions to search queries
    let searchQuery = sanitizeQuery(lastMessage.content);
    const menuActions: Record<string, string> = {
      "1": "government schemes eligibility",
      "2": "farmer agriculture schemes benefits",
      "3": "student education scholarship schemes",
      "4": "women empowerment schemes",
      "5": "business startup loans schemes",
      "6": "how to change language settings",
      "7": "how to use this bot instructions",
    };

    let selectedMenuAction: string | undefined;
    if (menuActions[lastMessage.content.trim()]) {
      selectedMenuAction = lastMessage.content.trim();
      searchQuery = sanitizeQuery(menuActions[lastMessage.content.trim()]);
    }

    // Use Mock Data
    const schemes = MOCK_SCHEMES;

    // Generate intelligent response based on mock data
    const response = generateResponse(
      schemes || [],
      searchQuery,
      language,
      selectedMenuAction,
    );

    return new Response(response, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    // Return structured error response
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        error: "Sorry, I encountered an error. Please try again.",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
