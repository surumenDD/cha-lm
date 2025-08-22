"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import CharacterCount from '@tiptap/extension-character-count';
import { useEffect, useMemo, useRef, useState } from 'react';

export type RichEditorValue = { title: string; content: string };

type Props = {
  value: RichEditorValue;
  onChange: (v: RichEditorValue) => void;
};

export default function RichEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit, Underline, CharacterCount.configure({ limit: 100000 })],
    content: value.content || '<p></p>',
    onUpdate({ editor }) {
      scheduleSave({ title: cachedTitle.current, content: editor.getHTML() });
    }
  }, [value.content]);

  const [saving, setSaving] = useState(false);
  const timer = useRef<number | null>(null);
  const cachedTitle = useRef(value.title);
  useEffect(()=>{ cachedTitle.current = value.title; }, [value.title]);

  function scheduleSave(next: RichEditorValue) {
    setSaving(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(()=>{
      onChange(next);
      setSaving(false);
    }, 800);
  }

  const count = editor?.storage.characterCount?.characters() || 0;

  return (
    <div className="relative h-full flex flex-col">
      <div className="h-10 border-b px-2 flex items-center gap-1 text-sm">
        <button className="px-2 py-1 border rounded" onClick={() => editor?.chain().focus().toggleBold().run()}>B</button>
        <button className="px-2 py-1 border rounded" onClick={() => editor?.chain().focus().toggleItalic().run()}>I</button>
        <button className="px-2 py-1 border rounded" onClick={() => editor?.chain().focus().toggleUnderline().run()}>U</button>
        <button className="px-2 py-1 border rounded" onClick={() => editor?.chain().focus().toggleBulletList().run()}>•</button>
        <button className="px-2 py-1 border rounded" onClick={() => editor?.chain().focus().toggleOrderedList().run()}>1.</button>
        <button className="px-2 py-1 border rounded" onClick={() => editor?.chain().focus().undo().run()}>↶</button>
        <button className="px-2 py-1 border rounded" onClick={() => editor?.chain().focus().redo().run()}>↷</button>
        <div className="ml-auto text-xs text-gray-500">{saving ? '保存中…' : '保存済み'} ・ {count} 文字</div>
      </div>
      <div className="flex-1 overflow-auto">
        <EditorContent editor={editor} className="prose max-w-none p-3" />
      </div>
    </div>
  );
} 