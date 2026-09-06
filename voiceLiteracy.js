/**
 * SwasthyaSetu — Voice Health Literacy & Audio Assistance Engine
 * Uses Web Speech API and Web Audio synthesizer to provide spoken guidance in regional languages
 * for low health-literacy rural patients and frontline ASHA/ANM workers.
 */

const VoiceLiteracy = {
  synth: window.speechSynthesis,
  isSpeaking: false,
  activeLang: 'en',

  translations: {
    en: {
      triage_red: "Warning. Red Flag Emergency detected. Severe danger signs present. Immediate 108 ambulance dispatch and stabilization required.",
      triage_yellow: "Priority referral advised. Patient requires specialist evaluation at Community Health Centre within 24 hours.",
      triage_green: "Routine primary care protocol. Continue oral medications and scheduled follow-up at local Sub-Centre.",
      maternal_care: "Maternal Health Guidance: Take one Iron Folic Acid tablet daily after food. Avoid heavy lifting. If severe headache or bleeding occurs, call 108 immediately.",
      child_care: "Pediatric Advice: Continue frequent breastfeeding and Oral Rehydration Solution. Watch for fast breathing or chest drawing.",
      ncd_care: "Chronic Care: Continue daily blood pressure medicine every morning. Reduce salt intake. Next checkup scheduled in 14 days."
    },
    hi: {
      triage_red: "चेतावनी! आपातकालीन स्थिति है। तुरंत 108 एम्बुलेंस बुलाएं और प्राथमिक उपचार दें।",
      triage_yellow: "प्राथमिकता परामर्श की आवश्यकता है। 24 घंटे के भीतर सामुदायिक स्वास्थ्य केंद्र पर डॉक्टर को दिखाएं।",
      triage_green: "सामान्य स्थिति। दवाएं समय पर लें और 14 दिन बाद उप-स्वास्थ्य केंद्र पर जांच कराएं।",
      maternal_care: "मातृ स्वास्थ्य सलाह: भोजन के बाद रोजाना एक आयरन की गोली लें। भारी वजन न उठाएं। गंभीर सिरदर्द होने पर तुरंत 108 पर संपर्क करें।",
      child_care: "शिशु देखभाल सलाह: स्तनपान जारी रखें और ओआरएस घोल पिलाएं। यदि बच्चा तेजी से सांस ले, तो तुरंत अस्पताल ले जाएं।",
      ncd_care: "दीर्घकालिक रोग सलाह: बीपी की दवा रोज सुबह लें। नमक कम खाएं। अगली जांच 14 दिन बाद है।"
    },
    bn: {
      triage_red: "সতর্কতা! জরুরি অবস্থা। অবিলম্বে 108 অ্যাম্বুলেন্স ডাকুন এবং রোগীকে স্থিতিশীল করুন।",
      triage_yellow: "বিশেষজ্ঞ পরামর্শ প্রয়োজন। 24 ঘণ্টার মধ্যে স্বাস্থ্যকেন্দ্রে যান।",
      triage_green: "স্বাভাবিক অবস্থা। নিয়মিত ওষুধ খান এবং উপকেন্দ্রে ফলো-আপ করুন।",
      maternal_care: "মাতৃ স্বাস্থ্য নির্দেশিকা: খাবারের পর প্রতিদিন একটি আয়রন ট্যাবলেট খান। রক্তপাত হলে অবিলম্বে 108 এ কল করুন।",
      child_care: "শিশু যত্ন: বুকের দুধ খাওয়ানো এবং ওআরএস চালিয়ে যান। শ্বাসকষ্ট হলে দ্রুত হাসপাতালে নিন।",
      ncd_care: "উচ্চ রক্তচাপের ওষুধ প্রতিদিন সকালে খান। লবণের পরিমাণ কমান।"
    },
    ta: {
      triage_red: "எச்சரிக்கை! அவசர நிலை. உடனடியாக 108 ஆம்புலன்ஸை அழைக்கவும்.",
      triage_yellow: "24 மணி நேரத்திற்குள் மருத்துவரை அணுகவும்.",
      triage_green: "வழக்கமான பராமரிப்பு. மருந்துகளை சரியான நேரத்தில் உட்கொள்ளுங்கள்.",
      maternal_care: "தாய்ப்பால் வழிகாட்டுதல்: தினமும் உணவுக்குப் பின் இரும்பு மாத்திரை சாப்பிடவும்.",
      child_care: "குழந்தை பராமரிப்பு: தாய்ப்பால் கொடுப்பதை தொடரவும். ஓ.ஆர்.எஸ் கரைசல் வழங்கவும்.",
      ncd_care: "ரத்த அழுத்த மாத்திரையை தினமும் காலையில் தவறாமல் உட்கொள்ளுங்கள்."
    },
    te: {
      triage_red: "హెచ్చరిక! అత్యవసర పరిస్థితి. వెంటనే 108 అంబులెన్స్‌కు కాల్ చేయండి.",
      triage_yellow: "24 గంటల్లోగా సమీప కమ్యూనిటీ హెల్త్ సెంటర్‌ను సంప్రదించండి.",
      triage_green: "సాధారణ పరిస్థితి. మందులను క్రమం తప్పకుండా వాడండి.",
      maternal_care: "గర్భిణీ స్త్రీల సలహా: ప్రతిరోజూ ఆహారం తర్వాత ఐరన్ మాత్ర వేసుకోండి.",
      child_care: "శిశు సంరక్షణ: తల్లి పాలు ఇవ్వడం కొనసాగించండి. ఓఆర్ఎస్ ద్రావణం ఇవ్వండి.",
      ncd_care: "బీపీ మందును రోజూ ఉదయం తప్పనిసరిగా వేసుకోండి."
    },
    mr: {
      triage_red: "धोका! तातडीची परिस्थिती आहे. त्वरित 108 रुग्णवाहिका बोलवा.",
      triage_yellow: "24 तासांच्या आत तज्ज्ञ डॉक्टरांचा सल्ला घ्या.",
      triage_green: "सामान्य स्थिती. वेळेवर औषधे घ्या आणि उपकेंद्रात तपासणी करा.",
      maternal_care: "मातृ आरोग्य सल्ला: जेवणानंतर रोज एक आयर्न गोळी घ्या. जास्त वजन उचलू नका.",
      child_care: "बाल संगोपन: स्तनपान सुरू ठेवा आणि ओआरएस द्या. श्वास जलद असल्यास त्वरित रुग्णालयात जा.",
      ncd_care: "रक्तदाबाची गोळी रोज सकाळी वेळेवर घ्या. आहारात मिठाचे प्रमाण कमी करा."
    }
  },

  setLanguage(lang) {
    this.activeLang = this.translations[lang] ? lang : 'en';
  },

  speak(text, lang = null) {
    if (!('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      return;
    }

    const targetLang = lang || this.activeLang;
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    const langCodeMap = {
      en: 'en-IN',
      hi: 'hi-IN',
      bn: 'bn-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      mr: 'mr-IN'
    };

    utterance.lang = langCodeMap[targetLang] || 'en-US';
    utterance.rate = 0.92; // Slightly slower for clear rural health counseling
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
      document.querySelectorAll('.voice-play-btn').forEach(b => b.classList.add('playing'));
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      document.querySelectorAll('.voice-play-btn').forEach(b => b.classList.remove('playing'));
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      document.querySelectorAll('.voice-play-btn').forEach(b => b.classList.remove('playing'));
      console.warn('Speech error:', e);
    };

    this.synth.speak(utterance);
  },

  speakTopic(topicKey) {
    const langDict = this.translations[this.activeLang] || this.translations['en'];
    const text = langDict[topicKey] || this.translations['en'][topicKey];
    if (text) {
      this.speak(text, this.activeLang);
      const previewElem = document.getElementById('voice-preview-text');
      if (previewElem) {
        previewElem.textContent = text;
      }
    }
  },

  stop() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
      this.isSpeaking = false;
      document.querySelectorAll('.voice-play-btn').forEach(b => b.classList.remove('playing'));
    }
  },

  // Audio tone beeps for ECG/Emergency cues
  playEmergencyTone() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(440, ctx.currentTime + 0.15);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch (e) {}
  }
};

window.VoiceLiteracy = VoiceLiteracy;
