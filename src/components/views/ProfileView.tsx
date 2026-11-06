import React, { useState } from 'react';
import {
  CheckCircle2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { CropType, Language } from '../../types';
import { CROPS_METADATA } from '../../data/diseaseDatabase';

export const ProfileView: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  const [fullName, setFullName] = useState(currentUser?.fullName || 'Ramesh Patel');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [stateName, setStateName] = useState(currentUser?.state || 'Karnataka');
  const [district, setDistrict] = useState(currentUser?.district || 'Mandya');
  const [mainCrop, setMainCrop] = useState<CropType>(currentUser?.mainCrop || 'tomato');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      fullName,
      phone,
      state: stateName,
      district,
      mainCrop,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-stone-900 md:text-2xl">{t.navProfile}</h2>
        <p className="text-xs text-stone-500">
          Local farmer identity stored securely on device with no cloud transmission.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-xs text-xs">
        <div className="flex items-center gap-4 border-b border-stone-100 pb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-2xl font-bold text-white shadow-xs">
            {fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">{fullName}</h3>
            <p className="text-stone-500">{currentUser?.email || 'offline.farmer@agriscan.local'}</p>
            <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" /> Authenticated Offline Session
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="font-bold text-stone-700">Full Name:</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-stone-200 p-2 pl-9 text-stone-800 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">Phone Number:</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-stone-200 p-2 pl-9 text-stone-800 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">State / Region:</label>
            <input
              type="text"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              className="w-full rounded-xl border border-stone-200 p-2 text-stone-800 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">District / Village:</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full rounded-xl border border-stone-200 p-2 text-stone-800 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">Main Crop Cultivated:</label>
            <select
              value={mainCrop}
              onChange={(e) => setMainCrop(e.target.value as CropType)}
              className="w-full rounded-xl border border-stone-200 p-2 font-bold text-emerald-800 outline-none"
            >
              {(Object.keys(CROPS_METADATA) as CropType[]).map((c) => (
                <option key={c} value={c}>
                  {CROPS_METADATA[c].name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">Interface Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="w-full rounded-xl border border-stone-200 p-2 font-bold text-stone-800 outline-none"
            >
              <option value="en">English (EN)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="ml">മലയാളം (Malayalam)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-stone-100 pt-4">
          {isSaved ? (
            <span className="flex items-center gap-1.5 font-bold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> Profile Updated Successfully
            </span>
          ) : (
            <span className="text-[11px] text-stone-400">Stored in offline browser IndexedDB</span>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 font-bold text-white shadow-xs hover:bg-emerald-700"
          >
            <Save className="h-4 w-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
