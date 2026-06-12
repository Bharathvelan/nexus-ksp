import React, { createContext, useState, useContext } from 'react';

type Language = 'en' | 'kn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    "NEXUS-KSP Field App": "NEXUS-KSP Field App",
    "Welcome, Officer": "Welcome, Officer",
    "Badge #49201": "Badge #49201",
    "Voice Intelligence": "Voice Intelligence",
    "Dictate field notes & translate": "Dictate field notes & translate",
    "FIR Lookup": "FIR Lookup",
    "Access digital records": "Access digital records",
    "AI Dispatch": "AI Dispatch",
    "Receive smart patrol routes": "Receive smart patrol routes",
    "AR Crime Scene Scanner": "AR Crime Scene Scanner",
    "Scan for digital evidence": "Scan for digital evidence",
    "Tactical Swarm": "Tactical Swarm",
    "Deploy drone surveillance": "Deploy drone surveillance",
    "Record Evidence": "Record Evidence",
    "Press to dictate field notes": "Press to dictate field notes",
    "Listening...": "Listening...",
    "Live Translation (Kannada -> English):": "Live Translation (Kannada -> English):",
    "Awaiting audio input...": "Awaiting audio input...",
    "Smart Patrol Routes": "Smart Patrol Routes",
    "High Risk": "High Risk",
    "Medium Risk": "Medium Risk",
    "Sector 4, Indiranagar": "Sector 4, Indiranagar",
    "Recent chain snatchings.": "Recent chain snatchings.",
    "Koramangala 8th Block": "Koramangala 8th Block",
    "Suspicious vehicle reported.": "Suspicious vehicle reported.",
    "Officer Dashboard": "Officer Dashboard",
    "Capture Intel": "Capture Intel",
    "DEPLOY TACTICAL SWARM": "DEPLOY TACTICAL SWARM",
    "LAUNCH AR CRIME SCANNER": "LAUNCH AR CRIME SCANNER",
    "PROCEED TO AI DISPATCH": "PROCEED TO AI DISPATCH",
    "Active Alerts": "Active Alerts",
    "LIVE": "LIVE",
    "No active alerts. Policies are clear.": "No active alerts. Policies are clear.",
    "Field Intelligence": "Field Intelligence",
    "Capture voice notes directly to FIR dossier": "Capture voice notes directly to FIR dossier",
    "Audio captured successfully.": "Audio captured successfully.",
    "Analyzing Spectrogram for Deepfakes...": "Analyzing Spectrogram for Deepfakes...",
    "✓ VERIFIED HUMAN (98%)": "✓ VERIFIED HUMAN (98%)",
    "⚠ SYNTHETIC AUDIO DETECTED": "⚠ SYNTHETIC AUDIO DETECTED",
    "Scanning...": "Scanning...",
    "Upload & Scan": "Upload & Scan",
    "Recording in progress...": "Recording in progress...",
    "Tap to Record (Kannada/English)": "Tap to Record (Kannada/English)",
    "Proceed to Bangalore Central. High probability of property crime based on DBSCAN predictive spatial model.": "Proceed to Bangalore Central. High probability of property crime based on DBSCAN predictive spatial model.",
    "Active Patrol Route": "Active Patrol Route",
    "TARGET:": "TARGET:",
    "RISK": "RISK",
    "[ Map UI Rendering Area ]": "[ Map UI Rendering Area ]",
    "AI Dispatch Instructions:": "AI Dispatch Instructions:",
    "Dispatch Confirmed": "Dispatch Confirmed",
    "CONFIRM EN ROUTE": "CONFIRM EN ROUTE",
    "Awaiting dispatch coordinates...": "Awaiting dispatch coordinates..."
  },
  kn: {
    "NEXUS-KSP Field App": "ನೆಕ್ಸಸ್-ಕೆಎಸ್ಪಿ ಫೀಲ್ಡ್ ಆಪ್",
    "Welcome, Officer": "ಸ್ವಾಗತ, ಅಧಿಕಾರಿ",
    "Badge #49201": "ಬ್ಯಾಡ್ಜ್ #49201",
    "Voice Intelligence": "ಧ್ವನಿ ಗುಪ್ತಚರ",
    "Dictate field notes & translate": "ಕ್ಷೇತ್ರದ ಟಿಪ್ಪಣಿಗಳನ್ನು ನಿರ್ದೇಶಿಸಿ ಮತ್ತು ಅನುವಾದಿಸಿ",
    "FIR Lookup": "FIR ಲುಕ್ಅಪ್",
    "Access digital records": "ಡಿಜಿಟಲ್ ದಾಖಲೆಗಳನ್ನು ಪ್ರವೇಶಿಸಿ",
    "AI Dispatch": "AI ರವಾನೆ",
    "Receive smart patrol routes": "ಸ್ಮಾರ್ಟ್ ಗಸ್ತು ಮಾರ್ಗಗಳನ್ನು ಸ್ವೀಕರಿಸಿ",
    "AR Crime Scene Scanner": "AR ಕ್ರೈಮ್ ಸೀನ್ ಸ್ಕ್ಯಾನರ್",
    "Scan for digital evidence": "ಡಿಜಿಟಲ್ ಸಾಕ್ಷ್ಯಗಳಿಗಾಗಿ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    "Tactical Swarm": "ಯುದ್ಧತಂತ್ರದ ಡ್ರೋನ್",
    "Deploy drone surveillance": "ಡ್ರೋನ್ ಕಣ್ಗಾವಲು ನಿಯೋಜಿಸಿ",
    "Record Evidence": "ಸಾಕ್ಷ್ಯವನ್ನು ದಾಖಲಿಸಿ",
    "Press to dictate field notes": "ಕ್ಷೇತ್ರದ ಟಿಪ್ಪಣಿಗಳನ್ನು ನಿರ್ದೇಶಿಸಲು ಒತ್ತಿರಿ",
    "Listening...": "ಆಲಿಸಲಾಗುತ್ತಿದೆ...",
    "Live Translation (Kannada -> English):": "ಲೈವ್ ಅನುವಾದ (ಕನ್ನಡ -> ಇಂಗ್ಲಿಷ್):",
    "Awaiting audio input...": "ಆಡಿಯೊ ಇನ್‌ಪುಟ್‌ಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ...",
    "Smart Patrol Routes": "ಸ್ಮಾರ್ಟ್ ಗಸ್ತು ಮಾರ್ಗಗಳು",
    "High Risk": "ಹೆಚ್ಚಿನ ಅಪಾಯ",
    "Medium Risk": "ಮಧ್ಯಮ ಅಪಾಯ",
    "Sector 4, Indiranagar": "ಸೆಕ್ಟರ್ 4, ಇಂದಿರಾನಗರ",
    "Recent chain snatchings.": "ಇತ್ತೀಚಿನ ಚೈನ್ ಕಸಿಯುವಿಕೆಗಳು.",
    "Koramangala 8th Block": "ಕೋರಮಂಗಲ 8ನೇ ಬ್ಲಾಕ್",
    "Suspicious vehicle reported.": "ಅನುಮಾನಾಸ್ಪದ ವಾಹನ ವರದಿಯಾಗಿದೆ.",
    "Officer Dashboard": "ಅಧಿಕಾರಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "Capture Intel": "ಮಾಹಿತಿ ಸೆರೆಹಿಡಿಯಿರಿ",
    "DEPLOY TACTICAL SWARM": "ಯುದ್ಧತಂತ್ರದ ಡ್ರೋನ್ ನಿಯೋಜಿಸಿ",
    "LAUNCH AR CRIME SCANNER": "AR ಕ್ರೈಮ್ ಸ್ಕ್ಯಾನರ್ ಪ್ರಾರಂಭಿಸಿ",
    "PROCEED TO AI DISPATCH": "AI ರವಾನೆಗೆ ಮುಂದುವರಿಯಿರಿ",
    "Active Alerts": "ಸಕ್ರಿಯ ಎಚ್ಚರಿಕೆಗಳು",
    "LIVE": "ಲೈವ್",
    "No active alerts. Policies are clear.": "ಯಾವುದೇ ಸಕ್ರಿಯ ಎಚ್ಚರಿಕೆಗಳಿಲ್ಲ.",
    "Field Intelligence": "ಕ್ಷೇತ್ರ ಗುಪ್ತಚರ",
    "Capture voice notes directly to FIR dossier": "FIR ಡೋಸಿಯರ್‌ಗೆ ನೇರವಾಗಿ ಧ್ವನಿ ಟಿಪ್ಪಣಿಗಳನ್ನು ಸೆರೆಹಿಡಿಯಿರಿ",
    "Audio captured successfully.": "ಆಡಿಯೊವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸೆರೆಹಿಡಿಯಲಾಗಿದೆ.",
    "Analyzing Spectrogram for Deepfakes...": "ಡೀಪ್‌ಫೇಕ್‌ಗಳಿಗಾಗಿ ಸ್ಪೆಕ್ಟ್ರೋಗ್ರಾಮ್ ಅನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
    "✓ VERIFIED HUMAN (98%)": "✓ ಪರಿಶೀಲಿಸಿದ ಮಾನವ (98%)",
    "⚠ SYNTHETIC AUDIO DETECTED": "⚠ ಸಿಂಥೆಟಿಕ್ ಆಡಿಯೊ ಪತ್ತೆಯಾಗಿದೆ",
    "Scanning...": "ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    "Upload & Scan": "ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    "Recording in progress...": "ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಗತಿಯಲ್ಲಿದೆ...",
    "Tap to Record (Kannada/English)": "ರೆಕಾರ್ಡ್ ಮಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ (ಕನ್ನಡ/ಇಂಗ್ಲಿಷ್)",
    "Proceed to Bangalore Central. High probability of property crime based on DBSCAN predictive spatial model.": "ಬೆಂಗಳೂರು ಸೆಂಟ್ರಲ್‌ಗೆ ಮುಂದುವರಿಯಿರಿ. DBSCAN ಮುನ್ಸೂಚಕ ಪ್ರಾದೇಶಿಕ ಮಾದರಿಯ ಆಧಾರದ ಮೇಲೆ ಆಸ್ತಿ ಅಪರಾಧದ ಹೆಚ್ಚಿನ ಸಂಭವನೀಯತೆ.",
    "Active Patrol Route": "ಸಕ್ರಿಯ ಗಸ್ತು ಮಾರ್ಗ",
    "TARGET:": "ಗುರಿ:",
    "RISK": "ಅಪಾಯ",
    "[ Map UI Rendering Area ]": "[ ನಕ್ಷೆ UI ರೆಂಡರಿಂಗ್ ಪ್ರದೇಶ ]",
    "AI Dispatch Instructions:": "AI ರವಾನೆ ಸೂಚನೆಗಳು:",
    "Dispatch Confirmed": "ರವಾನೆ ದೃಢಪಡಿಸಲಾಗಿದೆ",
    "CONFIRM EN ROUTE": "ಮಾರ್ಗದಲ್ಲಿರುವುದನ್ನು ದೃಢೀಕರಿಸಿ",
    "Awaiting dispatch coordinates...": "ರವಾನೆ ನಿರ್ದೇಶಾಂಕಗಳಿಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ..."
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
