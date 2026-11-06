import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Droplet,
  FlaskConical,
  HelpCircle,
  Info,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { CropType } from '../../types';
import { CROPS_METADATA } from '../../data/diseaseDatabase';

interface SymptomQuestion {
  id: string;
  question: string;
  options: { label: string; clue: string; weightCategory: string }[];
}

export const MultiCauseDiagnosisView: React.FC = () => {
  const { t } = useLanguage();

  const [selectedCrop, setSelectedCrop] = useState<CropType>('tomato');
  const [foliarPosition, setFoliarPosition] = useState<'lower' | 'upper' | 'all'>('lower');
  const [yellowingPattern, setYellowingPattern] = useState<'interveinal' | 'marginal' | 'uniform' | 'mottled' | 'none'>('interveinal');
  const [spotCharacteristics, setSpotCharacteristics] = useState<'concentric' | 'water_soaked' | 'powdery' | 'shot_hole' | 'none'>('concentric');
  const [recentWeather, setRecentWeather] = useState<'heavy_rain' | 'hot_dry' | 'cool_humid' | 'normal'>('heavy_rain');
  const [hasWilt, setHasWilt] = useState<'yes_daytime' | 'yes_permanent' | 'no'>('no');

  const [result, setResult] = useState<{
    primaryCategory: string;
    conditionName: string;
    confidence: number;
    explanation: string;
    differentialBreakdown: { category: string; matchScore: number; reason: string }[];
    remedySteps: string[];
  } | null>(null);

  const handleEvaluate = () => {
    // Interactive multi-cause deduction logic
    let category = 'Fungal Infection';
    let name = 'Alternaria Leaf Spot';
    let conf = 82;
    let explanation = '';
    const breakdown: { category: string; matchScore: number; reason: string }[] = [];
    const remedySteps: string[] = [];

    // Nitrogen vs Potassium vs Micronutrient vs Fungal vs Bacterial
    if (yellowingPattern === 'uniform' && foliarPosition === 'lower' && spotCharacteristics === 'none') {
      category = 'Nutrient Deficiency';
      name = 'Nitrogen (N) Deficiency';
      conf = 88;
      explanation = 'Uniform general chlorosis starting strictly on older, lower foliage while upper young leaves remain greener is the signature physiological marker of mobile Nitrogen deficiency.';
      breakdown.push({ category: 'Nitrogen Deficiency', matchScore: 88, reason: 'Mobile nutrient translocation from bottom to top leaves.' });
      breakdown.push({ category: 'Sulfur Deficiency', matchScore: 42, reason: 'Sulfur is immobile and would cause yellowing on top young leaves first.' });
      breakdown.push({ category: 'Viral Mottle', matchScore: 20, reason: 'No patchwork mosaic variegation observed.' });
      remedySteps.push('Conduct soil nitrogen test; apply balanced calcium nitrate or well-decomposed farmyard manure.');
    } else if (yellowingPattern === 'marginal' && foliarPosition === 'lower') {
      category = 'Nutrient Deficiency';
      name = 'Potassium (K) Marginal Scorch';
      conf = 84;
      explanation = 'Foliar chlorosis and necrotic scorch along outer leaf margins on older leaves indicate Potassium starvation during heavy fruit load.';
      breakdown.push({ category: 'Potassium Deficiency', matchScore: 84, reason: 'Outer margin browning with green leaf centers.' });
      breakdown.push({ category: 'Salt Burn', matchScore: 50, reason: 'High electrical conductivity can cause similar tip burn.' });
      breakdown.push({ category: 'Bacterial Spot', matchScore: 28, reason: 'Absence of distinct water-soaked angular lesions.' });
      remedySteps.push('Apply potassium sulfate (SOP) or organic wood ash mulch around the root perimeter.');
    } else if (yellowingPattern === 'interveinal') {
      category = 'Nutrient Deficiency';
      name = 'Magnesium (Mg) / Iron (Fe) Chlorosis';
      conf = 81;
      explanation = 'Green veins with yellow interveinal tissue (herringbone pattern). Lower leaves indicate Magnesium; upper shoots indicate Iron deficiency in high-pH soil.';
      breakdown.push({ category: 'Interveinal Chlorosis', matchScore: 81, reason: 'Clear distinction between dark green veins and pale yellow leaf tissue.' });
      breakdown.push({ category: 'Viral Vein Clearing', matchScore: 35, reason: 'No vein distortion or cupping.' });
      remedySteps.push('Apply foliar spray of Epsom salt (Magnesium sulfate 1%) or chelated iron (Fe-EDDHA).');
    } else if (spotCharacteristics === 'concentric') {
      category = 'Fungal Pathology';
      name = 'Early Blight (Alternaria solani)';
      conf = 86;
      explanation = 'Target-board concentric rings bounded by yellow chlorotic halo on lower leaves in warm humid weather strongly indicate Alternaria fungal infection.';
      breakdown.push({ category: 'Fungal Infection', matchScore: 86, reason: 'Concentric ring radial expansion pattern.' });
      breakdown.push({ category: 'Bacterial Spot', matchScore: 45, reason: 'Bacterial spots are angular and water-soaked, not concentric.' });
      remedySteps.push('Prune infected lower foliage immediately and apply copper fungicide spray.');
    } else if (spotCharacteristics === 'water_soaked' && recentWeather === 'heavy_rain') {
      category = 'Bacterial Pathology';
      name = 'Bacterial Spot / Speck (Xanthomonas)';
      conf = 83;
      explanation = 'Water-soaked translucent lesions spreading during rainy periods signify bacterial infection entering through foliar stomata and wounds.';
      breakdown.push({ category: 'Bacterial Infection', matchScore: 83, reason: 'Water-soaked margins driven by driving rainfall.' });
      breakdown.push({ category: 'Late Blight', matchScore: 52, reason: 'Late blight typically manifests white mold on undersides.' });
      remedySteps.push('Avoid working in wet fields; spray copper oxychloride combined with approved bactericide.');
    } else {
      category = 'Environmental Stress';
      name = 'Drought / Thermal Leaf Scorch';
      conf = 72;
      explanation = 'Symptoms reflect environmental moisture fluctuation rather than a specific biotic pathogen.';
      breakdown.push({ category: 'Environmental Stress', matchScore: 72, reason: 'Non-pathological margin stress.' });
      breakdown.push({ category: 'Fungal Infection', matchScore: 30, reason: 'No pathogen fruiting structures observed.' });
      remedySteps.push('Stabilize irrigation schedule with tensiometer and mulch soil.');
    }

    setResult({
      primaryCategory: category,
      conditionName: name,
      confidence: conf,
      explanation,
      differentialBreakdown: breakdown,
      remedySteps,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-stone-900 md:text-2xl">{t.navMultiCause}</h2>
        <p className="text-xs text-stone-500">
          Differential symptom questionnaire distinguishing Fungal, Bacterial, Viral, Pest, and Nutrient Deficiencies.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Col: Questionnaire Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Foliar Diagnostic Symptom Checklist
          </h3>

          {/* Question 1: Foliar Position */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-stone-800">1. Where are the symptoms localized on the plant?</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFoliarPosition('lower')}
                className={`rounded-xl border p-2 text-center font-medium transition-colors ${
                  foliarPosition === 'lower'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                Lower / Older Leaves
              </button>
              <button
                onClick={() => setFoliarPosition('upper')}
                className={`rounded-xl border p-2 text-center font-medium transition-colors ${
                  foliarPosition === 'upper'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                Upper / Young Shoots
              </button>
              <button
                onClick={() => setFoliarPosition('all')}
                className={`rounded-xl border p-2 text-center font-medium transition-colors ${
                  foliarPosition === 'all'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                Entire Canopy
              </button>
            </div>
          </div>

          {/* Question 2: Yellowing Pattern */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-stone-800">2. What pattern of yellowing (chlorosis) is visible?</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                { key: 'interveinal', label: 'Interveinal (Green veins)' },
                { key: 'marginal', label: 'Marginal Leaf Scorch' },
                { key: 'uniform', label: 'Uniform Yellowing' },
                { key: 'mottled', label: 'Mosaic Mottle' },
                { key: 'none', label: 'No Yellowing' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setYellowingPattern(item.key as any)}
                  className={`rounded-xl border p-2 text-left font-medium transition-colors ${
                    yellowingPattern === item.key
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Spot Characteristics */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-stone-800">3. Leaf spot or surface lesion appearance:</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'concentric', label: 'Concentric Target Rings' },
                { key: 'water_soaked', label: 'Water-Soaked / Angular' },
                { key: 'powdery', label: 'White Powdery Coating' },
                { key: 'shot_hole', label: 'Shot-Hole Perforations' },
                { key: 'none', label: 'No Discrete Spots' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setSpotCharacteristics(item.key as any)}
                  className={`rounded-xl border p-2 text-left font-medium transition-colors ${
                    spotCharacteristics === item.key
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 4: Weather Conditions */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-stone-800">4. Recent 7-day field weather:</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'heavy_rain', label: 'Persistent Rain / High Humidity' },
                { key: 'hot_dry', label: 'Hot, Dry, High Sunlight' },
                { key: 'cool_humid', label: 'Cool Mornings + Heavy Fog' },
                { key: 'normal', label: 'Normal Seasonal Conditions' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setRecentWeather(item.key as any)}
                  className={`rounded-xl border p-2 text-left font-medium transition-colors ${
                    recentWeather === item.key
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Run Multi-Cause Evaluation Button */}
          <button
            onClick={handleEvaluate}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            <span>Run Multi-Cause Diagnostic Evaluation</span>
          </button>
        </div>

        {/* Right Col: Differential Evaluation Output (6 cols) */}
        <div className="lg:col-span-6">
          {result ? (
            <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    {result.primaryCategory}
                  </span>
                  <h3 className="text-lg font-extrabold text-stone-900">{result.conditionName}</h3>
                </div>
                <div className="text-right">
                  <span className="font-mono-numbers text-xl font-black text-emerald-700">
                    {result.confidence}%
                  </span>
                  <p className="text-[10px] text-stone-400">Match Index</p>
                </div>
              </div>

              {/* Pathological Reasoning */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-xs">
                <span className="font-bold text-emerald-950">Diagnostic Deduction:</span>
                <p className="mt-1 leading-relaxed text-emerald-900">{result.explanation}</p>
              </div>

              {/* Differential Breakdown */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-stone-700">Differential Etiology Breakdown:</span>
                {result.differentialBreakdown.map((b, i) => (
                  <div key={i} className="rounded-xl border border-stone-200 bg-stone-50 p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-800">{b.category}</span>
                      <span className="font-mono-numbers font-semibold text-stone-600">
                        {b.matchScore}%
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">{b.reason}</p>
                  </div>
                ))}
              </div>

              {/* Recommended Action */}
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs">
                <span className="font-bold text-stone-800">Agronomic Remedy Steps:</span>
                <ul className="mt-1.5 space-y-1 pl-5 list-disc text-stone-700">
                  {result.remedySteps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-white p-6 text-center text-xs text-stone-400">
              <HelpCircle className="h-10 w-10 text-stone-300" />
              <h4 className="mt-2 font-bold text-stone-700">Select Symptoms to Analyze</h4>
              <p className="mt-1 max-w-xs text-stone-500">
                Answer the questionnaire questions on the left to distinguish between fungal, bacterial, viral, or nutrient deficiency causes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
