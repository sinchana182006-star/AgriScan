import React, { useEffect, useState } from 'react';
import {
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import { CropType, FarmerReminder } from '../../types';
import { localDB } from '../../services/db';
import { CROPS_METADATA } from '../../data/diseaseDatabase';
import { useLanguage } from '../../context/LanguageContext';

export const RemindersView: React.FC = () => {
  const { t } = useLanguage();
  const [reminders, setReminders] = useState<FarmerReminder[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [crop, setCrop] = useState<CropType>('tomato');
  const [dueDate, setDueDate] = useState('');
  const [type, setType] = useState<'inspection' | 'spray' | 'fertilizer' | 'harvest'>('inspection');
  const [severity, setSeverity] = useState<'normal' | 'urgent'>('normal');

  const loadReminders = async () => {
    const list = await localDB.getAllReminders();
    setReminders(list);
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const handleToggle = async (id: string) => {
    await localDB.toggleReminder(id);
    loadReminders();
  };

  const handleDelete = async (id: string) => {
    await localDB.deleteReminder(id);
    loadReminders();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    const newReminder: FarmerReminder = {
      id: 'rem_' + Date.now(),
      title: title.trim(),
      crop,
      dueDate,
      type,
      completed: false,
      severity,
    };

    await localDB.saveReminder(newReminder);
    setTitle('');
    setDueDate('');
    setIsAdding(false);
    loadReminders();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 md:text-2xl">{t.navReminders}</h2>
          <p className="text-xs text-stone-500">
            Local offline crop inspection schedules and treatment follow-up alerts.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          <span>{isAdding ? 'Close Form' : 'New Reminder'}</span>
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form
          onSubmit={handleSave}
          className="space-y-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs text-xs"
        >
          <h3 className="font-bold text-stone-900 text-sm">Schedule Field Reminder</h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <label className="font-semibold text-stone-600">Reminder Task:</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Inspect tomato underside for whitefly"
                className="w-full rounded-xl border border-stone-200 p-2 text-stone-800 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-600">Crop:</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value as CropType)}
                className="w-full rounded-xl border border-stone-200 p-2 font-semibold text-stone-800 outline-none"
              >
                {(Object.keys(CROPS_METADATA) as CropType[]).map((c) => (
                  <option key={c} value={c}>
                    {CROPS_METADATA[c].name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-600">Due Date:</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl border border-stone-200 p-2 text-stone-800 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-600">Category:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full rounded-xl border border-stone-200 p-2 font-semibold text-stone-800 outline-none"
              >
                <option value="inspection">Foliar Inspection</option>
                <option value="spray">Organic Spray</option>
                <option value="fertilizer">Fertilizer Drench</option>
                <option value="harvest">Harvest Check</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="rounded-xl border border-stone-200 px-4 py-2 font-medium text-stone-600 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-5 py-2 font-bold text-white shadow-xs hover:bg-emerald-700"
            >
              Add Reminder
            </button>
          </div>
        </form>
      )}

      {/* Reminders List */}
      <div className="space-y-3">
        {reminders.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-white p-8 text-center text-stone-400">
            <Bell className="h-10 w-10 text-stone-300" />
            <h3 className="mt-2 text-sm font-bold text-stone-700">No Reminders Scheduled</h3>
            <p className="mt-1 text-xs text-stone-500">Create an inspection reminder to stay ahead of outbreaks.</p>
          </div>
        ) : (
          reminders.map((r) => (
            <div
              key={r.id}
              onClick={() => handleToggle(r.id)}
              className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all shadow-xs ${
                r.completed
                  ? 'border-stone-200 bg-stone-50/70 opacity-60'
                  : 'border-stone-200 bg-white hover:border-emerald-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={r.completed}
                  onChange={() => {}}
                  className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <div>
                  <h4
                    className={`text-xs font-bold text-stone-900 ${
                      r.completed ? 'line-through text-stone-400' : ''
                    }`}
                  >
                    {r.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500">
                    <span className="capitalize font-semibold text-emerald-800">{r.crop}</span>
                    <span>·</span>
                    <span className="capitalize">{r.type}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Due: {r.dueDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {r.severity === 'urgent' && (
                  <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800">
                    URGENT
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(r.id);
                  }}
                  className="rounded-lg p-1.5 text-stone-400 hover:text-red-600"
                  aria-label="Delete reminder"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
