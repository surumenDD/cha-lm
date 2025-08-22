"use client";
import { useMemo, useRef, useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { getChatProvider } from "@/lib/chatProvider";

export default function SourceChat() {
  const { episodes, activeSourceIds } = useAppStore(s=>({ episodes: s.episodes, activeSourceIds: s.activeSourceIds }));
  const provider = useMemo(()=> getChatProvider(), []);
  const [messages, setMessages] = useState<{ id: string; role: 'user'|'assistant'; content: string; ts: number }[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement|null>(null);

  const chips = useMemo(()=> episodes.filter(e=> activeSourceIds.includes(e.id)).slice(0,5),[episodes, activeSourceIds]);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages.length]);

  async function send() {
    const content = input.trim();
    if (!content) return;
    const user = { id: crypto.randomUUID?.() || String(Date.now()), role: 'user' as const, content, ts: Date.now() };
    setMessages((m)=> [...m, user]);
    setInput("");
    const res = await provider.send(messages.concat(user), { sources: chips.map(c=> c.title) });
    setMessages((m)=> [...m, res]);
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b flex flex-wrap gap-1">
        {chips.map(c=> (
          <span key={c.id} className="px-2 h-6 rounded-full bg-gray-100 text-gray-700 text-xs inline-flex items-center">{c.title}</span>
        ))}
        {activeSourceIds.length>chips.length && (
          <span className="px-2 h-6 rounded-full bg-gray-100 text-gray-700 text-xs inline-flex items-center">+{activeSourceIds.length-chips.length}</span>
        )}
        {chips.length===0 && <span className="text-xs text-gray-500">ソース未選択</span>}
      </div>
      <div className="flex-1 overflow-auto p-3 space-y-3">
        {messages.map(m=> (
          <div key={m.id} className={m.role==='user' ? 'text-right' : 'text-left'}>
            <div className={`inline-block px-3 py-2 rounded-md text-sm ${m.role==='user' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>{m.content}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="p-2 border-t flex gap-2">
        <textarea value={input} onChange={(e)=> setInput(e.target.value)} onKeyDown={(e)=>{
          if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send(); }
        }} className="flex-1 h-20 p-2 border rounded text-sm" placeholder="入力して Enter で送信（Shift+Enter 改行）" />
        <button onClick={send} className="h-9 px-3 rounded bg-gray-900 text-white text-sm self-end">送信</button>
      </div>
    </div>
  );
} 