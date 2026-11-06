import { CropType, Language } from '../types';

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  offlineIndicator: string;
  offlineBadge: string;
  getStarted: string;
  welcomeIntro: string;
  welcomeFeatures: string[];
  
  // Navigation
  navHome: string;
  navScanner: string;
  navMultiScan: string;
  navPestId: string;
  navMultiCause: string;
  navHealthReport: string;
  navTreatments: string;
  navEncyclopedia: string;
  navRiskPred: string;
  navScanHistory: string;
  navNotes: string;
  navVoice: string;
  navReminders: string;
  navLanguage: string;
  navProfile: string;
  navSettings: string;
  navLogout: string;

  // Crops
  crops: Record<CropType, string>;

  // Actions & Controls
  capturePhoto: string;
  chooseGallery: string;
  retakePhoto: string;
  rotateImage: string;
  analyseImage: string;
  analysing: string;
  clearImage: string;
  selectCrop: string;
  changePhoto: string;
  viewDetails: string;
  saveToHistory: string;
  downloadReport: string;
  filterByCrop: string;
  searchPlaceholder: string;

  // Two-Stage & Crop Verification
  stage1Title: string;
  stage1Desc: string;
  stage2Title: string;
  stage2Desc: string;
  cropMismatchTitle: string;
  cropMismatchDesc: string;
  detectedCropLabel: string;
  selectedCropLabel: string;
  switchAndAnalyse: string;
  retryUpload: string;
  unknownCropTitle: string;
  unknownCropDesc: string;

  // Differential Diagnosis
  differentialTitle: string;
  differentialSubtitle: string;
  rank1Label: string;
  rank2Label: string;
  rank3Label: string;
  observedEvidenceTitle: string;
  distinguishingTitle: string;
  missingChecksTitle: string;
  nextStepsTitle: string;
  intelligentComparisonTitle: string;
  confidenceScore: string;
  severityLevel: string;
  healthScoreTitle: string;
  uncertainAlertTitle: string;
  uncertainAlertDesc: string;
  gradCamTitle: string;
  gradCamDesc: string;
  originalImage: string;
  attentionHeatmap: string;

  // Categories & Severity
  categories: {
    fungal: string;
    bacterial: string;
    viral: string;
    pest: string;
    deficiency: string;
    environmental: string;
    healthy: string;
    beneficial: string;
  };
  severities: {
    none: string;
    low: string;
    moderate: string;
    high: string;
    severe: string;
  };

  // Protocols
  immediateAction: string;
  organicControl: string;
  biologicalControl: string;
  ipmStrategy: string;
  chemicalGuidance: string;

  // Dashboard Stats
  totalScans: string;
  healthyCrops: string;
  diseasesDetected: string;
  pestsDetected: string;
  recentActivity: string;
  quickTipsTitle: string;
  quickTips: string[];
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'AgriScan',
    appSubtitle: 'Your Intelligent Offline Crop Health & Disease Detection Assistant',
    offlineIndicator: '100% Offline Mode Active · On-Device Neural Processing',
    offlineBadge: 'Offline Ready',
    getStarted: 'Get Started with Dashboard',
    welcomeIntro:
      'AgriScan empowers farmers and agronomists to identify crop diseases, insect pests, and nutrient stress directly in remote fields without requiring any internet connection. All neural vision models, multilingual encyclopedias, and treatment protocols operate 100% locally on your device.',
    welcomeFeatures: [
      'Two-Stage Neural Vision: Verifies plant species before running crop-specific pathology models to eliminate false cross-crop diagnoses.',
      'Top 3 Differential Diagnosis: Ranks the top three probable causes with visible evidence, distinguishing traits, and absent indicators.',
      'Grad-CAM Explainable AI: Visually inspects the exact leaf lesion regions that guided the neural decision.',
      'Comprehensive Disease Database: Preloaded diagnostic intelligence for Tomato, Potato, Apple, Grapes, Banana, Mango, and Citrus.',
    ],

    navHome: 'Home',
    navScanner: 'AI Crop Scanner',
    navMultiScan: 'Multiple Image Detection',
    navPestId: 'Pest Identification',
    navMultiCause: 'Multi-Cause Diagnosis',
    navHealthReport: 'Crop Health Report',
    navTreatments: 'Treatment Recommendations',
    navEncyclopedia: 'Disease Encyclopedia',
    navRiskPred: 'Risk Prediction',
    navScanHistory: 'Scan History',
    navNotes: 'Farmer Notes',
    navVoice: 'Voice Assistant',
    navReminders: 'Notifications & Reminders',
    navLanguage: 'Language Settings',
    navProfile: 'Farmer Profile',
    navSettings: 'Settings & Guide',
    navLogout: 'Logout',

    crops: {
      tomato: 'Tomato',
      potato: 'Potato',
      apple: 'Apple',
      grapes: 'Grapes',
      banana: 'Banana',
      mango: 'Mango',
      citrus: 'Citrus',
    },

    capturePhoto: 'Capture Photo',
    chooseGallery: 'Choose from Gallery',
    retakePhoto: 'Retake Photo',
    rotateImage: 'Rotate 90°',
    analyseImage: 'Analyse Image Locally',
    analysing: 'Running Local Neural Diagnosis...',
    clearImage: 'Remove Photo',
    selectCrop: 'Select Target Crop',
    changePhoto: 'Change Photo',
    viewDetails: 'View Full Protocol',
    saveToHistory: 'Save to Local Scan History',
    downloadReport: 'Export Health Report',
    filterByCrop: 'Filter by Crop',
    searchPlaceholder: 'Search diseases, symptoms, or remedies...',

    stage1Title: 'Stage 1: Crop Species Identification',
    stage1Desc: 'Extracting botanical morphology, leaf margins, and vein venation to confirm plant species.',
    stage2Title: 'Stage 2: Crop-Specific Pathology Diagnosis',
    stage2Desc: 'Evaluating localized necrotic lesions against verified crop disease classes.',
    cropMismatchTitle: 'Crop Mismatch Detected!',
    cropMismatchDesc: 'The uploaded image appears to belong to a different crop than what was selected.',
    detectedCropLabel: 'Detected Plant Species',
    selectedCropLabel: 'Selected Target Crop',
    switchAndAnalyse: 'Switch to Detected Crop & Diagnose',
    retryUpload: 'Upload Correct Leaf Image',
    unknownCropTitle: 'Unknown or Unsupported Crop',
    unknownCropDesc: 'The AI cannot confidently identify this plant leaf. Please capture a closer, sharper photograph of the crop foliage against a neutral backdrop.',

    differentialTitle: 'Top 3 Differential Disease & Pest Diagnosis',
    differentialSubtitle: 'Ranked probable causes with visual evidence and distinguishing botanical characteristics.',
    rank1Label: 'Primary Suspected Condition (#1)',
    rank2Label: 'Differential Diagnosis Candidate (#2)',
    rank3Label: 'Differential Diagnosis Candidate (#3)',
    observedEvidenceTitle: 'Supporting Visual Evidence Detected',
    distinguishingTitle: 'Key Distinguishing Characteristic',
    missingChecksTitle: 'Missing / Unconfirmed Symptoms',
    nextStepsTitle: 'Recommended Next Field Verification Steps',
    intelligentComparisonTitle: 'Intelligent Comparative Diagnostic Analysis',
    confidenceScore: 'AI Confidence Score',
    severityLevel: 'Severity Rating',
    healthScoreTitle: 'Foliar Health Score',
    uncertainAlertTitle: 'Uncertain Diagnosis – Further Inspection Required',
    uncertainAlertDesc: 'Foliar clarity is insufficient or confidence is below safety threshold. Do not administer chemical treatments based on uncertain results.',
    gradCamTitle: 'Explainable AI: Attention Saliency Map',
    gradCamDesc: 'Highlights the specific necrotic lesion pixels and chlorotic margins that influenced the neural network prediction.',
    originalImage: 'Original Crop Leaf',
    attentionHeatmap: 'Grad-CAM Attention Map',

    categories: {
      fungal: 'Fungal Infection',
      bacterial: 'Bacterial Disease',
      viral: 'Viral Infection',
      pest: 'Insect Pest Damage',
      deficiency: 'Nutrient Deficiency',
      environmental: 'Environmental Stress',
      healthy: 'Optimal Health',
      beneficial: 'Beneficial Insect',
    },
    severities: {
      none: 'Nominal / Healthy',
      low: 'Low Risk',
      moderate: 'Moderate Infestation',
      high: 'High Severity',
      severe: 'Critical Outbreak',
    },

    immediateAction: 'Immediate Field Actions',
    organicControl: 'Organic & Cultural Remedies',
    biologicalControl: 'Biological Biocontrol Agents',
    ipmStrategy: 'Integrated Pest Management (IPM)',
    chemicalGuidance: 'Extension Verified Chemical Guidance',

    totalScans: 'Total Scans Performed',
    healthyCrops: 'Healthy Plants Logged',
    diseasesDetected: 'Pathologies Identified',
    pestsDetected: 'Pest Pressures Flagged',
    recentActivity: 'Recent Local Diagnostic Activity',
    quickTipsTitle: 'Agronomic Best Practices for Today',
    quickTips: [
      'Scout lower canopy leaves early in the morning when dew reveals downy spores.',
      'Sanitize pruning shears with 70% alcohol or 1:10 bleach solution between each plant.',
      'Drip irrigation prevents fungal spore splash and saves up to 40% field water.',
      'Beneficial insects like ladybugs eat up to 80 aphids a day—avoid blanket pesticide sprays.',
    ],
  },

  kn: {
    appName: 'ಅಗ್ರಿಸ್ಕ್ಯಾನ್ (AgriScan)',
    appSubtitle: 'ನಿಮ್ಮ ಆಫ್‌ಲೈನ್ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಬೆಳೆ ರೋಗ ಮತ್ತು ಕೀಟ ಪತ್ತೆ ಸಹಾಯಕ',
    offlineIndicator: '100% ಆಫ್‌ಲೈನ್ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ · ಸಾಧನದಲ್ಲಿಯೇ AI ವಿಶ್ಲೇಷಣೆ',
    offlineBadge: 'ಆಫ್‌ಲೈನ್ ಸಿದ್ಧ',
    getStarted: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಿರಿ',
    welcomeIntro:
      'ಅಗ್ರಿಸ್ಕ್ಯಾನ್ ರೈತರು ಮತ್ತು ಕೃಷಿ ತಜ್ಞರಿಗೆ ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕವಿಲ್ಲದೆ ದೂರದ ಹೊಲಗಳಲ್ಲಿ ಬೆಳೆ ರೋಗಗಳು, ಕೀಟಗಳು ಮತ್ತು ಪೋಷಕಾಂಶಗಳ ಕೊರತೆಯನ್ನು ಗುರುತಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ. ಎಲ್ಲಾ AI ಮಾದರಿಗಳು, ಬಹುಭಾಷಾ ವಿಶ್ವಕೋಶಗಳು ಮತ್ತು ಚಿಕಿತ್ಸಾ ಪ್ರೋಟೋಕಾಲ್‌ಗಳು ನಿಮ್ಮ ಸಾಧನದಲ್ಲಿ 100% ಸ್ಥಳೀಯವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತವೆ.',
    welcomeFeatures: [
      'ದ್ವಿ-ಹಂತದ AI ದೃಷ್ಟಿ: ತಪ್ಪು ರೋಗನಿರ್ಣಯವನ್ನು ತಡೆಯಲು ಮೊದಲು ಬೆಳೆಯ ಜಾತಿಯನ್ನು ದೃಢೀಕರಿಸಿ ನಂತರ ರೋಗ ಪತ್ತೆ ಮಾಡುತ್ತದೆ.',
      'ಟಾಪ್ 3 ವ್ಯತ್ಯಾಸಾತ್ಮಕ ರೋಗನಿರ್ಣಯ: ಗೋಚರ ಸಾಕ್ಷ್ಯಗಳು ಮತ್ತು ಪ್ರಮುಖ ಲಕ್ಷಣಗಳೊಂದಿಗೆ ಸಂಭವನೀಯ 3 ಕಾರಣಗಳನ್ನು ಶ್ರೇಣೀಕರಿಸುತ್ತದೆ.',
      'Grad-CAM ವಿವರಣಾತ್ಮಕ AI: AI ನಿರ್ಧಾರವನ್ನು ಪ್ರಭಾವಿಸಿದ ಎಲೆಯ ನಿರ್ದಿಷ್ಟ ರೋಗಗ್ರಸ್ತ ಭಾಗಗಳನ್ನು ಪ್ರದರ್ಶಿಸುತ್ತದೆ.',
      'ಸಮಗ್ರ ರೋಗ ಡೇಟಾಬೇಸ್: ಟೊಮೆಟೊ, ಆಲೂಗಡ್ಡೆ, ಸೇಬು, ದ್ರಾಕ್ಷಿ, ಬಾಳೆ, ಮಾವು ಮತ್ತು ಸಿಟ್ರಸ್ ಬೆಳೆಗಳ ರೋಗಗಳ ವಿವರಗಳು.',
    ],

    navHome: 'ಮುಖಪುಟ',
    navScanner: 'AI ಬೆಳೆ ಸ್ಕ್ಯಾನರ್',
    navMultiScan: 'ಬಹು ಚಿತ್ರ ಪತ್ತೆ',
    navPestId: 'ಕೀಟ ಗುರುತಿಸುವಿಕೆ',
    navMultiCause: 'ಬಹು-ಕಾರಣ ರೋಗನಿರ್ಣಯ',
    navHealthReport: 'ಬೆಳೆ ಆರೋಗ್ಯ ವರದಿ',
    navTreatments: 'ಚಿಕಿತ್ಸಾ ಶಿಫಾರಸುಗಳು',
    navEncyclopedia: 'ರೋಗ ವಿಶ್ವಕೋಶ',
    navRiskPred: 'ಹವಾಮಾನ ಅಪಾಯ ಮುನ್ಸೂಚನೆ',
    navScanHistory: 'ಸ್ಕ್ಯಾನ್ ಇತಿಹಾಸ',
    navNotes: 'ರೈತರ ಟಿಪ್ಪಣಿಗಳು',
    navVoice: 'ಧ್ವನಿ ಸಹಾಯಕ',
    navReminders: 'ಜ್ಞಾಪನೆಗಳು & ಎಚ್ಚರಿಕೆಗಳು',
    navLanguage: 'ಭಾಷಾ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    navProfile: 'ರೈತರ ಪ್ರೊಫೈಲ್',
    navSettings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು ಮತ್ತು ಮಾರ್ಗದರ್ಶಿ',
    navLogout: 'ಲಾಗ್‌ಔಟ್',

    crops: {
      tomato: 'ಟೊಮೆಟೊ (Tomato)',
      potato: 'ಆಲೂಗಡ್ಡೆ (Potato)',
      apple: 'ಸೇಬು (Apple)',
      grapes: 'ದ್ರಾಕ್ಷಿ (Grapes)',
      banana: 'ಬಾಳೆ (Banana)',
      mango: 'ಮಾವು (Mango)',
      citrus: 'ನಿಂಬೆ / ಸಿಟ್ರಸ್ (Citrus)',
    },

    capturePhoto: 'ಕ್ಯಾಮೆರಾದಿಂದ ಫೋಟೋ ತೆಗೆಯಿರಿ',
    chooseGallery: 'ಗ್ಯಾಲರಿಯಿಂದ ಆಯ್ಕೆಮಾಡಿ',
    retakePhoto: 'ಮತ್ತೆ ಫೋಟೋ ತೆಗೆಯಿರಿ',
    rotateImage: '90° ತಿರುಗಿಸಿ',
    analyseImage: 'ಚಿತ್ರವನ್ನು ಸ್ಥಳೀಯವಾಗಿ ವಿಶ್ಲೇಷಿಸಿ',
    analysing: 'ಸ್ಥಳೀಯ AI ರೋಗನಿರ್ಣಯ ನಡೆಯುತ್ತಿದೆ...',
    clearImage: 'ಫೋಟೋ ತೆಗೆದುಹಾಕಿ',
    selectCrop: 'ಗುರಿ ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    changePhoto: 'ಫೋಟೋ ಬದಲಾಯಿಸಿ',
    viewDetails: 'ಸಂಪೂರ್ಣ ವಿಧಾನ ನೋಡಿ',
    saveToHistory: 'ಸ್ಥಳೀಯ ಇತಿಹಾಸಕ್ಕೆ ಉಳಿಸಿ',
    downloadReport: 'ಆರೋಗ್ಯ ವರದಿ ಡೌನ್‌ಲೋಡ್',
    filterByCrop: 'ಬೆಳೆಯ ಪ್ರಕಾರ ಫಿಲ್ಟರ್ ಮಾಡಿ',
    searchPlaceholder: 'ರೋಗಗಳು, ಲಕ್ಷಣಗಳು ಅಥವಾ ಪರಿಹಾರಗಳನ್ನು ಹುಡುಕಿ...',

    stage1Title: 'ಹಂತ 1: ಬೆಳೆ ಸಸ್ಯದ ಗುರುತಿಸುವಿಕೆ',
    stage1Desc: 'ಎಲೆಯ ರಚನೆ ಮತ್ತು ನರಗಳ ವಿನ್ಯಾಸದಿಂದ ಬೆಳೆಯ ಜಾತಿಯನ್ನು ದೃಢೀಕರಿಸಲಾಗುತ್ತಿದೆ.',
    stage2Title: 'ಹಂತ 2: ಬೆಳೆ-ನಿರ್ದಿಷ್ಟ ರೋಗನಿರ್ಣಯ',
    stage2Desc: 'ದೃಢೀಕರಿಸಿದ ಬೆಳೆಯ ರೋಗಗಳೊಂದಿಗೆ ಎಲೆಯ ಕಲೆಗಳನ್ನು ಹೋಲಿಸಲಾಗುತ್ತಿದೆ.',
    cropMismatchTitle: 'ಬೆಳೆ ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತಿಲ್ಲ! (Crop Mismatch)',
    cropMismatchDesc: 'ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಚಿತ್ರವು ನೀವು ಆಯ್ಕೆಮಾಡಿದ ಬೆಳೆಗಿಂತ ಬೇರೆ ಬೆಳೆಗೆ ಸಂಬಂಧಿಸಿದೆ ಎಂದು ತೋರುತ್ತದೆ.',
    detectedCropLabel: 'ಪತ್ತೆಯಾದ ಸಸ್ಯ ಜಾತಿ',
    selectedCropLabel: 'ಆಯ್ಕೆಮಾಡಿದ ಗುರಿ ಬೆಳೆ',
    switchAndAnalyse: 'ಪತ್ತೆಯಾದ ಬೆಳೆಗೆ ಬದಲಾಯಿಸಿ ರೋಗನಿರ್ಣಯ ಮಾಡಿ',
    retryUpload: 'ಸರಿಯಾದ ಎಲೆಯ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    unknownCropTitle: 'ಅಪರಿಚಿತ ಅಥವಾ ಬೆಂಬಲವಿಲ್ಲದ ಬೆಳೆ',
    unknownCropDesc: 'AI ಈ ಎಲೆಯನ್ನು ವಿಶ್ವಾಸಾರ್ಹವಾಗಿ ಗುರುತಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ಸ್ವಚ್ಛವಾದ ಹಿನ್ನೆಲೆಯಲ್ಲಿ ಹತ್ತಿರದ, ಸ್ಪಷ್ಟವಾದ ಫೋಟೋ ತೆಗೆಯಿರಿ.',

    differentialTitle: 'ಟಾಪ್ 3 ಸಂಭವನೀಯ ರೋಗ ಮತ್ತು ಕೀಟ ವಿಶ್ಲೇಷಣೆ',
    differentialSubtitle: 'ದೃಶ್ಯ ಸಾಕ್ಷ್ಯಗಳು ಮತ್ತು ಪ್ರತ್ಯೇಕಿಸುವ ಲಕ್ಷಣಗಳ ಆಧಾರದ ಮೇಲೆ ಶ್ರೇಣೀಕರಿಸಲಾಗಿದೆ.',
    rank1Label: 'ಪ್ರಾಥಮಿಕ ಶಂಕಿತ ರೋಗ (#1)',
    rank2Label: 'ದ್ವಿತೀಯ ಸಂಭವನೀಯ ಕಾರಣ (#2)',
    rank3Label: 'ತೃತೀಯ ಸಂಭವನೀಯ ಕಾರಣ (#3)',
    observedEvidenceTitle: 'ಕಂಡುಬಂದ ಪ್ರಮುಖ ದೃಶ್ಯ ಸಾಕ್ಷ್ಯಗಳು',
    distinguishingTitle: 'ಪ್ರತ್ಯೇಕಿಸುವ ಪ್ರಮುಖ ಲಕ್ಷಣ',
    missingChecksTitle: 'ಕಾಣಿಸದ / ದೃಢೀಕರಿಸಲಾಗದ ಲಕ್ಷಣಗಳು',
    nextStepsTitle: 'ಮುಂದಿನ ಪರಿಶೀಲನಾ ಹಂತಗಳು',
    intelligentComparisonTitle: 'ಬುದ್ಧಿವಂತ ತೌಲನಿಕ ವಿಶ್ಲೇಷಣೆ',
    confidenceScore: 'AI ವಿಶ್ವಾಸಾರ್ಹತೆ ಸ್ಕೋರ್',
    severityLevel: 'ತೀವ್ರತೆಯ ಮಟ್ಟ',
    healthScoreTitle: 'ಎಲೆಯ ಆರೋಗ್ಯ ಸ್ಕೋರ್',
    uncertainAlertTitle: 'ಅನಿಶ್ಚಿತ ರೋಗನಿರ್ಣಯ – ಹೆಚ್ಚಿನ ಪರಿಶೀಲನೆ ಅಗತ್ಯ',
    uncertainAlertDesc: 'ಚಿತ್ರದ ಗುಣಮಟ್ಟ ಕಡಿಮೆಯಾಗಿದೆ. ಅನಿಶ್ಚಿತ ಫಲಿತಾಂಶಗಳ ಆಧಾರದ ಮೇಲೆ ಯಾವುದೇ ಕೀಟನಾಶಕಗಳನ್ನು ಬಳಸಬೇಡಿ.',
    gradCamTitle: 'ವಿವರಣಾತ್ಮಕ AI: ಗಮನ ಕೇಂದ್ರ ನಕ್ಷೆ (Grad-CAM)',
    gradCamDesc: 'AI ರೋಗನಿರ್ಣಯ ಮಾಡಲು ಪರಿಗಣಿಸಿದ ಎಲೆಯ ಪ್ರಮುಖ ರೋಗಗ್ರಸ್ತ ಕಲೆಗಳನ್ನು ಬಣ್ಣದಲ್ಲಿ ತೋರಿಸುತ್ತದೆ.',
    originalImage: 'ಮೂಲ ಬೆಳೆ ಎಲೆ',
    attentionHeatmap: 'AI ಗಮನ ನಕ್ಷೆ',

    categories: {
      fungal: 'ಶಿಲೀಂಧ್ರ ರೋಗ',
      bacterial: 'ಬ್ಯಾಕ್ಟೀರಿಯಾ ರೋಗ',
      viral: 'ವೈರಸ್ ಸೋಂಕು',
      pest: 'ಕೀಟಗಳ ಹಾನಿ',
      deficiency: 'ಪೋಷಕಾಂಶಗಳ ಕೊರತೆ',
      environmental: 'ಪರಿಸರ ಒತ್ತಡ',
      healthy: 'ಆರೋಗ್ಯಕರ ಸ್ಥಿತಿ',
      beneficial: 'ರೈತ ಮಿತ್ರ ಕೀಟ',
    },
    severities: {
      none: 'ಸಾಮಾನ್ಯ / ಆರೋಗ್ಯಕರ',
      low: 'ಕಡಿಮೆ ಅಪಾಯ',
      moderate: 'ಮಧ್ಯಮ ತೀವ್ರತೆ',
      high: 'ಹೆಚ್ಚಿನ ತೀವ್ರತೆ',
      severe: 'ತೀವ್ರ ಅಪಾಯ',
    },

    immediateAction: 'ತಕ್ಷಣದ ಹೊಲದ ಕ್ರಮಗಳು',
    organicControl: 'ಸಾವಯವ ಪರಿಹಾರಗಳು',
    biologicalControl: 'ಜೈವಿಕ ನಿಯಂತ್ರಣ ವಿಧಾನಗಳು',
    ipmStrategy: 'ಸಮಗ್ರ ಕೀಟ ನಿರ್ವಹಣೆ (IPM)',
    chemicalGuidance: 'ವಿಜ್ಞಾನಿಗಳ ಶಿಫಾರಸು ಮಾಡಿದ ರಾಸಾಯನಿಕ ಕ್ರಮಗಳು',

    totalScans: 'ಒಟ್ಟು ಸ್ಕ್ಯಾನ್‌ಗಳು',
    healthyCrops: 'ಆರೋಗ್ಯಕರ ಬೆಳೆಗಳು',
    diseasesDetected: 'ಪತ್ತೆಯಾದ ರೋಗಗಳು',
    pestsDetected: 'ಪತ್ತೆಯಾದ ಕೀಟಗಳು',
    recentActivity: 'ಇತ್ತೀಚಿನ ರೋಗನಿರ್ಣಯ ಚಟುವಟಿಕೆ',
    quickTipsTitle: 'ಇಂದಿನ ಕೃಷಿ ಸಲಹೆಗಳು',
    quickTips: [
      'ಮುಂಜಾನೆಯ ಇಬ್ಬನಿಯ ಸಮಯದಲ್ಲಿ ಕೆಳಗಿನ ಎಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
      'ಪ್ರತಿ ಗಿಡ ಕತ್ತರಿಸಿದ ನಂತರ ಕತ್ತರಿಯನ್ನು ಸೋಂಕುರಹಿತಗೊಳಿಸಿ.',
      'ಹನಿ ನೀರಾವರಿ ಬಳಸುವುದರಿಂದ ಶಿಲೀಂಧ್ರ ರೋಗಗಳು ಹರಡುವುದಿಲ್ಲ.',
      'ಜೇಡ ಮತ್ತು ಲೇಡಿಬಗ್ ಕೀಟಗಳನ್ನು ರಕ್ಷಿಸಿ; ಅವು ಉಪದ್ರವಕಾರಿ ಕೀಟಗಳನ್ನು ತಿನ್ನುತ್ತವೆ.',
    ],
  },

  hi: {
    appName: 'एग्रीस्कैन (AgriScan)',
    appSubtitle: 'आपका बुद्धिमान ऑफ़लाइन फसल स्वास्थ्य एवं रोग पहचान सहायक',
    offlineIndicator: '100% ऑफ़लाइन मोड सक्रिय · डिवाइस पर ही न्यूरल AI प्रोसेसिंग',
    offlineBadge: 'ऑफ़लाइन तैयार',
    getStarted: 'डैशबोर्ड शुरू करें',
    welcomeIntro:
      'एग्रीस्कैन किसानों और कृषि विशेषज्ञों को बिना इंटरनेट के सुदूर खेतों में फसलों की बीमारियों, कीटों और पोषक तत्वों की कमी की पहचान करने में मदद करता है। सभी AI मॉडल, बहुभाषी विश्वकोश और उपचार विधियां आपके उपकरण पर 100% स्थानीय रूप से काम करती हैं।',
    welcomeFeatures: [
      'दो-चरणीय AI प्रणाली: गलत निदान रोकने के लिए पहले पौधे की पहचान करता है, फिर रोग की जांच करता है।',
      'शीर्ष 3 अंतर-निदान: दृश्य प्रमाणों और विशिष्ट लक्षणों के साथ शीर्ष 3 संभावित कारणों को रैंक करता है।',
      'Grad-CAM व्याख्यात्मक AI: पत्ती के उन विशिष्ट हिस्सों को दिखाता है जिनके आधार पर AI ने निर्णय लिया।',
      'विस्तृत रोग डेटाबेस: टमाटर, आलू, सेब, अंगूर, केला, आम और नींबू वर्गीय फसलों की संपूर्ण जानकारी।',
    ],

    navHome: 'होम',
    navScanner: 'AI फसल स्कैनर',
    navMultiScan: 'एकाधिक पत्ती जांच',
    navPestId: 'कीट पहचान',
    navMultiCause: 'बहु-कारण निदान',
    navHealthReport: 'फसल स्वास्थ्य रिपोर्ट',
    navTreatments: 'उपचार सिफारिशें',
    navEncyclopedia: 'रोग ज्ञानकोश',
    navRiskPred: 'मौसम जोखिम अनुमान',
    navScanHistory: 'स्कैन इतिहास',
    navNotes: 'किसान डायरी/नोट्स',
    navVoice: 'आवाज सहायक',
    navReminders: 'अनुस्मारक एवं अलर्ट',
    navLanguage: 'भाषा सेटिंग्स',
    navProfile: 'किसान प्रोफ़ाइल',
    navSettings: 'सेटिंग्स एवं गाइड',
    navLogout: 'लॉगआउट',

    crops: {
      tomato: 'टमाटर (Tomato)',
      potato: 'आलू (Potato)',
      apple: 'सेब (Apple)',
      grapes: 'अंगूर (Grapes)',
      banana: 'केला (Banana)',
      mango: 'आम (Mango)',
      citrus: 'नींबू वर्गीय (Citrus)',
    },

    capturePhoto: 'कैमरा से फोटो खींचें',
    chooseGallery: 'गैलरी से चुनें',
    retakePhoto: 'दोबारा फोटो लें',
    rotateImage: '90° घुमाएं',
    analyseImage: 'स्थानीय रूप से विश्लेषण करें',
    analysing: 'स्थानीय AI जांच जारी है...',
    clearImage: 'फोटो हटाएं',
    selectCrop: 'लक्षित फसल चुनें',
    changePhoto: 'फोटो बदलें',
    viewDetails: 'विस्तृत उपचार देखें',
    saveToHistory: 'स्थानीय इतिहास में सहेजें',
    downloadReport: 'स्वास्थ्य रिपोर्ट डाउनलोड करें',
    filterByCrop: 'फसल के अनुसार फ़िल्टर करें',
    searchPlaceholder: 'रोग, लक्षण या उपचार खोजें...',

    stage1Title: 'चरण 1: फसल प्रजाति की पहचान',
    stage1Desc: 'पत्ती के आकार, किनारों और नसों से फसल की पुष्टि की जा रही है।',
    stage2Title: 'चरण 2: फसल-विशिष्ट रोग निदान',
    stage2Desc: 'पुष्टि की गई फसल के आधार पर ही बीमारियों की सटीक जांच की जा रही है।',
    cropMismatchTitle: 'फसल असंगति पाई गई! (Crop Mismatch)',
    cropMismatchDesc: 'अपलोड की गई फोटो चयनित फसल से भिन्न पौधे की प्रतीत होती है।',
    detectedCropLabel: 'पहचाना गया पौधा',
    selectedCropLabel: 'चुनी गई लक्षित फसल',
    switchAndAnalyse: 'पहचाने गए पौधे पर स्विच कर निदान करें',
    retryUpload: 'सही पत्ती की फोटो अपलोड करें',
    unknownCropTitle: 'अज्ञात या असमर्थित पौधा',
    unknownCropDesc: 'AI इस पौधे की निश्चित पहचान नहीं कर सका। कृपया साफ पृष्ठभूमि पर नजदीक से स्पष्ट फोटो लें।',

    differentialTitle: 'शीर्ष 3 विभेदक रोग एवं कीट निदान',
    differentialSubtitle: 'दृश्य साक्ष्य और विशिष्ट लक्षणों के आधार पर आकलित 3 संभावित कारण।',
    rank1Label: 'प्राथमिक संदिग्ध स्थिति (#1)',
    rank2Label: 'द्वितीय संभावित कारण (#2)',
    rank3Label: 'तृतीय संभावित कारण (#3)',
    observedEvidenceTitle: 'पहचाने गए दृश्य साक्ष्य',
    distinguishingTitle: 'प्रमुख भेदकारी लक्षण',
    missingChecksTitle: 'अनुपस्थित या असत्यापित लक्षण',
    nextStepsTitle: 'खेत में पुष्टि हेतु अगले कदम',
    intelligentComparisonTitle: 'बुद्धिमान तुलनात्मक विश्लेषण',
    confidenceScore: 'AI विश्वसनीयता स्कोर',
    severityLevel: 'गंभीरता स्तर',
    healthScoreTitle: 'पत्ती स्वास्थ्य स्कोर',
    uncertainAlertTitle: 'अनिश्चित निदान – आगे निरीक्षण आवश्यक',
    uncertainAlertDesc: 'फोटो स्पष्ट नहीं है। अनिश्चित परिणाम पर कोई रासायनिक कीटनाशक न डालें।',
    gradCamTitle: 'व्याख्यात्मक AI: ध्यान मानचित्र (Grad-CAM)',
    gradCamDesc: 'रंगीन हीटमैप द्वारा उन हिस्सों को उजागर करता है जिन पर AI ने निर्णय आधारित किया।',
    originalImage: 'मूल पत्ती फोटो',
    attentionHeatmap: 'AI ध्यान हीटमैप',

    categories: {
      fungal: 'फंगल/कवक रोग',
      bacterial: 'जीवाणु रोग',
      viral: 'विषाणु संक्रमण',
      pest: 'कीट का प्रकोप',
      deficiency: 'पोषक तत्व की कमी',
      environmental: 'पर्यावरणीय तनाव',
      healthy: 'स्वस्थ पौधा',
      beneficial: 'मित्र कीट',
    },
    severities: {
      none: 'सामान्य / स्वस्थ',
      low: 'कम जोखिम',
      moderate: 'मध्यम प्रकोप',
      high: 'उच्च गंभीरता',
      severe: 'गंभीर प्रकोप',
    },

    immediateAction: 'खेत में तुरंत किए जाने वाले उपाय',
    organicControl: 'जैविक एवं देशी उपाय',
    biologicalControl: 'जैव-नियंत्रण विधियां',
    ipmStrategy: 'एकीकृत कीट प्रबंधन (IPM)',
    chemicalGuidance: 'वैज्ञानिक रूप से प्रमाणित रासायनिक उपाय',

    totalScans: 'कुल किए गए स्कैन',
    healthyCrops: 'स्वस्थ पौधे',
    diseasesDetected: 'पहचाने गए रोग',
    pestsDetected: 'पहचाने गए कीट',
    recentActivity: 'हाल की निदान गतिविधि',
    quickTipsTitle: 'आज के महत्वपूर्ण कृषि सुझाव',
    quickTips: [
      'सुबह की ओस के समय निचली पत्तियों की जांच अवश्य करें।',
      'संक्रमित पत्तियों को काटकर खेत से दूर जलाएं या गहरा दबाएं।',
      'ड्रिप सिंचाई से पत्तियां सूखी रहती हैं और फंगस नहीं फैलता।',
      'लेडीबग और मित्र कीटों को न मारें, वे हानिकारक माहू को खाते हैं।',
    ],
  },

  ml: {
    appName: 'അഗ്രിസ്കാൻ (AgriScan)',
    appSubtitle: 'നിങ്ങളുടെ ഇന്റലിജന്റ് ഓഫ്‌ലൈൻ വിള രോഗ-കീട നിരീക്ഷണ സഹായി',
    offlineIndicator: '100% ഓഫ്‌ലൈൻ മോഡ് സജീവം · ഫോണിൽ തന്നെ പൂർണ്ണ AI പരിശോധന',
    offlineBadge: 'ഓഫ്‌ലൈൻ തയ്യാറാണ്',
    getStarted: 'ഡാഷ്‌ബോർഡ് തുറക്കുക',
    welcomeIntro:
      'ഇന്റർനെറ്റ് ഇല്ലാതെ തന്നെ വിദൂര തോട്ടങ്ങളിൽ വെച്ചു വിള രോഗങ്ങളും കീടങ്ങളും കണ്ടെത്താൻ കർഷകരെ സഹായിക്കുന്ന നൂതന സംവിധാനമാണ് അഗ്രിസ്കാൻ. എല്ലാ AI മോഡലുകളും പരിഹാര നിർദ്ദേശങ്ങളും നിങ്ങളുടെ ഉപകരണത്തിൽ പൂർണ്ണമായി ഓഫ്‌ലൈനായി പ്രവർത്തിക്കുന്നു.',
    welcomeFeatures: [
      'ദ്വിതല AI ദർശനം: തെറ്റായ രോഗനിർണ്ണയം തടയാൻ ആദ്യം വിളയുടെ ഇനം സ്ഥിരീകരിച്ച ശേഷം മാത്രം രോഗപരിശോധന നടത്തുന്നു.',
      'ടോപ്പ് 3 വ്യത്യാസ രോഗനിർണ്ണയം: ദൃശ്യ തെളിവുകളും സവിശേഷ ലക്ഷണങ്ങളും വെച്ച് ഏറ്റവും സാധ്യതയുള്ള 3 കാരണങ്ങൾ റാങ്ക് ചെയ്യുന്നു.',
      'Grad-CAM വിശദീകരണ AI: AI തീരുമാനം എടുക്കാൻ കാരണമായ ഇലയിലെ കൃത്യമായ പാടുകൾ തിരിച്ചറിയുന്നു.',
      'സമഗ്ര ഡാറ്റാബേസ്: തക്കാളി, ഉരുളക്കിഴങ്ങ്, ആപ്പിൾ, മുന്തിരി, വാഴ, മാവ്, സിട്രസ് വിളകളുടെ സമ്പൂർണ്ണ വിവരങ്ങൾ.',
    ],

    navHome: 'ഹോം',
    navScanner: 'AI വിള സ്കാനർ',
    navMultiScan: 'ഒന്നിലധികം ഇല സ്കാൻ',
    navPestId: 'കീടങ്ങളെ തിരിച്ചറിയൽ',
    navMultiCause: 'വിശകലന രോഗനിർണ്ണയം',
    navHealthReport: 'വിള ആരോഗ്യ റിപ്പോർട്ട്',
    navTreatments: 'ചികിത്സാ നിർദ്ദേശങ്ങൾ',
    navEncyclopedia: 'രോഗ വിജ്ഞാനകോശം',
    navRiskPred: 'കാലാവസ്ഥാ രോഗ സാധ്യത',
    navScanHistory: 'സ്കാൻ ചരിത്രം',
    navNotes: 'കർഷക കുറിപ്പുകൾ',
    navVoice: 'ശബ്ദ സഹായി',
    navReminders: 'അറിയിപ്പുകൾ & ഓർമ്മപ്പെടുത്തലുകൾ',
    navLanguage: 'ഭാഷാ ക്രമീകരണങ്ങൾ',
    navProfile: 'കർഷക പ്രൊഫൈൽ',
    navSettings: 'ക്രമീകരണങ്ങൾ',
    navLogout: 'ലോഗ് ഔട്ട്',

    crops: {
      tomato: 'തക്കാളി (Tomato)',
      potato: 'ഉരുളക്കിഴങ്ങ് (Potato)',
      apple: 'ആപ്പിൾ (Apple)',
      grapes: 'മുന്തിരി (Grapes)',
      banana: 'വാഴ (Banana)',
      mango: 'മാവ് (Mango)',
      citrus: 'നാരകം / സിട്രസ് (Citrus)',
    },

    capturePhoto: 'ക്യാമറ വഴി ഫോട്ടോ എടുക്കുക',
    chooseGallery: 'ഗാലറിയിൽ നിന്ന് തിരഞ്ഞെടുക്കുക',
    retakePhoto: 'വീണ്ടും ഫോട്ടോ എടുക്കുക',
    rotateImage: '90° തിരിക്കുക',
    analyseImage: 'ഇല പരിശോധിക്കുക',
    analysing: 'ഓഫ്‌ലൈൻ AI പരിശോധന നടക്കുന്നു...',
    clearImage: 'ഫോട്ടോ ഒഴിവാക്കുക',
    selectCrop: 'വിള തിരഞ്ഞെടുക്കുക',
    changePhoto: 'ഫോട്ടോ മാറ്റുക',
    viewDetails: 'പൂർണ്ണ ചികിത്സ കാണുക',
    saveToHistory: 'ചരിത്രത്തിലേക്ക് സൂക്ഷിക്കുക',
    downloadReport: 'റിപ്പോർട്ട് ഡൗൺലോഡ്',
    filterByCrop: 'വിളയനുസരിച്ച് ഫിൽട്ടർ ചെയ്യുക',
    searchPlaceholder: 'രോഗങ്ങൾ, ലക്ഷണങ്ങൾ, പ്രതിവിധികൾ തിരയുക...',

    stage1Title: 'ഘട്ടം 1: വിള ഇനം തിരിച്ചറിയൽ',
    stage1Desc: 'ഇലയുടെ രൂപഘടനയും സിരകളും വിശകലനം ചെയ്ത് വിള സ്ഥിരീകരിക്കുന്നു.',
    stage2Title: 'ഘട്ടം 2: പ്രത്യേക രോഗനിർണ്ണയം',
    stage2Desc: 'സ്ഥിരീകരിച്ച വിളയുടെ രോഗങ്ങളുമായി ഇലയിലെ പാടുകൾ താരതമ്യം ചെയ്യുന്നു.',
    cropMismatchTitle: 'വിള പൊരുത്തക്കേട് കണ്ടെത്തി! (Crop Mismatch)',
    cropMismatchDesc: 'തിരഞ്ഞെടുത്ത വിളയല്ല അപ്‌ലോഡ് ചെയ്ത ചിത്രത്തിലുള്ളതെന്ന് തോന്നുന്നു.',
    detectedCropLabel: 'കണ്ടെത്തിയ ചെടി',
    selectedCropLabel: 'തിരഞ്ഞെടുത്ത വിള',
    switchAndAnalyse: 'കണ്ടെത്തിയ വിളയിലേക്ക് മാറ്റി പരിശോധിക്കുക',
    retryUpload: 'ശരിയായ ഇലയുടെ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക',
    unknownCropTitle: 'അപരിചിതമായ സസ്യം',
    unknownCropDesc: 'ഈ ചെടിയെ കൃത്യമായി തിരിച്ചറിയാൻ കഴിഞ്ഞില്ല. നല്ല വെളിച്ചത്തിൽ അടുത്തുള്ള വ്യക്തമായ ഫോട്ടോ എടുക്കുക.',

    differentialTitle: 'ടോപ്പ് 3 സാധ്യതാ രോഗനിർണ്ണയം',
    differentialSubtitle: 'ദൃശ്യ തെളിവുകൾ വെച്ച് ക്രമീകരിച്ച ഏറ്റവും സാധ്യതയുള്ള 3 രോഗങ്ങൾ.',
    rank1Label: 'പ്രാഥമിക സംശയിക്കപ്പെടുന്ന രോഗം (#1)',
    rank2Label: 'രണ്ടാമത്തെ സാധ്യത (#2)',
    rank3Label: 'മൂന്നാമത്തെ സാധ്യത (#3)',
    observedEvidenceTitle: 'കണ്ടെത്തിയ ദൃശ്യ ലക്ഷണങ്ങൾ',
    distinguishingTitle: 'പ്രധാന വേർതിരിക്കുന്ന ലക്ഷണം',
    missingChecksTitle: 'കാണപ്പെടാത്ത ലക്ഷണങ്ങൾ',
    nextStepsTitle: 'തുടർ പരിശോധനകൾ',
    intelligentComparisonTitle: 'താരതമ്യ വിശകലനം',
    confidenceScore: 'AI വിശ്വാസ്യത സ്കോർ',
    severityLevel: 'രോഗ തീവ്രത',
    healthScoreTitle: 'ആരോഗ്യ സ്കോർ',
    uncertainAlertTitle: 'അനിശ്ചിത ഫലം – കൂടുതൽ പരിശോധന വേണം',
    uncertainAlertDesc: 'ചിത്രം വ്യക്തമല്ല. ഉറപ്പില്ലാത്ത രോഗനിർണ്ണയത്തിന്റെ അടിസ്ഥാനത്തിൽ കീടനാശിനികൾ ഉപയോഗിക്കരുത്.',
    gradCamTitle: 'വിശദീകരണ AI: ശ്രദ്ധാ കേന്ദ്രം (Grad-CAM)',
    gradCamDesc: 'AI രോഗനിർണ്ണയത്തിനായി ശ്രദ്ധിച്ച ഇലയിലെ ഭാഗങ്ങൾ ഹൈലൈറ്റ് ചെയ്യുന്നു.',
    originalImage: 'യഥാർത്ഥ ഇല',
    attentionHeatmap: 'AI ശ്രദ്ധാ മാപ്പ്',

    categories: {
      fungal: 'ഫംഗസ് ബാധ',
      bacterial: 'ബാക്ടീരിയ രോഗം',
      viral: 'വൈറസ് ബാധ',
      pest: 'കീടബാധ',
      deficiency: 'പോഷകക്കുറവ്',
      environmental: 'കാലാവസ്ഥാ സമ്മർദ്ദം',
      healthy: 'ആരോഗ്യമുള്ളത്',
      beneficial: 'ഉപകാരിയായ പ്രാണികൾ',
    },
    severities: {
      none: 'ആരോഗ്യമുള്ളത്',
      low: 'കുറഞ്ഞ അപകടസാധ്യത',
      moderate: 'ഇടത്തരം ബാധ',
      high: 'തീവ്രമായ ബാധ',
      severe: 'ഗുരുതരമായ സ്ഥിതി',
    },

    immediateAction: 'ഉടൻ ചെയ്യേണ്ട കാര്യങ്ങൾ',
    organicControl: 'ജൈവ നിയന്ത്രണം',
    biologicalControl: 'ജൈവ കീടനാശിനികൾ',
    ipmStrategy: 'സംയോജിത കീടപരിപാലനം',
    chemicalGuidance: 'സുരക്ഷിതമായ രാസ നിർദ്ദേശങ്ങൾ',

    totalScans: 'ആകെ സ്കാനുകൾ',
    healthyCrops: 'ആരോഗ്യമുള്ള ചെടികൾ',
    diseasesDetected: 'കണ്ടെത്തിയ രോഗങ്ങൾ',
    pestsDetected: 'കണ്ടെത്തിയ കീടങ്ങൾ',
    recentActivity: 'സമീപകാല പരിശോധനകൾ',
    quickTipsTitle: 'ഇന്നത്തെ കാർഷിക നിർദ്ദേശങ്ങൾ',
    quickTips: [
      'രാവിലെ മഞ്ഞുതുള്ളികൾ ഉള്ളപ്പോൾ താഴത്തെ ഇലകൾ പരിശോധിക്കുക.',
      'ഇലകൾ മുറിക്കുന്ന കത്രികകൾ അണുവിമുക്തമാക്കുക.',
      'തുള്ളിനന വഴി ഫംഗസ് പടരുന്നത് തടയാം.',
      'ലേഡിബഗ് വണ്ടുകളെ സംരക്ഷിക്കുക; അവ ഉപദ്രവകാരികളായ കീടങ്ങളെ ഭക്ഷിക്കുന്നു.',
    ],
  },
};
