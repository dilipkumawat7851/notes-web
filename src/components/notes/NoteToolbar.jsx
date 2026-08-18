import React from 'react';
import { 
  Undo2, Redo2, Heading1, Heading2, Heading3, 
  Bold, Italic, Underline, Strikethrough, 
  List, ListOrdered, Quote, Code, Link, ImageIcon 
} from 'lucide-react';

export default function NoteToolbar({ editor }) {
  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ onClick, isActive, icon: Icon, title }) => (
    <button
      onClick={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`p-2 rounded-md transition-colors ${
        isActive 
          ? 'bg-[#222222] text-white' 
          : 'text-slate-400 hover:bg-[#222222] hover:text-slate-200'
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  const Separator = () => <div className="w-px h-6 bg-[#2D2D2D] mx-1" />;

  return (
    <div className="sticky top-0 z-10 flex items-center gap-1 p-2 bg-[#1A1A1A] border-b border-[#2D2D2D] rounded-t-xl overflow-x-auto whitespace-nowrap">
      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} isActive={false} icon={Undo2} title="Undo" />
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} isActive={false} icon={Redo2} title="Redo" />
      
      <Separator />
      
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} icon={Heading1} title="Heading 1" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} icon={Heading2} title="Heading 2" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} icon={Heading3} title="Heading 3" />
      
      <Separator />
      
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} title="Bold" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} title="Italic" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={Underline} title="Underline" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} icon={Strikethrough} title="Strikethrough" />
      
      <Separator />
      
      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={List} title="Bullet List" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={ListOrdered} title="Numbered List" />
      
      <Separator />
      
      <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={Quote} title="Blockquote" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} icon={Code} title="Code Block" />
      
      <Separator />
      
      <ToolbarButton 
        onClick={() => {
          const url = window.prompt('Enter link URL:');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }} 
        isActive={editor.isActive('link')} 
        icon={Link} 
        title="Link" 
      />
      <ToolbarButton 
        onClick={() => {
          const url = window.prompt('Enter image URL:');
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }} 
        isActive={editor.isActive('image')} 
        icon={ImageIcon} 
        title="Image" 
      />
    </div>
  );
}
