"use client";
import { useMemo, useRef, useState } from "react";
import { useAppStore } from "@/lib/store";
import { extractText } from "@/lib/file";
import SourceItem from "./SourceItem";

export default function SourceManager() {
  const { episodes, addEpisode, deleteEpisode, activeSourceIds, setActiveSources, ui, setUI } = useAppStore(s=>({
    episodes: s.episodes,
    addEpisode: s.addEpisode,
    deleteEpisode: s.deleteEpisode,
    activeSourceIds: s.activeSourceIds,
    setActiveSources: s.setActiveSources,
    ui: s.ui,
    setUI: s.setUI,
  }));
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement|null>(null);

  const filtered = useMemo(()=>{
    const q = query.trim();
    if (!q) return episodes;
    return episodes.filter(e=> e.title.includes(q) || e.content.includes(q));
  },[episodes, query]);

  async function onUpload(files: FileList|null) {
    if (!files) return;
    for (const f of Array.from(files)) {
      const text = await extractText(f);
      addEpisode(f.name, text);
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-2">
        <label className="block text-xs text-gray-600 mb-1">アップロード（TXT/MD/PDF/DOCX）</label>
        <input data-testid="source-upload" ref={inputRef} type="file" multiple onChange={(e)=> onUpload(e.target.files)} className="text-sm" />
      </div>
      <div className="p-2">
        <input value={query} onChange={(e)=> setQuery(e.target.value)} placeholder="検索" className="w-full h-9 px-2 rounded border text-sm" />
      </div>
      <div className="flex-1 overflow-auto">
        {filtered.map(ep=> {
          const checked = activeSourceIds.includes(ep.id);
          return (
            <SourceItem
              key={ep.id}
              episode={ep}
              checked={checked}
              onToggle={(c)=>{
                const next = c ? [...activeSourceIds, ep.id] : activeSourceIds.filter(id=> id!==ep.id);
                setActiveSources(next);
              }}
              onDelete={()=> deleteEpisode(ep.id)}
            />
          );
        })}
        {filtered.length===0 && (
          <div className="p-6 text-sm text-gray-500">一致する話がありません</div>
        )}
      </div>
      <div className="p-2 border-t">
        <button
          data-testid="left-search"
          className="w-full h-9 rounded bg-gray-900 text-white text-sm"
          onClick={()=> setUI({ leftTab: 'chat' })}
        >検索</button>
      </div>
    </div>
  );
} 