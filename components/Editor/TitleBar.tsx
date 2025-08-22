"use client";
import { useEffect, useState } from "react";

type Props = {
  title: string;
  onChange: (v: string) => void;
  saving?: boolean;
};

export default function TitleBar({ title, onChange, saving }: Props) {
  const [value, setValue] = useState(title);
  useEffect(()=>{ setValue(title); }, [title]);
  return (
    <div className="h-10 flex items-center gap-3 px-3 border-b">
      <input
        value={value}
        onChange={(e)=>{ setValue(e.target.value); onChange(e.target.value); }}
        placeholder="無題"
        className="flex-1 h-8 px-2 rounded border border-gray-300 text-sm"
      />
      <div className="text-xs text-gray-500">{saving ? '保存中…' : '保存済み'}</div>
    </div>
  );
} 