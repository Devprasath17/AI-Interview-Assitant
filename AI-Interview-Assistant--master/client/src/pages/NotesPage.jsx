import React, { useState, useEffect } from 'react';
import API from '../services/api';

export const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await API.get('/notes');
      if (res.data && res.data.notes) {
        setNotes(res.data.notes);
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    if (!editContent.trim()) return;
    try {
      const res = await API.put(`/notes/${id}`, { content: editContent });
      if (res.data) {
        setNotes((prev) =>
          prev.map((n) => (n._id === id ? { ...n, content: editContent } : n))
        );
        setEditingNoteId(null);
      }
    } catch (err) {
      console.error('Update note error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error('Delete note error:', err);
    }
  };

  return (
    <div className="w-full space-y-lg">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-md">
        <div>
          <h2 className="text-headline-lg font-headline-lg font-bold text-on-surface tracking-tight">
            Personal Study Notes
          </h2>
          <p className="text-body-md font-body-md text-on-surface-variant mt-xs max-w-2xl">
            Custom reminders, architectural principles, and key takeaways you've written while preparing.
          </p>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-md">
          <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="text-on-surface-variant text-sm font-medium">Loading your personal notes...</p>
        </div>
      ) : notes.length === 0 ? (
        <div className="bg-surface-container-lowest p-xl rounded-2xl border border-outline-variant/30 text-center py-20 space-y-md">
          <div className="w-16 h-16 rounded-full bg-secondary/10 text-secondary mx-auto flex items-center justify-center">
            <span className="material-symbols-outlined text-[32px]">edit_note</span>
          </div>
          <h3 className="text-headline-md font-bold text-on-surface">No Study Notes Yet</h3>
          <p className="text-body-md text-on-surface-variant max-w-md mx-auto">
            You can add custom notes on any interview question during your practice sessions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {notes.map((n) => (
            <div
              key={n._id}
              className="bg-surface-container-lowest rounded-xl p-lg shadow-card border border-outline-variant/30 space-y-md flex flex-col justify-between"
            >
              <div className="space-y-sm">
                {n.questionId && (
                  <div className="p-sm rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs">
                    <span className="font-semibold text-primary block mb-1">Associated Question:</span>
                    <p className="text-on-surface font-medium line-clamp-2">{n.questionId.question}</p>
                  </div>
                )}

                {editingNoteId === n._id ? (
                  <div className="space-y-sm">
                    <textarea
                      rows={4}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-sm rounded-lg border border-outline-variant bg-surface text-sm text-on-surface"
                    />
                    <div className="flex justify-end gap-xs">
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="px-md py-1 text-xs border rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdate(n._id)}
                        className="px-md py-1 text-xs bg-primary text-white rounded-md font-bold"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-on-surface whitespace-pre-wrap leading-relaxed font-normal">
                    {n.content}
                  </p>
                )}
              </div>

              <div className="border-t border-outline-variant/20 pt-sm flex items-center justify-between text-xs text-on-surface-variant">
                <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                <div className="flex items-center gap-xs">
                  <button
                    onClick={() => {
                      setEditingNoteId(n._id);
                      setEditContent(n.content);
                    }}
                    className="p-1 hover:text-primary transition-colors"
                    title="Edit Note"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(n._id)}
                    className="p-1 hover:text-error transition-colors"
                    title="Delete Note"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
