import React, { useRef, useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Camera,
  CheckCircle2,
  FolderOpen,
  Image as ImageIcon,
  RefreshCw,
  RotateCw,
  ScanLine,
  Sliders,
  Sparkles,
  Trash2,
  Upload,
  Video,
} from 'lucide-react';
import { CropType, DiagnosisResult } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { CROPS_METADATA } from '../../data/diseaseDatabase';
import { OfflineAiEngine } from '../../services/offlineAiEngine';
import { localDB } from '../../services/db';
import { DifferentialDiagnosisCard } from '../DifferentialDiagnosisCard';

export const AiCropScannerView: React.FC = () => {
  const { t } = useLanguage();

  const [selectedCrop, setSelectedCrop] = useState<CropType>('tomato');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isAnalysing, setIsAnalysing] = useState<boolean>(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Camera capture states
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sample preloaded leaves for instant test verification
  const sampleLeafTests: { label: string; crop: CropType; image: string }[] = [
    {
      label: 'Tomato Early Blight Sample',
      crop: 'tomato',
      image: '/src/assets/images/leaf_diagnostic_showcase_1793904223640.jpg',
    },
    {
      label: 'Beneficial Ladybug on Stem',
      crop: 'tomato',
      image: '/src/assets/images/pest_inspection_field_1793904224196.jpg',
    },
    {
      label: 'Potato Leaf Sample',
      crop: 'potato',
      image: '/src/assets/images/leaf_diagnostic_showcase_1793904223640.jpg',
    },
  ];

  // ==================== CAMERA HANDLING ====================
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      alert('Unable to access camera offline. Please verify device permissions or choose an image from gallery.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureCameraPhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setImageUri(dataUrl);
    setRotationAngle(0);
    setDiagnosis(null);
    setIsSaved(false);
    stopCamera();
  };

  // ==================== GALLERY HANDLING ====================
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUri(event.target?.result as string);
      setRotationAngle(0);
      setDiagnosis(null);
      setIsSaved(false);
    };
    reader.readAsDataURL(file);
  };

  // Image rotation
  const handleRotate = () => {
    setRotationAngle((prev) => (prev + 90) % 360);
  };

  // Reset/Remove photo
  const handleClearPhoto = () => {
    setImageUri(null);
    setRotationAngle(0);
    setDiagnosis(null);
    setIsSaved(false);
    stopCamera();
  };

  // ==================== RUN OFFLINE AI DIAGNOSIS ====================
  const runDiagnosis = async (forcedCrop?: CropType) => {
    if (!imageUri) return;
    const targetCrop = forcedCrop || selectedCrop;

    setIsAnalysing(true);
    setDiagnosis(null);
    setIsSaved(false);

    try {
      // Simulate real neural inference processing tick (500ms)
      await new Promise((resolve) => setTimeout(resolve, 450));
      const result = await OfflineAiEngine.diagnoseImage(imageUri, targetCrop);
      setDiagnosis(result);
    } catch (err) {
      console.error('Diagnosis failed:', err);
      alert('Error during offline computer vision inference. Please retry.');
    } finally {
      setIsAnalysing(false);
    }
  };

  // Switch crop when mismatch detected
  const handleSwitchCropAndDiagnose = (newCrop: CropType) => {
    setSelectedCrop(newCrop);
    runDiagnosis(newCrop);
  };

  // Save to scan history
  const handleSaveToHistory = async () => {
    if (!diagnosis) return;
    try {
      await localDB.saveScan(diagnosis);
      setIsSaved(true);
    } catch (err) {
      console.error('Failed to save scan offline:', err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Introduction */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 md:text-2xl">{t.navScanner}</h2>
          <p className="text-xs text-stone-500">
            Two-stage offline AI: crop species verification + top-3 differential pathology diagnosis.
          </p>
        </div>

        {/* Crop Selector Bar */}
        <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-1.5 shadow-xs">
          <label htmlFor="crop-select" className="text-xs font-semibold text-stone-600">
            {t.selectCrop}:
          </label>
          <select
            id="crop-select"
            value={selectedCrop}
            onChange={(e) => {
              setSelectedCrop(e.target.value as CropType);
              if (diagnosis) setDiagnosis(null);
            }}
            className="text-xs font-bold text-emerald-800 outline-none cursor-pointer bg-transparent"
          >
            {(Object.keys(CROPS_METADATA) as CropType[]).map((crop) => (
              <option key={crop} value={crop}>
                {CROPS_METADATA[crop].name} ({CROPS_METADATA[crop].family})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Interactive Work Area */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Col: Capture / Upload & Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Foliar Image Acquisition
            </h3>

            {/* LIVE CAMERA FEED (if active) */}
            {isCameraActive ? (
              <div className="space-y-3">
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border border-emerald-500 bg-stone-900 shadow-inner">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-cover"
                  />
                  {/* Viewfinder reticle overlay */}
                  <div className="pointer-events-none absolute inset-8 border-2 border-dashed border-emerald-400/70 rounded-lg"></div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={stopCamera}
                    className="rounded-lg border border-stone-300 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={captureCameraPhoto}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                  >
                    <Camera className="h-4 w-4" />
                    <span>Snap Photo</span>
                  </button>
                </div>
              </div>
            ) : imageUri ? (
              /* IMAGE PREVIEW WITH CONTROLS */
              <div className="space-y-3">
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border border-stone-200 bg-stone-900">
                  <img
                    src={imageUri}
                    alt="Selected leaf"
                    style={{ transform: `rotate(${rotationAngle}deg)` }}
                    className="h-full w-full object-contain transition-transform duration-200"
                  />
                </div>

                {/* Edit Controls: Rotate, Retake, Remove */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-2 text-xs">
                  <button
                    onClick={handleRotate}
                    className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 font-medium text-stone-700 hover:bg-stone-100"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                    <span>{t.rotateImage}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (fileInputRef.current) fileInputRef.current.click();
                    }}
                    className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 font-medium text-stone-700 hover:bg-stone-100"
                  >
                    <FolderOpen className="h-3.5 w-3.5" />
                    <span>{t.changePhoto}</span>
                  </button>

                  <button
                    onClick={handleClearPhoto}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{t.clearImage}</span>
                  </button>
                </div>

                {/* Analyse Button */}
                <button
                  onClick={() => runDiagnosis()}
                  disabled={isAnalysing}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors"
                >
                  {isAnalysing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>{t.analysing}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>{t.analyseImage}</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* EMPTY STATE: OPTION A AND OPTION B */
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* Option A: Camera Capture */}
                  <button
                    onClick={startCamera}
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-5 text-center transition-all hover:border-emerald-600 hover:bg-emerald-50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
                      <Camera className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-emerald-950">Option A</span>
                      <span className="text-xs font-semibold text-emerald-800">{t.capturePhoto}</span>
                    </div>
                    <p className="text-[11px] text-emerald-700/80">Take direct photo in the field</p>
                  </button>

                  {/* Option B: Gallery Upload */}
                  <button
                    onClick={() => {
                      if (fileInputRef.current) fileInputRef.current.click();
                    }}
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50/50 p-5 text-center transition-all hover:border-stone-500 hover:bg-stone-50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-200 text-stone-700">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-stone-500">Option B</span>
                      <span className="text-xs font-semibold text-stone-800">{t.chooseGallery}</span>
                    </div>
                    <p className="text-[11px] text-stone-500">JPG, JPEG, PNG, WEBP</p>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Preloaded Demo Leaf Samples for Quick Testing */}
                <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-3">
                  <span className="text-[11px] font-bold text-stone-600">Quick Test Samples:</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sampleLeafTests.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedCrop(s.crop);
                          setImageUri(s.image);
                          setDiagnosis(null);
                        }}
                        className="rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-medium text-stone-700 hover:border-emerald-500 hover:text-emerald-800 shadow-2xs"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Morphological Features of Selected Crop */}
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs text-xs space-y-2">
            <span className="font-bold text-stone-700">Target Botanical Reference:</span>
            <p className="text-stone-600 leading-relaxed">
              {CROPS_METADATA[selectedCrop].leafCharacteristics}
            </p>
          </div>
        </div>

        {/* Right Col: 2-Stage Verification & Diagnostic Output (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {isAnalysing ? (
            /* ANALYSING SKELETON / LOADER */
            <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-xs">
              <RefreshCw className="h-10 w-10 animate-spin text-emerald-600" />
              <h3 className="mt-4 font-bold text-stone-900 text-base">{t.analysing}</h3>
              <div className="mt-3 space-y-1 text-xs text-stone-500">
                <p>Stage 1: Extracting botanical morphology and verifying leaf venation...</p>
                <p>Stage 2: Evaluating pathology against {CROPS_METADATA[selectedCrop].name} disease classes...</p>
                <p>Generating Grad-CAM attention heatmap overlay...</p>
              </div>
            </div>
          ) : diagnosis ? (
            /* DIAGNOSIS OUTPUT OR MISMATCH ALERT */
            diagnosis.cropVerification.isMismatch ? (
              /* CROP MISMATCH ALERT */
              <div className="rounded-2xl border-2 border-red-300 bg-red-50/70 p-6 shadow-sm space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white">
                    <AlertOctagon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-red-950">{t.cropMismatchTitle}</h3>
                    <p className="text-xs text-red-900 mt-0.5">{t.cropMismatchDesc}</p>
                  </div>
                </div>

                {/* Comparison Box */}
                <div className="grid grid-cols-2 gap-3 rounded-xl border border-red-200 bg-white p-3 text-xs">
                  <div>
                    <span className="text-stone-400 font-medium">{t.selectedCropLabel}:</span>
                    <p className="font-bold text-stone-800 capitalize">{selectedCrop}</p>
                  </div>
                  <div>
                    <span className="text-red-600 font-semibold">{t.detectedCropLabel}:</span>
                    <p className="font-bold text-red-900 capitalize">
                      {diagnosis.cropVerification.detectedCrop} ({diagnosis.cropVerification.confidence}% match)
                    </p>
                  </div>
                </div>

                <p className="text-xs text-red-950/80 leading-relaxed">
                  To prevent cross-crop false positives, AgriScan has blocked incorrect pathology diagnosis. Please choose whether to switch the active crop to the detected species or upload the correct leaf image.
                </p>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {diagnosis.cropVerification.detectedCrop !== 'unknown' && (
                    <button
                      onClick={() =>
                        handleSwitchCropAndDiagnose(diagnosis.cropVerification.detectedCrop as CropType)
                      }
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{t.switchAndAnalyse}</span>
                    </button>
                  )}

                  <button
                    onClick={handleClearPhoto}
                    className="flex items-center gap-1.5 rounded-xl border border-red-300 bg-white px-4 py-2.5 text-xs font-semibold text-red-900 hover:bg-red-50"
                  >
                    <RotateCw className="h-4 w-4" />
                    <span>{t.retryUpload}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* SUCCESSFUL DIFFERENTIAL DIAGNOSIS */
              <DifferentialDiagnosisCard
                diagnosis={diagnosis}
                onSave={handleSaveToHistory}
                isSaved={isSaved}
              />
            )
          ) : (
            /* DEFAULT EMPTY PROMPT */
            <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-white p-8 text-center text-stone-400 shadow-xs">
              <ScanLine className="h-12 w-12 text-stone-300" />
              <h3 className="mt-3 font-bold text-stone-700 text-sm">No Active Scan In Progress</h3>
              <p className="mt-1 max-w-sm text-xs text-stone-500">
                Capture a crop leaf photo using your camera or choose an image from your device gallery to initiate offline two-stage diagnosis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
