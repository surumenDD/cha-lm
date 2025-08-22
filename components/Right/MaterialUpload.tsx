"use client";
import { useMemo, useRef } from "react";
import { useAppStore } from "@/lib/store";
import { extractText } from "@/lib/file";

export default function MaterialUpload() {
  const { materials, addMaterial, deleteMaterial, activeMaterialIds, setActiveMaterials } = useAppStore(s=>({
    materials: s.materials,
    addMaterial: s.addMaterial,
    deleteMaterial: s.deleteMaterial,
    activeMaterialIds: s.activeMaterialIds,
    setActiveMaterials: s.setActiveMaterials,
  }));
  const inputRef = useRef<HTMLInputElement|null>(null);

  async function onUpload(files: FileList|null) {
    if (!files) return;
    for (const f of Array.from(files)) {
      const text = await extractText(f);
      addMaterial(f.name, text);
    }
  }

  const chips = useMemo(()=> materials.filter(m=> activeMaterialIds.includes(m.id)).slice(0,5),[materials, activeMaterialIds]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b">
        <label className="block text-xs text-gray-600 mb-1">資料アップロード</label>
        <input ref={inputRef} type="file" multiple onChange={(e)=> onUpload(e.target.files)} className="text-sm" />
      </div>
      <div className="flex-1 overflow-auto">
        {materials.map(m=> {
          const checked = activeMaterialIds.includes(m.id);
          return (
            <label key={m.id} className="flex items-center gap-2 px-3 py-2 border-b">
              <input type="checkbox" checked={checked} onChange={(e)=>{
                const next = e.target.checked ? [...activeMaterialIds, m.id] : activeMaterialIds.filter(id=> id!==m.id);
                setActiveMaterials(next);
              }} />
              <span className="text-sm flex-1 line-clamp-1">{m.title}</span>
              <button className="text-xs text-red-500" onClick={()=> deleteMaterial(m.id)}>削除</button>
            </label>
          );
        })}
        {materials.length===0 && <div className="p-6 text-sm text-gray-500">資料なし</div>}
      </div>
      <div className="p-2 border-t flex flex-wrap gap-1">
        {chips.map(c=> (
          <span key={c.id} className="px-2 h-6 rounded-full bg-gray-100 text-gray-700 text-xs inline-flex items-center">{c.title}</span>
        ))}
        {activeMaterialIds.length>chips.length && (
          <span className="px-2 h-6 rounded-full bg-gray-100 text-gray-700 text-xs inline-flex items-center">+{activeMaterialIds.length-chips.length}</span>
        )}
      </div>
    </div>
  );
} 