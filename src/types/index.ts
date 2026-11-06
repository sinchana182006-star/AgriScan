export type Language = 'en' | 'kn' | 'hi' | 'ml';

export type CropType = 'tomato' | 'potato' | 'apple' | 'grapes' | 'banana' | 'mango' | 'citrus';

export type PathogenCategory =
  | 'fungal'
  | 'bacterial'
  | 'viral'
  | 'pest'
  | 'deficiency'
  | 'environmental'
  | 'healthy'
  | 'beneficial';

export type SeverityLevel = 'none' | 'low' | 'moderate' | 'high' | 'severe';

export interface TreatmentProtocol {
  immediate: string[];
  organic: string[];
  biological: string[];
  ipm: string[];
  chemical: string[];
}

export interface DiseaseRecord {
  id: string;
  crop: CropType;
  name: string;
  scientificName?: string;
  category: PathogenCategory;
  severity: SeverityLevel;
  symptoms: string[];
  distinguishingFeatures: string[];
  missingChecks: string[];
  causes: string[];
  affectedParts: string[];
  treatments: TreatmentProtocol;
  prevention: string[];
  sampleVisualUrl?: string;
}

export interface PestRecord {
  id: string;
  name: string;
  scientificName: string;
  type: 'harmful_pest' | 'beneficial_insect';
  affectedCrops: CropType[];
  damageCharacteristics: string[];
  visibleFeatures: string[];
  severity: SeverityLevel;
  preventionMethods: string[];
  biologicalControl: string[];
}

export interface CropVerificationResult {
  detectedCrop: CropType | 'unknown';
  detectedCropName: string;
  confidence: number; // 0 - 100
  selectedCrop: CropType;
  isMismatch: boolean;
  visualTraits: {
    leafStructure: string;
    leafMargin: string;
    veinPattern: string;
    textureRating: string;
  };
}

export interface DifferentialDiagnosis {
  rank: 1 | 2 | 3;
  diseaseId: string;
  name: string;
  scientificName?: string;
  category: PathogenCategory;
  confidence: number; // percentage e.g. 78%
  severity: SeverityLevel;
  observedEvidence: string[];
  distinguishingFactor: string;
  absentEvidence: string[];
  nextSteps: string[];
  treatments: TreatmentProtocol;
}

export interface DiagnosisResult {
  id: string;
  timestamp: number;
  imageUri: string;
  cropVerification: CropVerificationResult;
  top3: DifferentialDiagnosis[];
  comparisonAnalysis: string;
  saliencyHeatmapUri?: string;
  healthScore: number; // 0 - 100
  necrosisPercentage: number;
  isUncertain: boolean;
  uncertaintyReason?: string;
  cropName: string;
  notes?: string;
}

export interface MultiImageScanItem {
  id: string;
  imageUri: string;
  name: string;
  crop: CropType;
  diagnosis?: DiagnosisResult;
  status: 'idle' | 'processing' | 'done' | 'error';
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  state: string;
  district: string;
  preferredLanguage: Language;
  mainCrop: CropType;
  createdAt: number;
}

export interface FarmerNote {
  id: string;
  title: string;
  crop: CropType;
  plotLocation: string;
  date: string;
  content: string;
  createdAt: number;
}

export interface FarmerReminder {
  id: string;
  title: string;
  crop: CropType;
  dueDate: string;
  type: 'inspection' | 'spray' | 'fertilizer' | 'harvest';
  completed: boolean;
  severity: 'normal' | 'urgent';
}
