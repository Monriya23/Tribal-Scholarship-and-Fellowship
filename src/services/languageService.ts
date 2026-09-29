import React from 'react';

// Language & Localization Service (English, Hindi & Tamil support)

export type SupportedLanguage = 'en' | 'hi' | 'ta';

export interface TranslationDictionary {
  // Navigation & Common
  nav_home: string;
  nav_find_scholarships: string;
  nav_my_applications: string;
  nav_documents: string;
  nav_payments: string;
  nav_fellowship: string;
  nav_help: string;
  nav_institution_desk: string;
  nav_state_desk: string;
  nav_ministry_desk: string;
  nav_reviewer_desk: string;
  
  // Landing Hero
  hero_title: string;
  hero_subtitle: string;
  hero_btn_find: string;
  hero_btn_track: string;
  hero_btn_login: string;
  
  // Quick Steps
  step_1_title: string;
  step_1_desc: string;
  step_2_title: string;
  step_2_desc: string;
  step_3_title: string;
  step_3_desc: string;
  step_4_title: string;
  step_4_desc: string;

  // Student Dashboard
  welcome_back: string;
  dashboard_subtitle: string;
  active_applications: string;
  action_required: string;
  upcoming_renewal: string;
  payment_status: string;
  your_applications: string;
  fix_now: string;
  view_application: string;
  track_status: string;

  // Scheme Finder
  finder_title: string;
  finder_subtitle: string;
  finder_step1_q: string;
  finder_step2_q: string;
  finder_step3_q: string;
  finder_btn_show: string;
  check_eligibility: string;
  start_application: string;

  // Status Badges
  status_verified: string;
  status_under_review: string;
  status_action_required: string;
  status_approved: string;
  status_completed: string;
  status_payment_credited: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    nav_home: 'Home',
    nav_find_scholarships: 'Find Scholarships',
    nav_my_applications: 'My Applications',
    nav_documents: 'Document Check',
    nav_payments: 'Payments & DBT',
    nav_fellowship: 'Fellowship Journey',
    nav_help: 'Need Help?',
    nav_institution_desk: 'Institution Verification',
    nav_state_desk: 'State Portal',
    nav_ministry_desk: 'Ministry Portal',
    nav_reviewer_desk: 'Selection Committee',

    hero_title: 'Scholarships & Fellowships for Tribal Students',
    hero_subtitle: 'Find the right scheme, apply with confidence, track your application, and understand every step of your journey.',
    hero_btn_find: 'Find Scholarships',
    hero_btn_track: 'Track Application',
    hero_btn_login: 'Student Login',

    step_1_title: '1. Discover Schemes',
    step_1_desc: 'Answer a few simple questions to find schemes tailored to your study level and field.',
    step_2_title: '2. Check Eligibility',
    step_2_desc: 'Instantly verify your eligibility before applying with clear guidance.',
    step_3_title: '3. Easy Application & Document Check',
    step_3_desc: 'Upload certificates with automatic pre-check that alerts you to any discrepancies.',
    step_4_title: '4. Direct Benefit Transfer (DBT)',
    step_4_desc: 'Transparent verification and direct stipend payments into your Aadhaar-seeded account.',

    welcome_back: 'Welcome back',
    dashboard_subtitle: "Here's what's happening with your applications.",
    active_applications: 'Active Applications',
    action_required: 'Action Required',
    upcoming_renewal: 'Upcoming Milestone',
    payment_status: 'Payment Status',
    your_applications: 'Your Applications',
    fix_now: 'Fix Now',
    view_application: 'View Application',
    track_status: 'Track Timeline',

    finder_title: "Let's find scholarships you may be eligible for",
    finder_subtitle: 'Select your study level and background to see matching Ministry of Tribal Affairs schemes.',
    finder_step1_q: 'What are you currently studying?',
    finder_step2_q: 'Where are you studying?',
    finder_step3_q: 'What type of financial support are you looking for?',
    finder_btn_show: 'Show Matching Schemes',
    check_eligibility: 'Check My Eligibility',
    start_application: 'Start Application',

