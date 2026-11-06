import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  Info,
  Layers,
  ShieldAlert,
  Sliders,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { DiagnosisResult, DifferentialDiagnosis } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface DifferentialDiagnosisCardProps {
  diagnosis: DiagnosisResult;
  onSave?: () => void;
  isSaved?: boolean;
}

export const DifferentialDiagnosisCard: React.FC<DifferentialDiagnosisCardProps> = ({
  diagnosis,
  onSave,
  isSaved = false,
}) => {
  const { t } = useLanguage();
  const [selectedRank, setSelectedRank] = useState<1 | 2 | 3>(1);
  const [showGradCam, setShowGradCam] = useState(true);
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.65);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState<'evidence' | 'comparison' | 'treatment'>('evidence');

  const { top3, cropVerification, healthScore, isUncertain, uncertaintyReason, comparisonAnalysis } = diagnosis;
  const currentCandidate = top3.find((c) => c.rank === selectedRank) || top3[0];

  // Offline text-to-speech
  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `${t.rank1Label}: ${currentCandidate.name}. ${t.confidenceScore}: ${currentCandidate.confidence} percent. ${currentCandidate.distinguishingFactor}. ${currentCandidate.treatments.immediate[0] || ''}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'none':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'low':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'moderate':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'high':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'severe':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-stone-700 bg-stone-50 border-stone-200';
    }
  };

  return (
    <div className="space-y-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs md:p-6">
      {/* Header bar: Crop Verification & Health Score */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              {cropVerification.detectedCropName}
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500">
              Verified ({cropVerification.confidence}% match)
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 md:text-2xl">{t.differentialTitle}</h2>
          <p className="text-xs text-stone-500">{t.differentialSubtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Health Score Pill */}
          <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5">
            <span className="text-xs text-stone-500">{t.healthScoreTitle}:</span>
            <span
              className={`font-mono-numbers text-base font-bold ${
                healthScore > 75
                  ? 'text-emerald-600'
                  : healthScore > 45
                  ? 'text-amber-600'
                  : 'text-red-600'
              }`}
            >
              {healthScore}/100
            </span>
          </div>

          {/* Voice Speech button */}
          {'speechSynthesis' in window && (
            <button
              onClick={handleSpeak}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                isSpeaking
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
              }`}
              title="Speak diagnosis offline"
            >
              {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-emerald-600" />}
              <span>{isSpeaking ? 'Stop Audio' : 'Play Voice'}</span>
            </button>
          )}

          {onSave && (
            <button
              onClick={onSave}
              disabled={isSaved}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                isSaved
                  ? 'bg-stone-100 text-stone-400 cursor-default'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isSaved ? 'Saved to History' : t.saveToHistory}
            </button>
          )}
        </div>
      </div>

      {/* Uncertainty Alert Banner (if applicable) */}
      {isUncertain && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          <div className="text-xs">
            <h4 className="font-bold">{t.uncertainAlertTitle}</h4>
            <p className="mt-0.5 text-amber-800">{uncertaintyReason || t.uncertainAlertDesc}</p>
          </div>
        </div>
      )}

      {/* Dual Column: Left = Grad-CAM Visual Inspection, Right = Top 3 Ranked Differential Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Interactive Visual & Grad-CAM Attention Heatmap (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold text-stone-800">{t.gradCamTitle}</span>
            </div>
            <button
              onClick={() => setShowGradCam(!showGradCam)}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              {showGradCam ? 'Hide Heatmap' : 'Show Attention Heatmap'}
            </button>
          </div>

          {/* Image & Heatmap Container */}
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border border-stone-200 bg-stone-900">
            {/* Base leaf photo */}
            <img
              src={diagnosis.imageUri}
              alt={t.originalImage}
              className="h-full w-full object-contain"
            />

            {/* Saliency Attention Heatmap Overlay */}
            {showGradCam && diagnosis.saliencyHeatmapUri && (
              <img
                src={diagnosis.saliencyHeatmapUri}
                alt={t.attentionHeatmap}
                style={{ opacity: heatmapOpacity }}
                className="pointer-events-none absolute inset-0 h-full w-full object-contain mix-blend-screen transition-opacity"
              />
            )}

            {/* In-image label badge */}
            <div className="absolute bottom-2 left-2 flex items-center gap-2 rounded-md bg-stone-900/80 px-2 py-1 text-[10px] text-white backdrop-blur-xs">
              <span>{showGradCam ? 'Grad-CAM Attention Map' : 'Original Leaf Capture'}</span>
            </div>
          </div>

          {/* Opacity Slider for Grad-CAM */}
          {showGradCam && (
            <div className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-xs">
              <Sliders className="h-3.5 w-3.5 text-stone-500" />
              <span className="text-stone-600">AI Heatmap Intensity:</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={heatmapOpacity}
                onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))}
                className="h-1.5 flex-1 accent-emerald-600 cursor-pointer"
              />
              <span className="font-mono-numbers text-[11px] text-stone-500">
                {Math.round(heatmapOpacity * 100)}%
              </span>
            </div>
          )}

          {/* Heatmap Legend */}
          <div className="flex items-center justify-between text-[11px] text-stone-500">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500"></span> High Lesion Focus
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-yellow-400"></span> Yellow Halo
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-600"></span> Healthy Foliage
            </span>
          </div>
        </div>

        {/* Right: The Top 3 Ranked Possibilities (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700">Ranked Diagnostic Possibilities</span>
            <span className="text-[11px] text-stone-500">Click a candidate to view specific evidence</span>
          </div>

          {/* 3 Differential Ranked Buttons */}
          <div className="space-y-2">
            {top3.map((cand) => {
              const isSelected = cand.rank === selectedRank;
              return (
                <div
                  key={cand.rank}
                  onClick={() => setSelectedRank(cand.rank)}
                  className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-500/30'
                      : 'border-stone-200 bg-white hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {/* Rank badge */}
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                          cand.rank === 1
                            ? 'bg-emerald-600 text-white'
                            : cand.rank === 2
                            ? 'bg-stone-200 text-stone-700'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        #{cand.rank}
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-stone-900">{cand.name}</h3>
                          {cand.scientificName && (
                            <span className="hidden text-xs italic text-stone-500 sm:inline">
                              ({cand.scientificName})
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-stone-500 capitalize">{cand.category}</span>
                      </div>
                    </div>

                    {/* Confidence bar & percentage */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-mono-numbers text-base font-extrabold text-stone-900">
                          {cand.confidence}%
                        </span>
                        <p className="text-[10px] text-stone-400">Confidence</p>
                      </div>

                      <div className="hidden h-10 w-16 flex-col justify-center gap-1 sm:flex">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
                          <div
                            className={`h-full rounded-full ${
                              cand.rank === 1
                                ? 'bg-emerald-600'
                                : cand.rank === 2
                                ? 'bg-amber-500'
                                : 'bg-stone-400'
                            }`}
                            style={{ width: `${cand.confidence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary distinguishing snippet */}
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-stone-600 border-t border-stone-100 pt-2">
                    <span className="font-semibold text-emerald-800">Distinguishing marker:</span>
                    <span className="truncate">{cand.distinguishingFactor}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tabs for Candidate Detail: Evidence / Intelligent Comparison / Treatment */}
          <div className="pt-2">
            <div className="flex border-b border-stone-200 text-xs font-semibold text-stone-500">
              <button
                onClick={() => setActiveTab('evidence')}
                className={`border-b-2 px-4 py-2 transition-colors ${
                  activeTab === 'evidence'
                    ? 'border-emerald-600 text-emerald-700 font-bold'
                    : 'border-transparent hover:text-stone-800'
                }`}
              >
                Detailed Evidence (#{selectedRank})
              </button>
              <button
                onClick={() => setActiveTab('comparison')}
                className={`border-b-2 px-4 py-2 transition-colors ${
                  activeTab === 'comparison'
                    ? 'border-emerald-600 text-emerald-700 font-bold'
                    : 'border-transparent hover:text-stone-800'
                }`}
              >
                Why #{1} vs #{2} & #{3}?
              </button>
              <button
                onClick={() => setActiveTab('treatment')}
                className={`border-b-2 px-4 py-2 transition-colors ${
                  activeTab === 'treatment'
                    ? 'border-emerald-600 text-emerald-700 font-bold'
                    : 'border-transparent hover:text-stone-800'
                }`}
              >
                Treatments & Action Plan
              </button>
            </div>

            {/* TAB 1: EVIDENCE */}
            {activeTab === 'evidence' && (
              <div className="mt-3 space-y-3 text-xs">
                {/* Visible evidence detected */}
                <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                  <h4 className="font-bold text-stone-800 flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {t.observedEvidenceTitle}
                  </h4>
                  <ul className="mt-2 space-y-1 text-stone-600 pl-5 list-disc">
                    {currentCandidate.observedEvidence.map((ev, i) => (
                      <li key={i}>{ev}</li>
                    ))}
                  </ul>
                </div>

                {/* Missing checks / unconfirmed symptoms */}
                {currentCandidate.absentEvidence && currentCandidate.absentEvidence.length > 0 && (
                  <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                    <h4 className="font-bold text-stone-700 flex items-center gap-1.5 text-xs">
                      <Info className="h-4 w-4 text-stone-400" />
                      {t.missingChecksTitle}
                    </h4>
                    <ul className="mt-2 space-y-1 text-stone-500 pl-5 list-disc">
                      {currentCandidate.absentEvidence.map((miss, i) => (
                        <li key={i}>{miss}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended Next Steps for Field Confirmation */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
                  <h4 className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
                    <ShieldAlert className="h-4 w-4 text-emerald-700" />
                    {t.nextStepsTitle}
                  </h4>
                  <ul className="mt-2 space-y-1 text-emerald-900 pl-5 list-decimal">
                    {currentCandidate.nextSteps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 2: INTELLIGENT COMPARISON */}
            {activeTab === 'comparison' && (
              <div className="mt-3 space-y-3 text-xs">
                <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs">
                  <h4 className="font-bold text-stone-900 text-sm">{t.intelligentComparisonTitle}</h4>
                  <p className="mt-2 leading-relaxed text-stone-700">{comparisonAnalysis}</p>

                  <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {top3.map((c) => (
                      <div key={c.rank} className="rounded-lg border border-stone-200 bg-stone-50 p-2.5">
                        <span className="text-[10px] font-bold uppercase text-stone-500">
                          Candidate #{c.rank}
                        </span>
                        <p className="font-bold text-stone-800 truncate">{c.name}</p>
                        <p className="font-mono-numbers text-xs text-emerald-700 font-semibold mt-0.5">
                          {c.confidence}% Match
                        </p>
                        <p className="mt-1 text-[11px] text-stone-600 line-clamp-3">
                          {c.distinguishingFactor}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: TREATMENTS */}
            {activeTab === 'treatment' && (
              <div className="mt-3 space-y-3 text-xs">
                {/* Immediate */}
                <div className="rounded-xl border border-red-200 bg-red-50/50 p-3">
                  <span className="font-bold text-red-900">{t.immediateAction}:</span>
                  <ul className="mt-1.5 space-y-1 pl-5 list-disc text-red-950">
                    {currentCandidate.treatments.immediate.map((act, i) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>

                {/* Organic & Biological */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3">
                  <span className="font-bold text-emerald-950">{t.organicControl} & {t.biologicalControl}:</span>
                  <ul className="mt-1.5 space-y-1 pl-5 list-disc text-emerald-900">
                    {currentCandidate.treatments.organic.concat(currentCandidate.treatments.biological).map((org, i) => (
                      <li key={i}>{org}</li>
                    ))}
                  </ul>
                </div>

                {/* Extension Chemical Warning */}
                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3">
                  <span className="font-bold text-amber-950">{t.chemicalGuidance}:</span>
                  <ul className="mt-1.5 space-y-1 pl-5 list-disc text-amber-900">
                    {currentCandidate.treatments.chemical.map((chem, i) => (
                      <li key={i}>{chem}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-[10px] text-amber-800 italic">
                    Note: Never apply synthetic fungicides without field verification. Consult your local Krishi Vigyan Kendra (KVK) or extension specialist.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
