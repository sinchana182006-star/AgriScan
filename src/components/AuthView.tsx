import React, { useState } from 'react';
import {
  AlertCircle,
  Eye,
  EyeOff,
  HelpCircle,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Sprout,
  User,
  WifiOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CropType, Language } from '../types';
import { CROPS_METADATA } from '../data/diseaseDatabase';

interface AuthViewProps {
  initialMode?: 'login' | 'register';
  onSuccess: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode = 'login', onSuccess }) => {
  const { login, register, loginAsDemo } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showRecoveryHint, setShowRecoveryHint] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [stateName, setStateName] = useState('Karnataka');
  const [district, setDistrict] = useState('Mandya');
  const [preferredLang, setPreferredLang] = useState<Language>(language);
  const [mainCrop, setMainCrop] = useState<CropType>('tomato');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const res = await login(email, password, rememberMe);
    setIsSubmitting(false);

    if (res.success) {
      onSuccess();
    } else {
      setErrorMsg(res.error || 'Login failed.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (regPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Password should be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    const res = await register({
      fullName,
      email: regEmail,
      phone,
      password: regPassword,
      state: stateName,
      district,
      preferredLanguage: preferredLang,
      mainCrop,
    });
    setIsSubmitting(false);

    if (res.success) {
      setLanguage(preferredLang);
      onSuccess();
    } else {
      setErrorMsg(res.error || 'Registration failed.');
    }
  };

  const handleDemoLogin = async () => {
    await loginAsDemo();
    onSuccess();
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-stone-900 p-4 sm:p-6 overflow-hidden">
      {/* Agricultural background backdrop with measured scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_agriscan_farmer_1793904223845.jpg"
          alt="Agricultural background"
          className="h-full w-full object-cover opacity-25 filter blur-xs"
        />
        <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-stone-950/80 to-emerald-950/70" />
      </div>

      {/* Main Auth Card */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-emerald-900/40 bg-white/95 p-6 backdrop-blur-md shadow-2xl sm:p-8">
        {/* Brand header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg">
            <Sprout className="h-8 w-8" />
          </div>

          <h1 className="mt-3 text-2xl font-black tracking-tight text-stone-900">AgriScan</h1>
          <p className="text-xs font-semibold text-emerald-800">
            Offline Crop Disease & Pest Intelligence System
          </p>

          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
            <WifiOff className="h-3 w-3" />
            <span>100% Offline Local Authentication</span>
          </div>
        </div>

        {/* Error message banner */}
        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-stone-700">Email Address or Username:</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@agriscan.local"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2 pl-9 pr-3 text-stone-800 outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="font-bold text-stone-700">Password:</label>
                <button
                  type="button"
                  onClick={() => setShowRecoveryHint(!showRecoveryHint)}
                  className="text-[11px] text-emerald-700 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2 pl-9 pr-10 text-stone-800 outline-none focus:border-emerald-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Offline password recovery dialog */}
            {showRecoveryHint && (
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-[11px] text-stone-600">
                <p className="font-bold text-stone-800 flex items-center gap-1">
                  <HelpCircle className="h-3.5 w-3.5 text-emerald-600" /> Offline Password Recovery:
                </p>
                <p className="mt-1 leading-snug">
                  Because AgriScan runs 100% offline without external email servers, passwords are stored securely as SHA-256 hashes in your local browser storage. If you forgot your password, you can register a new local profile or use the instant One-Click Demo Farmer account below.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px]">
              <label className="flex items-center gap-2 cursor-pointer text-stone-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Remember me on this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{isSubmitting ? 'Authenticating Locally...' : 'Sign In Offline'}</span>
            </button>

            {/* 1-Click Demo Login */}
            <div className="relative flex py-1 items-center">
              <div className="grow border-t border-stone-200"></div>
              <span className="shrink mx-2 text-[10px] text-stone-400 uppercase font-semibold">
                Quick Evaluator Access
              </span>
              <div className="grow border-t border-stone-200"></div>
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50/60 py-2.5 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition-colors"
            >
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>Instant 1-Click Demo Farmer Login</span>
            </button>

            <div className="text-center pt-2 text-[11px] text-stone-500">
              Don't have an offline profile?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                }}
                className="font-bold text-emerald-700 hover:underline"
              >
                Register New Farmer Account
              </button>
            </div>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="mt-5 space-y-3 text-xs">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="font-bold text-stone-700">Full Name:</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full rounded-xl border border-stone-200 p-2 text-stone-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Phone Number:</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-stone-200 p-2 text-stone-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-stone-700">Email Address (Login ID):</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="ramesh.farmer@agriscan.local"
                  className="w-full rounded-xl border border-stone-200 p-2 text-stone-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Password:</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-stone-200 p-2 text-stone-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Confirm Password:</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-stone-200 p-2 text-stone-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">State / Region:</label>
                <input
                  type="text"
                  required
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 p-2 text-stone-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">District / Taluk:</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 p-2 text-stone-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Preferred Language:</label>
                <select
                  value={preferredLang}
                  onChange={(e) => setPreferredLang(e.target.value as Language)}
                  className="w-full rounded-xl border border-stone-200 p-2 font-bold text-stone-800 outline-none"
                >
                  <option value="en">English (EN)</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="ml">മലയാളം (Malayalam)</option>
                </select>
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
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors"
            >
              <User className="h-4 w-4" />
              <span>{isSubmitting ? 'Registering Locally...' : 'Register Local Account'}</span>
            </button>

            <div className="text-center pt-2 text-[11px] text-stone-500">
              Already have an offline account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                }}
                className="font-bold text-emerald-700 hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