    status_verified: 'Verified',
    status_under_review: 'Under Verification',
    status_action_required: 'Action Required',
    status_approved: 'Approved',
    status_completed: 'Completed',
    status_payment_credited: 'Directly Credited'
  },
  hi: {
    nav_home: 'मुख्य पृष्ठ',
    nav_find_scholarships: 'छात्रवृत्तियां खोजें',
    nav_my_applications: 'मेरे आवेदन',
    nav_documents: 'दस्तावेज़ सत्यापन',
    nav_payments: 'भुगतान एवं डीबीटी',
    nav_fellowship: 'फेलोशिप पोर्टल',
    nav_help: 'सहायता एवं संपर्क',
    nav_institution_desk: 'संस्थान सत्यापन',
    nav_state_desk: 'राज्य पोर्टल',
    nav_ministry_desk: 'मंत्रालय पोर्टल',
    nav_reviewer_desk: 'चयन समिति',

    hero_title: 'जनजातीय विद्यार्थियों के लिए छात्रवृत्ति एवं फेलोशिप',
    hero_subtitle: 'सही योजना खोजें, विश्वास के साथ आवेदन करें, स्थिति ट्रैक करें एवं अपनी शिक्षा यात्रा को सशक्त बनाएं।',
    hero_btn_find: 'छात्रवृत्ति खोजें',
    hero_btn_track: 'आवेदन ट्रैक करें',
    hero_btn_login: 'विद्यार्थी लॉगिन',

    step_1_title: '1. योजनाएं खोजें',
    step_1_desc: 'अपने अध्ययन स्तर के अनुसार उपयुक्त केंद्रीय एवं राज्य योजनाओं का चयन करें।',
    step_2_title: '2. पात्रता जांचें',
    step_2_desc: 'आवेदन करने से पहले आधिकारिक नियमों के अनुसार अपनी पात्रता सुनिश्चित करें।',
    step_3_title: '3. आवेदन एवं दस्तावेज़',
    step_3_desc: 'दस्तावेज़ अपलोड करें और त्रुटि निवारण प्रणाली की सहायता से आवेदन पूर्ण करें।',
    step_4_title: '4. प्रत्यक्ष लाभ अंतरण (DBT)',
    step_4_desc: 'सत्यापन के बाद राशि सीधे आपके आधार से जुड़े बैंक खाते में अंतरित की जाती है।',

    welcome_back: 'स्वागत है',
    dashboard_subtitle: 'आपके आवेदनों की वर्तमान स्थिति यहां उपलब्ध है।',
    active_applications: 'सक्रिय आवेदन',
    action_required: 'आवश्यक कार्रवाई',
    upcoming_renewal: 'आगामी चरण',
    payment_status: 'भुगतान स्थिति',
    your_applications: 'आपके आवेदन',
    fix_now: 'अभी सुधारें',
    view_application: 'आवेदन देखें',
    track_status: 'समयरेखा देखें',

    finder_title: 'अपनी पात्रता के अनुसार छात्रवृत्ति खोजें',
    finder_subtitle: 'जनजातीय कार्य मंत्रालय की उपयुक्त योजनाओं को देखने के लिए विवरण चुनें।',
    finder_step1_q: 'आप वर्तमान में क्या अध्ययन कर रहे हैं?',
    finder_step2_q: 'आप कहां अध्ययन कर रहे हैं?',
    finder_step3_q: 'आपको किस प्रकार की वित्तीय सहायता चाहिए?',
    finder_btn_show: 'उपयुक्त योजनाएं देखें',
    check_eligibility: 'पात्रता जांचें',
    start_application: 'आवेदन शुरू करें',

    status_verified: 'सत्यापित',
    status_under_review: 'सत्यापनाधीन',
    status_action_required: 'कार्रवाई अपेक्षित',
    status_approved: 'स्वीकृत',
    status_completed: 'पूर्ण',
    status_payment_credited: 'खाते में अंतरित'
  },
  ta: {
    nav_home: 'முகப்பு',
    nav_find_scholarships: 'உதவித்தொகைகளைக் கண்டறியவும்',
    nav_my_applications: 'எனது விண்ணப்பங்கள்',
    nav_documents: 'ஆவணச் சரிபார்ப்பு',
    nav_payments: 'நேரடி பணப்பரிமாற்றம் (DBT)',
    nav_fellowship: 'ஆராய்ச்சி உதவித்தொகை',
    nav_help: 'உதவி தேவையா?',
    nav_institution_desk: 'கல்வி நிறுவன சரிபார்ப்பு',
    nav_state_desk: 'மாநில மையம்',
    nav_ministry_desk: 'அமைச்சக மையம்',
    nav_reviewer_desk: 'தேர்வுக் குழு',

    hero_title: 'பழங்குடியின மாணவர்களுக்கான உதவித்தொகை மற்றும் ஆராய்ச்சி நிதி',
    hero_subtitle: 'சரியான திட்டத்தைக் கண்டறியவும், எளிதாக விண்ணப்பிக்கவும், உங்கள் விண்ணப்பத்தின் ஒவ்வொரு கட்டத்தையும் கண்காணிக்கவும்.',
    hero_btn_find: 'உதவித்தொகையைத் தேடுங்கள்',
    hero_btn_track: 'விண்ணப்பத்தைக் கண்காணிக்கவும்',
    hero_btn_login: 'மாணவர் உள்நுழைவு',

    step_1_title: '1. திட்டங்களைக் கண்டறிதல்',
    step_1_desc: 'உங்கள் கல்வி நிலைக்கு ஏற்ற பொருத்தமான திட்டங்களை எளிதாகத் தேர்வு செய்யவும்.',
    step_2_title: '2. தகுதி சரிபார்ப்பு',
    step_2_desc: 'விண்ணப்பிக்கும் முன் உங்கள் தகுதியை உடனடியாக உறுதிப்படுத்திக் கொள்ளுங்கள்.',
    step_3_title: '3. ஆவணப் பதிவேற்றம்',
    step_3_desc: 'சான்றிதழ்களைப் பதிவேற்றி, ஏதேனும் பிழைகள் இருந்தால் உடனடியாகத் தெரிந்து திருத்தவும்.',
    step_4_title: '4. நேரடி பணப்பரிமாற்றம் (DBT)',
    step_4_desc: 'சரிபார்ப்புக்குப் பின் நிதித்தொகை உங்கள் ஆதார் இணைக்கப்பட்ட வங்கிக் கணக்கிற்கு நேரடியாக வந்து சேரும்.',

    welcome_back: 'நல்வரவு',
    dashboard_subtitle: 'உங்கள் விண்ணப்பங்களின் தற்போதைய நிலை இங்கே உள்ளது.',
    active_applications: 'செயலில் உள்ள விண்ணப்பங்கள்',
    action_required: 'கவனம் தேவைப்படும் ஆவணங்கள்',
    upcoming_renewal: 'அடுத்த கட்ட நடவடிக்கை',
    payment_status: 'பணப்பரிவர்த்தனை நிலை',
    your_applications: 'உங்கள் விண்ணப்பங்கள்',
    fix_now: 'இப்போதே சரிசெய்யவும்',
    view_application: 'விவரங்களைப் பார்க்க',
    track_status: 'நிலையைக் கண்காணிக்க',

    finder_title: 'உங்களுக்குப் பொருந்தக்கூடிய உதவித்தொகைகளைக் கண்டறியுங்கள்',
    finder_subtitle: 'பழங்குடியினர் விவகார அமைச்சகத்தின் பொருத்தமான திட்டங்களைப் பார்க்க உங்கள் படிப்பு விவரங்களைத் தேர்ந்தெடுக்கவும்.',
    finder_step1_q: 'நீங்கள் தற்போது என்ன படிக்கிறீர்கள்?',
    finder_step2_q: 'எங்கு படிக்கிறீர்கள்?',
    finder_step3_q: 'எந்த வகையான நிதி உதவியை எதிர்பார்க்கிறீர்கள்?',
    finder_btn_show: 'பொருந்தும் திட்டங்களைக் காட்டு',
    check_eligibility: 'எனது தகுதியைச் சரிபார்க்கவும்',
    start_application: 'விண்ணப்பத்தைத் தொடங்கவும்',

    status_verified: 'சரிபார்க்கப்பட்டது',
    status_under_review: 'சரிபார்ப்பில் உள்ளது',
    status_action_required: 'கவனம் தேவை',
    status_approved: 'அனுமதிக்கப்பட்டது',
    status_completed: 'நிறைவடைந்தது',
    status_payment_credited: 'கணக்கில் வரவு வைக்கப்பட்டது'
  }
};

