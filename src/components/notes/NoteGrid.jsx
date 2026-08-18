import React from 'react';
import { NoteCard } from './NoteCard';

export const NoteGrid = ({ notes = [] }) => {
  if (!notes || notes.length === 0) {
    return null; // Handled by parent's empty state
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {notes.map(note => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
};
