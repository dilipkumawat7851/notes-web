import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Star, Sparkles, MoreVertical, Archive, Trash2, Loader2, Bell, Download } from 'lucide-react';
import NoteEditor from '../components/notes/NoteEditor';
import NoteToolbar from '../components/notes/NoteToolbar';
import AttachmentSection from '../components/notes/AttachmentSection';
import { useNotes } from '../context/NotesContext';
import { useToast } from '../context/ToastContext';
import { useDebounce } from '../hooks/useDebounce';

export default function NoteEditorPage() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { fetchNote, createNote, updateNote, toggleFavorite, archiveNote, deleteNote, currentNote, setCurrentNote, folders } = useNotes();
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [noteColor, setNoteColor] = useState('default');
  const [reminderAt, setReminderAt] = useState('');
  const [editorInstance, setEditorInstance] = useState(null);

  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'saving', 'saved'
  const [lastSaved, setLastSaved] = useState(null);
  const [noteIdState, setNoteIdState] = useState(noteId || null);
  const [isLoaded, setIsLoaded] = useState(!noteId);

  const [newTagInput, setNewTagInput] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const debouncedTitle = useDebounce(title, 1000);
  const debouncedContent = useDebounce(content, 1000);

  // Load existing note
  useEffect(() => {
    if (noteId) {
      fetchNote(noteId).then((note) => {
        if (note) {
          setTitle(note.title || '');
          setContent(note.content || '');
          setTags(note.tags || []);
          setIsFavorite(note.isFavorite || false);
          setNoteColor(note.color || 'default');
          setReminderAt(note.reminderAt || '');
          setIsLoaded(true);
        }
      });
    }
    return () => setCurrentNote(null);
  }, [noteId]);

  // Auto-save
  useEffect(() => {
    if (!isLoaded) return;
    if (saveStatus === 'idle' && !debouncedTitle && !debouncedContent && !reminderAt) return;

    const save = async () => {
      setSaveStatus('saving');
      try {
        if (noteIdState) {
          await updateNote(noteIdState, { title: debouncedTitle, content: debouncedContent, tags, isFavorite, color: noteColor, reminderAt });
        } else if (debouncedTitle || debouncedContent) {
          const newNote = await createNote({ title: debouncedTitle, content: debouncedContent, tags, isFavorite, color: noteColor, reminderAt });
          setNoteIdState(newNote.id);
          window.history.replaceState(null, '', `/notes/${newNote.id}`);
        }
        setSaveStatus('saved');
        setLastSaved(new Date());
      } catch {
        toast.error('Failed to save note');
        setSaveStatus('idle');
      }
    };

    save();
  }, [debouncedTitle, debouncedContent]);

  const handleContentChange = useCallback((newContent) => {
    setContent(newContent);
    if (saveStatus === 'saved' || saveStatus === 'idle') {
      setSaveStatus('idle');
    }
  }, [saveStatus]);

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      e.preventDefault();
      const tag = newTagInput.trim();
      if (!tags.includes(tag)) {
        const newTags = [...tags, tag];
        setTags(newTags);
        if (noteIdState) {
          updateNote(noteIdState, { tags: newTags });
        }
      }
      setNewTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter(t => t !== tagToRemove);
    setTags(newTags);
    if (noteIdState) {
      updateNote(noteIdState, { tags: newTags });
    }
  };

  const handleToggleFavorite = async () => {
    setIsFavorite(!isFavorite);
    if (noteIdState) {
      await toggleFavorite(noteIdState);
    }
  };

  const handleArchive = async () => {
    if (noteIdState) {
      await archiveNote(noteIdState);
      toast.success('Note archived');
      navigate('/');
    }
  };

  const handleDelete = async () => {
    if (noteIdState) {
      await deleteNote(noteIdState);
      toast.success('Note moved to trash');
    }
    navigate('/');
  };

  const getSaveStatusText = () => {
    if (saveStatus === 'saving') {
      return (
        <span className="flex items-center gap-1 text-slate-500">
          <Loader2 className="w-3 h-3 animate-spin" /> Saving...
        </span>
      );
    }
    if (saveStatus === 'saved' && lastSaved) {
      return (
        <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
          <Check className="w-4 h-4" /> Saved
        </span>
      );
    }
    return null;
  };

  const colors = [
    { name: 'default', class: 'bg-slate-300' },
    { name: 'blue', class: 'bg-blue-500' },
    { name: 'green', class: 'bg-green-500' },
    { name: 'yellow', class: 'bg-yellow-500' },
    { name: 'purple', class: 'bg-purple-500' },
    { name: 'red', class: 'bg-red-500' },
    { name: 'orange', class: 'bg-orange-500' },
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#111111] text-slate-200">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 border-b border-[#2D2D2D]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </button>
          <div className="text-sm">{getSaveStatusText()}</div>
        </div>

        <div className="flex items-center gap-1">
          {/* Reminder */}
          <div className="relative">
            <button
              onClick={() => setShowReminderPicker(!showReminderPicker)}
              className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors flex items-center gap-1"
              title="Set Reminder"
            >
              <Bell className={`w-5 h-5 ${reminderAt ? 'fill-blue-500 text-blue-500' : 'text-slate-400'}`} />
            </button>
            {showReminderPicker && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowReminderPicker(false)} />
                <div className="absolute right-0 mt-2 bg-[#1A1A1A] rounded-lg shadow-lg border border-[#2D2D2D] p-4 flex flex-col gap-2 z-50 w-48">
                  <span className="text-xs font-medium text-slate-400">Set Reminder</span>
                  <input 
                    type="datetime-local" 
                    value={reminderAt}
                    onChange={(e) => {
                      setReminderAt(e.target.value);
                      if (noteIdState) updateNote(noteIdState, { reminderAt: e.target.value });
                    }}
                    className="text-sm bg-[#111111] border border-[#2D2D2D] text-slate-200 rounded p-1.5 focus:outline-none focus:border-blue-500"
                  />
                  {reminderAt && (
                    <button 
                      onClick={() => { setReminderAt(''); setShowReminderPicker(false); if(noteIdState) updateNote(noteIdState, { reminderAt: '' }); }}
                      className="text-xs text-red-400 hover:text-red-300 mt-2 text-left"
                    >
                      Clear Reminder
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Favorite */}
          <button
            onClick={handleToggleFavorite}
            className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star className={`w-5 h-5 ${isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-slate-400'}`} />
          </button>

          {/* Color Picker */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className={`w-5 h-5 rounded-full border border-[#2D2D2D] mx-2 ${colors.find(c => c.name === noteColor)?.class || 'bg-slate-300'}`}
              aria-label="Note color"
            />
            {showColorPicker && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowColorPicker(false)} />
                <div className="absolute right-0 mt-2 bg-[#1A1A1A] rounded-lg shadow-lg border border-[#2D2D2D] p-2 flex gap-1 z-50">
                  {colors.map(c => (
                    <button
                      key={c.name}
                      onClick={() => { setNoteColor(c.name); setShowColorPicker(false); if (noteIdState) updateNote(noteIdState, { color: c.name }); }}
                      className={`w-6 h-6 rounded-full ${c.class} ${noteColor === c.name ? 'ring-2 ring-offset-2 ring-blue-500' : ''} transition-all`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* AI Actions */}
          <div className="relative group">
            <button className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors">
              <Sparkles className="w-5 h-5 text-blue-500" />
            </button>
            <div className="absolute right-0 mt-1 w-44 bg-[#1A1A1A] rounded-lg shadow-lg border border-[#2D2D2D] hidden group-hover:block z-10">
              <div className="py-1">
                <button className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-[#222222]">✨ Summarize</button>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-[#222222]">✨ Improve Writing</button>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-[#222222]">✨ Explain</button>
              </div>
            </div>
          </div>

          {/* More Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-slate-300" />
            </button>
            {showMoreMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
                <div className="absolute right-0 mt-2 w-44 bg-[#1A1A1A] rounded-lg shadow-lg border border-[#2D2D2D] z-50">
                  <div className="py-1">
                    <button 
                      onClick={() => { setShowMoreMenu(false); window.print(); }} 
                      className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-[#222222] flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Export as PDF
                    </button>
                    <div className="h-px bg-[#2D2D2D] my-1" />
                    <button 
                      onClick={() => { setShowMoreMenu(false); handleArchive(); }} 
                      className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-[#222222] flex items-center gap-2"
                    >
                      <Archive className="w-4 h-4" /> Archive
                    </button>
                    <button 
                      onClick={() => { setShowMoreMenu(false); handleDelete(); }} 
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Editor Body */}
      <div className="flex-1 px-4 sm:px-6 md:px-8 py-6 max-w-4xl mx-auto w-full">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Note"
          autoFocus={!noteId}
          className="text-2xl md:text-3xl font-bold bg-transparent border-none outline-none mb-6 w-full placeholder-slate-600 text-white"
        />

        {/* Toolbar + Editor */}
        <div className="border border-[#2D2D2D] print:border-none rounded-xl overflow-hidden mb-8">
          <div className="print:hidden">
            {editorInstance && <NoteToolbar editor={editorInstance} />}
          </div>
          <div className="min-h-[400px]">
            <NoteEditor
              content={content}
              onUpdate={handleContentChange}
              onEditorReady={setEditorInstance}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="mb-8 print:hidden">
          <h3 className="text-sm font-medium mb-3 text-slate-400">Tags</h3>
          <div className="flex flex-wrap gap-2 items-center">
            {tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 bg-[#1A1A1A] border border-[#2D2D2D] text-slate-300 px-3 py-1 rounded-full text-sm">
                {tag}
                <button onClick={() => removeTag(tag)} className="hover:text-white ml-1" aria-label={`Remove tag ${tag}`}>
                  &times;
                </button>
              </span>
            ))}
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="+ Add Tag"
              className="text-sm bg-transparent border-none outline-none placeholder-slate-500 text-slate-200 w-24 py-1"
            />
          </div>
        </div>

        {/* Attachments */}
        <div className="print:hidden">
          <h3 className="text-sm font-medium mb-3 text-slate-500 dark:text-slate-400">Attachments</h3>
          <AttachmentSection
            attachments={attachments}
            onAdd={(newFiles) => setAttachments([...attachments, ...newFiles])}
            onRemove={(index) => setAttachments(attachments.filter((_, i) => i !== index))}
          />
        </div>
      </div>
    </div>
  );
}
