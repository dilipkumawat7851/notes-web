import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';

export default function NoteEditor({ content, onUpdate, onEditorReady }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image,
      Placeholder.configure({
        placeholder: 'Start writing your note...',
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap prose dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4 sm:p-6',
      },
    },
  });

  // Expose editor instance to parent
  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  // Sync external content changes (only when content is set from outside, e.g. on load)
  useEffect(() => {
    if (editor && content && !editor.isFocused) {
      const currentContent = editor.getHTML();
      if (content !== currentContent) {
        editor.commands.setContent(content, false);
      }
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="min-h-[400px] p-6 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <EditorContent editor={editor} />;
}
