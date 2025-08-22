"use client";
import { useRef, useState, useEffect } from "react";
import { downloadText } from "@/lib/file";
import type { Episode } from "@/lib/store";

type Props = {
  episode: Episode;
  checked: boolean;
  onToggle: (checked: boolean) => void;
  onDelete: () => void;
};

export default function SourceItem({ episode, checked, onToggle, onDelete }: Props) {
  const [menu, setMenu] = useState<{x:number;y:number}|null>(null);
  const ref = useRef<HTMLDivElement|null>(null);

  useEffect(()=>{
    function onDocClick(e: MouseEvent){
      if (menu && ref.current && !ref.current.contains(e.target as Node)) setMenu(null);
    }
    function onEsc(e: KeyboardEvent){ if (e.key==='Escape') setMenu(null); }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return ()=>{ document.removeEventListener('mousedown', onDocClick); document.removeEventListener('keydown', onEsc); };
  },[menu]);

  return (
    <div
      className="relative"
      onContextMenu={(e)=>{ e.preventDefault(); setMenu({ x: e.clientX, y: e.clientY }); }}
      ref={ref}
    >
      <label className="flex items-center gap-2 px-3 py-2 border-b select-none">
        <input type="checkbox" checked={checked} onChange={(e)=> onToggle(e.target.checked)} />
        <span className="text-sm flex-1 line-clamp-1">{episode.title}</span>
        <span className="text-xs text-gray-400">右クリック</span>
      </label>
      {menu && (
        <div className="absolute z-50 bg-white border rounded shadow text-sm" style={{ left: 8, top: 8 }}>
          <button className="block w-full text-left px-3 py-2 hover:bg-gray-50" onClick={()=>{
            downloadText(`${episode.title || 'export'}.txt`, episode.content || '');
            setMenu(null);
          }}>TXT エクスポート</button>
          <button className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50" onClick={()=>{ onDelete(); setMenu(null); }}>削除</button>
        </div>
      )}
    </div>
  );
} 