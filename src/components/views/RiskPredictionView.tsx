import React, { useState } from 'react';
import {
  AlertTriangle,
  CloudRain,
  CloudSun,
  Droplets,
  Info,
  ShieldAlert,
  Sparkles,
  Thermometer,
} from 'lucide-react';
import { CropType } from '../../types';
import { CROPS_METADATA } from '../../data/diseaseDatabase';
import { useLanguage } from '../../context/LanguageContext';

export const RiskPredictionView: React.FC = () => {
  const { t } = useLanguage();

  const [crop, setCrop] = useState<CropType>('tomato');
  const [temperature, setTemperature] = useState<number>(24);
  const [humidity, setHumidity] = useState<number>(85);
  const [rainfall, setRainfall] = useState<'dry' | 'moderate' | 'heavy'>('heavy');
  const [growthStage, setGrowthStage] = useState<'seedling' | 'vegetative' | 'flowering' | 'fruiting'>(
    'fruiting'
  );

  const [prediction, setPrediction] = useState<{
    riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
    primaryThreat: string;
    secondaryThreat: string;
    favorableFactors: string[];
    prophylacticMeasures: string[];
  } | null>(null);

  const handlePredict = () => {
    let riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Moderate';
    let primary = 'Early Blight';
    let secondary = 'Bacterial Spot';
    const factors: string[] = [];
    const prophylactics: string[] = [];

    // Offline epidemiological rule model
    if (humidity > 80 && rainfall === 'heavy') {
      factors.push(`Sustained high relative humidity (${humidity}%) promotes rapid spore germination.`);
      factors.push('Persistent rainwater splash transmits fungal conidia up from soil onto lower leaves.');

      if (temperature >= 15 && temperature <= 22) {
        riskLevel = 'Severe';
        primary = crop === 'potato' || crop === 'tomato' ? 'Late Blight (Phytophthora infestans)' : 'Downy Mildew';
        secondary = 'Early Blight';
        prophylactics.push('Apply protective copper octanoate before rain events.');
        prophylactics.push('Cease all overhead sprinkler irrigation immediately.');
        prophylactics.push('Scout lower canopy foliage early in the morning for white sporulation.');
      } else if (temperature >= 24 && temperature <= 30) {
        riskLevel = 'High';
        primary = crop === 'tomato' ? 'Early Blight & Bacterial Spot' : 'Anthracnose';
        secondary = 'Target Spot';
        prophylactics.push('Prune indeterminate sucker shoots to improve aeration.');
        prophylactics.push('Mulch soil around root base to block bacterial splashing.');
      }
    } else if (temperature > 28 && humidity < 50) {
      riskLevel = 'Moderate';
      primary = 'Spider Mites & Thermal Wilt';
      secondary = 'Powdery Mildew';
      factors.push('Hot, dry microclimates accelerate two-spotted spider mite reproduction.');
      prophylactics.push('Monitor leaf undersides with hand magnifier for fine webbing.');
      prophylactics.push('Avoid broad-spectrum insecticide sprays to protect predatory ladybugs.');
    } else {
      riskLevel = 'Low';
      primary = 'Nominal Pathogen Pressure';
      secondary = 'Leaf Mold';
      factors.push('Moderate temperatures and humidity are within safe agronomic parameters.');
      prophylactics.push('Maintain regular scouting and continue balanced fertigation.');
    }

    setPrediction({
      riskLevel,
      primaryThreat: primary,
      secondaryThreat: secondary,
      favorableFactors: factors,
      prophylacticMeasures: prophylactics,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-stone-900 md:text-2xl">{t.navRiskPred}</h2>
        <p className="text-xs text-stone-500">
          Offline epidemiological early disease forecasting using microclimate observations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Col: Environmental Input Form (6 cols) */}
        <div className="lg:col-span-6 space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Local Microclimate & Field Parameters
          </h3>

          {/* Crop Selector */}
          <div className="space-y-1 text-xs">
            <label className="font-bold text-stone-700">Target Crop Species:</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value as CropType)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 font-bold text-emerald-800 outline-none cursor-pointer"
            >
              {(Object.keys(CROPS_METADATA) as CropType[]).map((c) => (
                <option key={c} value={c}>
                  {CROPS_METADATA[c].name} ({CROPS_METADATA[c].family})
                </option>
              ))}
            </select>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between font-bold text-stone-700">
              <span className="flex items-center gap-1">
                <Thermometer className="h-4 w-4 text-amber-600" /> Ambient Temperature:
              </span>
              <span className="font-mono-numbers text-emerald-800">{temperature}°C</span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              value={temperature}
              onChange={(e) => setTemperature(parseInt(e.target.value))}
              className="h-1.5 w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>10°C (Cool)</span>
              <span>28°C (Optimal)</span>
              <span>45°C (Extreme Heat)</span>
            </div>
          </div>

          {/* Relative Humidity Slider */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between font-bold text-stone-700">
              <span className="flex items-center gap-1">
                <Droplets className="h-4 w-4 text-blue-600" /> Relative Humidity:
              </span>
              <span className="font-mono-numbers text-emerald-800">{humidity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={humidity}
              onChange={(e) => setHumidity(parseInt(e.target.value))}
              className="h-1.5 w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>20% (Arid)</span>
              <span>60% (Moderate)</span>
              <span>100% (Saturated / Fog)</span>
            </div>
          </div>

          {/* Rainfall / Moisture */}
          <div className="space-y-1 text-xs">
            <label className="font-bold text-stone-700 flex items-center gap-1">
              <CloudRain className="h-4 w-4 text-blue-500" /> Rainfall / Leaf Wetness:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'dry', label: 'Dry / No Rain' },
                { key: 'moderate', label: 'Light Shower' },
                { key: 'heavy', label: 'Heavy / Continuous' },
              ].map((rf) => (
                <button
                  key={rf.key}
                  onClick={() => setRainfall(rf.key as any)}
                  className={`rounded-xl border p-2 text-center font-medium transition-colors ${
                    rainfall === rf.key
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  {rf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Growth Stage */}
          <div className="space-y-1 text-xs">
            <label className="font-bold text-stone-700">Crop Growth Stage:</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { key: 'seedling', label: 'Seedling' },
                { key: 'vegetative', label: 'Vegetative' },
                { key: 'flowering', label: 'Flowering' },
                { key: 'fruiting', label: 'Fruiting' },
              ].map((st) => (
                <button
                  key={st.key}
                  onClick={() => setGrowthStage(st.key as any)}
                  className={`rounded-xl border p-2 text-center font-medium transition-colors ${
                    growthStage === st.key
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Predict Action */}
          <button
            onClick={handlePredict}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
          >
            <Sparkles className="h-4 w-4" />
            <span>Compute Epidemiological Disease Risk</span>
          </button>
        </div>

        {/* Right Col: Risk Forecast Report (6 cols) */}
        <div className="lg:col-span-6">
          {prediction ? (
            <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                    Epidemiological Early Risk Forecast
                  </span>
                  <h3 className="text-xl font-black text-stone-900">{prediction.primaryThreat}</h3>
                </div>

                <span
                  className={`rounded-xl px-3 py-1.5 text-xs font-black uppercase tracking-wider ${
                    prediction.riskLevel === 'Severe'
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : prediction.riskLevel === 'High'
                      ? 'bg-orange-100 text-orange-800 border border-orange-300'
                      : prediction.riskLevel === 'Moderate'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  {prediction.riskLevel} Risk
                </span>
              </div>

              {/* Favorable Environmental Drivers */}
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-xs">
                <span className="font-bold text-stone-800">Favorable Epidemiological Factors:</span>
                <ul className="mt-2 space-y-1.5 pl-5 list-disc text-stone-700">
                  {prediction.favorableFactors.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              {/* Secondary Threat */}
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs">
                <span className="font-semibold text-stone-500">Secondary Pathogen Pressure:</span>
                <p className="font-bold text-stone-800 mt-0.5">{prediction.secondaryThreat}</p>
              </div>

              {/* Prophylactic Field Measures */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs">
                <h4 className="font-bold text-emerald-950 mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-emerald-700" /> Prophylactic Prevention Steps
                </h4>
                <ul className="mt-2 space-y-1.5 pl-5 list-disc text-emerald-900">
                  {prediction.prophylacticMeasures.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>

              {/* Distinction notice */}
              <p className="text-[11px] text-stone-500 italic">
                Note: This risk assessment represents statistical probability based on microclimate rules. It does not replace visual camera scanning of actual plant foliage.
              </p>
            </div>
          ) : (
            <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-white p-6 text-center text-xs text-stone-400">
              <CloudSun className="h-10 w-10 text-stone-300" />
              <h4 className="mt-2 font-bold text-stone-700">Awaiting Microclimate Input</h4>
              <p className="mt-1 max-w-xs text-stone-500">
                Adjust temperature, humidity, rainfall, and crop parameters on the left to simulate epidemiological disease risks.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
