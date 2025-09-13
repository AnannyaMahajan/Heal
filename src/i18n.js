import i18n from "i18next"
import { initReactI18next } from "react-i18next"

const resources = {
  en: {
    translation: {
      dashboard: "Dashboard",
      reportCase: "Report Case",
      waterQuality: "Water Quality",
      aiPredictions: "AI Predictions",
      alerts: "Alerts"
    }
  },
  hi: {
    translation: {
      dashboard: "डैशबोर्ड",
      reportCase: "मामला दर्ज करें",
      waterQuality: "पानी की गुणवत्ता",
      aiPredictions: "एआई भविष्यवाणी",
      alerts: "चेतावनी"
    }
  },
  as: {
    translation: {
      dashboard: "ডেশ্বাৰ্ড",
      reportCase: "কেছ প্ৰতিবেদন কৰক",
      waterQuality: "পানীৰ গুণমান",
      aiPredictions: "এআই পূৰ্বাভাস",
      alerts: "সতৰ্কবাণী"
    }
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
})

export default i18n
