"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useAppStore } from "@/lib/store";

export default function Home() {
  const router = useRouter();
  const { books, ensureSeedBooks, addBook, query, setQuery, viewMode, setViewMode, sortOrder, setSortOrder } = useAppStore(s=>({
    books: s.books,
    ensureSeedBooks: s.ensureSeedBooks,
    addBook: s.addBook,
    query: s.query,
    setQuery: s.setQuery,
    viewMode: s.viewMode,
    setViewMode: s.setViewMode,
    sortOrder: s.sortOrder,
    setSortOrder: s.setSortOrder,
  }));

  useEffect(()=>{ ensureSeedBooks(); },[ensureSeedBooks]);

  const filtered = useMemo(()=>{
    const q = (query||'').trim();
    const list = books.filter(b=> !q || b.title.includes(q));
    switch (sortOrder) {
      case 'oldest': return list.slice().sort((a,b)=> a.updatedAt - b.updatedAt);
      case 'title-asc': return list.slice().sort((a,b)=> a.title.localeCompare(b.title));
      case 'title-desc': return list.slice().sort((a,b)=> b.title.localeCompare(a.title));
      default: return list.slice().sort((a,b)=> b.updatedAt - a.updatedAt);
    }
  },[books, query, sortOrder]);

  return (
    <div className="px-4">
      <div className="flex items-center justify-between h-12 border-b border-gray-200">
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-full bg-gray-900 text-white text-sm">マイブック</button>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e)=> setQuery(e.target.value)}
            placeholder="検索（/ でフォーカス）"
            className="w-72 h-9 px-3 rounded-md border border-gray-300 text-sm"
          />
          <button className="h-9 px-3 rounded-md border text-sm" onClick={()=> setViewMode(viewMode==='grid'?'list':'grid')}>{viewMode==='grid'?'Grid':'List'}</button>
          <select className="h-9 px-2 rounded-md border text-sm" value={sortOrder} onChange={(e)=> setSortOrder(e.target.value as any)}>
            <option value="newest">新しい順</option>
            <option value="oldest">古い順</option>
            <option value="title-asc">タイトル A→Z</option>
            <option value="title-desc">タイトル Z→A</option>
          </select>
          <button
            className="h-9 px-3 rounded-md bg-gray-900 text-white text-sm"
            onClick={()=>{
              const b = addBook('新しいブック');
              router.push(`/book/${b.id}`);
            }}
          >新規作成</button>
        </div>
      </div>
      <div className="py-6">
        {viewMode==='grid' ? (
          <div className="grid gap-6" style={{gridTemplateColumns: "repeat(auto-fill, minmax(312px, 1fr))"}}>
            <button
              onClick={()=>{
                const b = addBook('新しいブック');
                router.push(`/book/${b.id}`);
              }}
              className="h-44 rounded-xl border-2 border-dashed border-gray-300 p-4 bg-white flex items-center justify-center text-sm text-gray-600"
            >+ 新規ブックを作成</button>
            {filtered.map((b)=> (
              <button key={b.id} onClick={()=> router.push(`/book/${b.id}`)} className="text-left h-44 rounded-xl shadow-sm hover:shadow-md p-4 bg-white border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">{b.coverEmoji || '📘'}</div>
                  <span className="text-gray-500">⋯</span>
                </div>
                <div className="mt-4 font-medium line-clamp-2">{b.title}</div>
                <div className="mt-2 text-xs text-gray-500">{new Date(b.updatedAt).toLocaleDateString('ja-JP', {year:'numeric', month:'2-digit', day:'2-digit'})} ・ {b.sourceCount} 個のソース</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="divide-y rounded-md border bg-white">
            <button
              onClick={()=>{
                const b = addBook('新しいブック');
                router.push(`/book/${b.id}`);
              }}
              className="w-full text-left h-16 px-4 hover:bg-gray-50 flex items-center gap-4 border-b"
            >+ 新規ブックを作成</button>
            {filtered.map(b=> (
              <button key={b.id} onClick={()=> router.push(`/book/${b.id}`)} className="w-full text-left h-16 px-4 hover:bg-gray-50 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">{b.coverEmoji || '📘'}</div>
                <div className="flex-1">
                  <div className="font-medium line-clamp-1">{b.title}</div>
                  <div className="text-xs text-gray-500">{new Date(b.updatedAt).toLocaleDateString('ja-JP', {year:'numeric', month:'2-digit', day:'2-digit'})} ・ {b.sourceCount} 個のソース</div>
                </div>
                <span className="text-gray-400">⋯</span>
              </button>
            ))}
          </div>
        )}
        {filtered.length===0 && (
          <div className="text-sm text-gray-500">該当なし</div>
        )}
      </div>
    </div>
  );
}
