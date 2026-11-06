import React, { useEffect, useState } from 'react';
import {
  Calendar,
  FileText,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { CropType, FarmerNote } from '../../types';
import { localDB } from '../../services/db';
import { CROPS_METADATA } from '../../data/diseaseDatabase';
import { useLanguage } from '../../context/LanguageContext';

export const FarmerNotesView: React.FC = () => {
  const { t } = useLanguage();
  const [notes, setNotes] = useState<FarmerNote[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  // New Note Form
  const [title, setTitle] = useState('');
  const [crop, setCrop] = useState<CropType>('tomato');
  const [plotLocation, setPlotLocation] = useState('');
  const [content, setContent] = useState('');

  const loadNotes = async () => {
    const list = await localDB.getAllNotes();
    setNotes(list);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newNote: FarmerNote = {
      id: 'note_' + Date.now(),
      title: title.trim(),
      crop,
      plotLocation: plotLocation.trim() || 'General Field',
      date: new Date().toISOString().split('T')[0],
      content: content.trim(),
      createdAt: Date.now(),
    };

    await localDB.saveNote(newNote);
    setTitle('');
    setPlotLocation('');
    setContent('');
    setIsAdding(false);
    loadNotes();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this field note?')) {
      await localDB.deleteNote(id);
      loadNotes();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 md:text-2xl">{t.navNotes}</h2>
          <p className="text-xs text-stone-500">
            Offline farmer observations diary, plot logs, and treatment records.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          <span>{isAdding ? 'Close Form' : 'Add Field Note'}</span>
        </button>
      </div>

      {/* Add Note Form */}
      {isAdding && (
        <form
          onSubmit={handleSave}
          className="space-y-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs text-xs"
        >
          <h3 className="font-bold text-stone-900 text-sm">Create New Field Note</h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="font-semibold text-stone-600">Note Title:</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Copper spray applied after downpour"
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
              <label className="font-semibold text-stone-600">Plot / Bed Location:</label>
              <input
                type="text"
                value={plotLocation}
                onChange={(e) => setPlotLocation(e.target.value)}
                placeholder="e.g. Sector 3, Ridge 12"
                className="w-full rounded-xl border border-stone-200 p-2 text-stone-800 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-stone-600">Observation Details & Agronomic Notes:</label>
            <textarea
              required
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Record visible symptoms, weather events, fertilizer doses, or biological predator sightings..."
              className="w-full rounded-xl border border-stone-200 p-2 text-stone-800 outline-none focus:border-emerald-500"
            />
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
              Save Note Locally
            </button>
          </div>
        </form>
      )}

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-white p-8 text-center text-stone-400">
          <FileText className="h-10 w-10 text-stone-300" />
          <h3 className="mt-2 text-sm font-bold text-stone-700">No Field Notes Saved</h3>
          <p className="mt-1 text-xs text-stone-500">Record your first observation or treatment action.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((n) => (
            <div
              key={n.id}
              className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-xs text-xs space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-800 capitalize bg-emerald-50 px-2 py-0.5 rounded">
                    {n.crop}
                  </span>
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="text-stone-400 hover:text-red-600"
                    aria-label="Delete note"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <h4 className="mt-2 text-sm font-bold text-stone-900">{n.title}</h4>
                <p className="mt-1.5 leading-relaxed text-stone-600 whitespace-pre-wrap">{n.content}</p>
              </div>

              <div className="flex items-center justify-between border-t border-stone-100 pt-2 text-[11px] text-stone-400">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {n.plotLocation}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {n.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