export class LanguageService {
  private static currentLang: SupportedLanguage = 'en';

  static getLanguage(): SupportedLanguage {
    const stored = localStorage.getItem('mota_ui_lang');
    if (stored === 'en' || stored === 'hi' || stored === 'ta') {
      this.currentLang = stored as SupportedLanguage;
    }
    return this.currentLang;
  }

  static setLanguage(lang: SupportedLanguage): void {
    this.currentLang = lang;
    localStorage.setItem('mota_ui_lang', lang);
    window.dispatchEvent(new Event('languagechange'));
  }

  static t(): TranslationDictionary {
    return TRANSLATIONS[this.getLanguage()];
  }
}

export function useLanguage() {
  const [lang, setLang] = React.useState<SupportedLanguage>(LanguageService.getLanguage());

  React.useEffect(() => {
    const handleLanguageChange = () => setLang(LanguageService.getLanguage());
    window.addEventListener('languagechange', handleLanguageChange);
    window.addEventListener('storage', handleLanguageChange);
    return () => {
      window.removeEventListener('languagechange', handleLanguageChange);
      window.removeEventListener('storage', handleLanguageChange);
    };
  }, []);

  return {
    lang,
    setLanguage: (newLang: SupportedLanguage) => {
      LanguageService.setLanguage(newLang);
    },
    t: TRANSLATIONS[lang]
  };
}
