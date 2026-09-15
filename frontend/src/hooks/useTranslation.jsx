import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    brand_tagline: "Many small farms · One stronger supply",
    sell_produce: "Sell Produce",
    source_bulk: "Source in Bulk",
    my_produce: "My Produce",
    opportunities: "Opportunities",
    my_orders: "Orders & Contracts",
    payouts: "Payments & Earnings",
    operations: "Operations Console",
    procurement: "Procurement Portal",
    sign_in: "Sign In",
    sign_out: "Sign Out",
    welcome: "Welcome back",
    home: "Home",
    quality_check: "Quality Check",
    moisture: "Moisture",
    verified: "Certified Verified",
    pending: "Pending Review",
    paddy: "Paddy (Rice)",
    wheat: "Wheat",
    pulses: "Pulses (Toor Dal)",
    oilseeds: "Oilseeds (Mustard)",
    offline_msg: "Saved offline. Will synchronize automatically when connection resumes.",
    online_msg: "Connected to FarmUnity Network",
  },
  te: {
    brand_tagline: "చిన్న రైతులు · బలమైన ఉమ్మడి సరఫరా",
    sell_produce: "పంట విక్రయించండి",
    source_bulk: "టోకు కొనుగోలు",
    my_produce: "నా పంట వివరాలు",
    opportunities: "కొనుగోలు అవకాశాలు",
    my_orders: "ఆర్డర్లు & ఒప్పందాలు",
    payouts: "చెల్లింపులు & సంపాదన",
    operations: "నిర్వహణ కేంద్రం",
    procurement: "కొనుగోలు కేంద్రం",
    sign_in: "లాగిన్ అవ్వండి",
    sign_out: "లాగౌట్",
    welcome: "స్వాగతం",
    home: "హోమ్",
    quality_check: "నాణ్యత పరిశీలన",
    moisture: "తేమ శాతం",
    verified: "ధృవీకరించబడింది",
    pending: "పరిశీలనలో ఉంది",
    paddy: "వరి / ధాన్యం",
    wheat: "గోధుమలు",
    pulses: "కందులు / పప్పుధాన్యాలు",
    oilseeds: "ఆవాలు / నూనెగింజలు",
    offline_msg: "ఆఫ్‌లైన్‌లో భద్రపరచబడింది. ఇంటర్నెట్ రాగానే అప్‌లోడ్ అవుతుంది.",
    online_msg: "ఫార్మ్‌యూనిటీ నెట్‌వర్క్‌తో అనుసంధానించబడింది",
  },
  hi: {
    brand_tagline: "अनेक छोटे खेत · एक मजबूत आपूर्ति",
    sell_produce: "फसल बेचें",
    source_bulk: "थोक खरीद",
    my_produce: "मेरी फसलें",
    opportunities: "खरीद अवसर",
    my_orders: "ऑर्डर व अनुबंध",
    payouts: "भुगतान व आय",
    operations: "प्रबंधन केंद्र",
    procurement: "खरीद पोर्टल",
    sign_in: "लॉग इन करें",
    sign_out: "लॉग आउट",
    welcome: "स्वागत है",
    home: "मुख्य पृष्ठ",
    quality_check: "गुणवत्ता जांच",
    moisture: "नमी प्रतिशत",
    verified: "सत्यापित",
    pending: "समीक्षा जारी",
    paddy: "धान (चावल)",
    wheat: "गेहूं",
    pulses: "दालें (अरहर)",
    oilseeds: "तिलहन (सरसों)",
    offline_msg: "ऑफ़लाइन सहेजा गया। इंटरनेट आने पर सिंक हो जाएगा।",
    online_msg: "फार्मयूनिटी नेटवर्क से जुड़ा हुआ",
  }
};

const defaultT = (key, fallback = '') => {
  return translations['en']?.[key] || fallback || key;
};

const defaultContext = {
  lang: 'en',
  switchLanguage: () => {},
  t: defaultT,
};

const TranslationContext = createContext(defaultContext);

export const TranslationProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('farmunity_lang') || 'en');

  const switchLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('farmunity_lang', newLang);
  };

  const t = (key, fallback = '') => {
    return translations[lang]?.[key] || translations['en']?.[key] || fallback || key;
  };

  return (
    <TranslationContext.Provider value={{ lang, switchLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const ctx = useContext(TranslationContext);
  return ctx || defaultContext;
};
