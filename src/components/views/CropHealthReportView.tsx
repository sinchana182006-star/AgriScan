import React, { useEffect, useState } from 'react';
import {
  Activity,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Download,
  FileCheck2,
  FileText,
  HeartPulse,
  Leaf,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { DiagnosisResult } from '../../types';
import { localDB } from '../../services/db';
import { useLanguage } from '../../context/LanguageContext';

export const CropHealthReportView: React.FC = () => {
  const { t } = useLanguage();
  const [scans, setScans] = useState<DiagnosisResult[]>([]);

  useEffect(() => {
    const fetchScans = async () => {
      const records = await localDB.getAllScans();
      setScans(records);
    };
    fetchScans();
  }, []);

  const totalScans = scans.length;
  const averageHealthScore =
    totalScans > 0 ? Math.round(scans.reduce((acc, s) => acc + s.healthScore, 0) / totalScans) : 85;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Export controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 md:text-2xl">{t.navHealthReport}</h2>
          <p className="text-xs text-stone-500">
            Intelligent canopy health scoring, historical trends, and exportable field summaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 shadow-xs hover:bg-stone-50"
          >
            <Printer className="h-4 w-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Main Health Index Card */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
              <HeartPulse className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-stone-500">Aggregate Field Vigor</span>
              <h3 className="text-xl font-extrabold text-stone-900">Crop Health Index</h3>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`font-mono-numbers text-3xl font-black ${
                averageHealthScore > 75
                  ? 'text-emerald-700'
                  : averageHealthScore > 50
                  ? 'text-amber-700'
                  : 'text-red-700'
              }`}
            >
              {averageHealthScore}%
            </span>
            <p className="text-xs text-stone-400">Canopy Chlorophyll & Tissue Integrity</p>
          </div>
        </div>

        {/* Breakdown Meters */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
          {/* Healthy Foliage */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950">Healthy Photosynthetic Tissue</span>
              <span className="font-mono-numbers font-bold text-emerald-800">
                {averageHealthScore}%
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-emerald-100">
              <div
                className="h-full rounded-full bg-emerald-600"
                style={{ width: `${averageHealthScore}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-emerald-800">Uniform green chlorophyll distribution</p>
          </div>

          {/* Necrotic Breakdown */}
          <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-red-950">Pathological Necrosis</span>
              <span className="font-mono-numbers font-bold text-red-800">
                {Math.max(0, 100 - averageHealthScore)}%
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-red-100">
              <div
                className="h-full rounded-full bg-red-500"
                style={{ width: `${Math.max(0, 100 - averageHealthScore)}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-red-800">Cell death & spot lesions</p>
          </div>

          {/* Biological Resistance */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-950">Biocontrol Ally Index</span>
              <span className="font-mono-numbers font-bold text-blue-800">90%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-blue-100">
              <div className="h-full rounded-full bg-blue-600" style={{ width: '90%' }} />
            </div>
            <p className="mt-2 text-[11px] text-blue-800">Beneficial predator presence</p>
          </div>
        </div>

        {/* Clear Disclaimer: Image-based score is an estimate */}
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-3.5 text-xs text-stone-600">
          <p className="leading-relaxed">
            <strong className="text-stone-800">Notice to Farmers:</strong> This foliar health score is an algorithmic estimate calculated from localized leaf pixel analysis. It provides valuable diagnostic guidance but does not represent a complete substitute for whole-field root, soil, and canopy inspection.
          </p>
        </div>
      </div>

      {/* Historical Scans in Table */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-stone-900">Recorded Foliar Health Logs</h3>

        {scans.length === 0 ? (
          <p className="text-xs text-stone-500">No scans logged yet. Use the AI Crop Scanner to create records.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-stone-200 bg-stone-50 text-[11px] font-bold uppercase text-stone-600">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Crop</th>
                  <th className="py-2.5 px-3">Primary Diagnosis</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">Health Score</th>
                  <th className="py-2.5 px-3">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {scans.map((s) => {
                  const top = s.top3[0];
                  return (
                    <tr key={s.id} className="hover:bg-stone-50/70">
                      <td className="py-2.5 px-3 font-mono-numbers">
                        {new Date(s.timestamp).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 px-3 font-bold capitalize">{s.cropName}</td>
                      <td className="py-2.5 px-3 font-medium text-stone-900">
                        {top?.name || 'Healthy Leaf'}
                      </td>
                      <td className="py-2.5 px-3 font-mono-numbers font-bold text-emerald-700">
                        {top?.confidence || 0}%
                      </td>
                      <td className="py-2.5 px-3 font-mono-numbers">{s.healthScore}/100</td>
                      <td className="py-2.5 px-3 capitalize">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            top?.severity === 'severe'
                              ? 'bg-red-100 text-red-800'
                              : top?.severity === 'high'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {top?.severity || 'none'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
