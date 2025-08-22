"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { Panels } from "@/components/Panels";
import TitleBar from "@/components/Editor/TitleBar";
import RichEditor, { type RichEditorValue } from "@/components/Editor/RichEditor";
import SourceManager from "@/components/Left/SourceManager";
import SourceChat from "@/components/Left/SourceChat";
import DictionarySearch from "@/components/Right/DictionarySearch";
import MaterialUpload from "@/components/Right/MaterialUpload";
import MaterialChat from "@/components/Right/MaterialChat";

export default function EditorPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const { ensureSeedBooks, ui, setUI } = useAppStore(s=>({ ensureSeedBooks: s.ensureSeedBooks, ui: s.ui, setUI: s.setUI }));
  const book = useAppStore(s=> s.books.find(b=>b.id===id));
  const updateBook = useAppStore(s=> s.updateBook);

  const [value, setValue] = useState<RichEditorValue>({ title: book?.title || '', content: '' });
  const [saving, setSaving] = useState(false);

  useEffect(()=>{ ensureSeedBooks(); },[ensureSeedBooks]);
  useEffect(()=>{ setValue(v=> ({ ...v, title: book?.title || '' })); },[book?.title]);

  return (
    <div className="h-[calc(100vh-56px)]">
      <div className="hidden lg:block h-full">
        <Panels.Group direction="horizontal">
          <Panels.Pane defaultSize={20} minSize={16} maxSize={28}>
            <div className="h-full overflow-hidden border-r flex flex-col">
              <div className="h-10 px-3 border-b flex items-center gap-2 text-sm">
                <button className={`h-7 px-3 rounded ${ui.leftTab==='manage'?'bg-gray-900 text-white':'border'}`} onClick={()=> setUI({ leftTab: 'manage' })}>ソース管理</button>
                <button className={`h-7 px-3 rounded ${ui.leftTab==='chat'?'bg-gray-900 text-white':'border'}`} onClick={()=> setUI({ leftTab: 'chat' })}>ソースチャット</button>
              </div>
              <div className="flex-1 overflow-auto">
                {ui.leftTab==='manage' ? <SourceManager /> : <SourceChat />}
              </div>
            </div>
          </Panels.Pane>
          <Panels.Pane minSize={40}>
            <div className="h-full flex flex-col border-r">
              <TitleBar
                title={value.title}
                saving={saving}
                onChange={(t)=>{ setSaving(true); setValue(v=>({ ...v, title: t })); setSaving(false); updateBook(id, { title: t }); }}
              />
              <div className="flex-1">
                <RichEditor
                  value={value}
                  onChange={(v)=>{ setValue(v); updateBook(id, { title: v.title }); }}
                />
              </div>
            </div>
          </Panels.Pane>
          <Panels.Pane defaultSize={24} minSize={18} maxSize={30}>
            <div className="h-full overflow-hidden flex flex-col">
              <div className="h-10 px-3 border-b flex items-center gap-2 text-sm">
                <button className={`h-7 px-3 rounded ${ui.rightTab==='dict'?'bg-gray-900 text-white':'border'}`} onClick={()=> setUI({ rightTab: 'dict' })}>辞書・表現検索</button>
                <button className={`h-7 px-3 rounded ${ui.rightTab==='material'?'bg-gray-900 text-white':'border'}`} onClick={()=> setUI({ rightTab: 'material' })}>資料検索</button>
              </div>
              <div className="flex-1 overflow-auto">
                {ui.rightTab==='dict' ? (
                  <DictionarySearch />
                ) : (
                  <div className="h-full flex flex-col">
                    <div className="h-9 px-3 border-b flex items-center gap-2 text-sm">
                      <button className={`h-7 px-3 rounded ${ui.rightSubTab==='upload'?'bg-gray-900 text-white':'border'}`} onClick={()=> setUI({ rightSubTab: 'upload' })}>資料アップロード</button>
                      <button className={`h-7 px-3 rounded ${ui.rightSubTab==='chat'?'bg-gray-900 text-white':'border'}`} onClick={()=> setUI({ rightSubTab: 'chat' })}>資料チャット</button>
                    </div>
                    <div className="flex-1 overflow-auto">
                      {ui.rightSubTab==='upload' ? <MaterialUpload /> : <MaterialChat />}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Panels.Pane>
          <Panels.Handle />
        </Panels.Group>
      </div>
      <div className="lg:hidden p-3 space-y-3">
        <section className="border rounded-md bg-white">
          <header className="px-3 py-2 border-b text-sm text-gray-600">中央</header>
          <div className="p-3">エディタ</div>
        </section>
        <section className="border rounded-md bg-white">
          <header className="px-3 py-2 border-b text-sm text-gray-600">左</header>
          <div className="p-3">ソース</div>
        </section>
        <section className="border rounded-md bg-white">
          <header className="px-3 py-2 border-b text-sm text-gray-600">右</header>
          <div className="p-3">辞書/資料</div>
        </section>
      </div>
    </div>
  );
} 