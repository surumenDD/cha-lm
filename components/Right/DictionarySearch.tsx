"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { getChatProvider } from "@/lib/chatProvider";
import type { ChatMessage } from "@/lib/store";

export default function DictionarySearch() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<{h:string; pos:string; ex:string; syn:string[]}[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const provider = useMemo(()=> getChatProvider(), []);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement|null>(null);
  const [refMap, setRefMap] = useState<Record<string, string[]>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(()=>{ bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages.length, sending]);

  function mockSearch(term: string) {
    const base = term || q || '語';
    return Array.from({length: 5}).map((_,i)=> ({h:`${base} 見出し ${i+1}`, pos:'名詞', ex:`用例 ${i+1}`, syn:['類語A','類語B']}));
  }

  function search() {
    const r = mockSearch(q);
    setResults(r);
    setSelected([]);
  }

  function toggleSelect(head: string) {
    setSelected((s)=> s.includes(head) ? s.filter(x=> x!==head) : [...s, head]);
  }

  function insertQuote(text: string) {
    setInput((v)=> (v ? v + "\n" : "") + `> ${text}`);
  }

  function parseDictCommand(v: string): string | null {
    const m = v.match(/^\s*\/dict\s+(.+)/i);
    return m ? m[1].trim() : null;
  }

  async function send() {
    const content = input.trim();
    if (!content) return;
    const user: ChatMessage = { id: crypto.randomUUID?.() || String(Date.now()), role: 'user', content, ts: Date.now() };
    setMessages(m=> [...m, user]);
    setInput("");
    setSending(true);

    // 自動辞書検索（/dict があればその語、なければ入力 or 検索欄）
    const term = parseDictCommand(content) || content || q;
    const latestResults = mockSearch(term);
    setResults(latestResults);

    const refs = (selected.length ? selected : latestResults.slice(0,3).map(r=> r.h)).slice(0,5);
    const res = await provider.send(messages.concat(user), { sources: refs });
    setMessages(m=> [...m, res]);
    setRefMap(map => ({ ...map, [res.id]: refs }));
    setSending(false);
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b flex gap-2">
        <input value={q} onChange={(e)=> setQ(e.target.value)} placeholder="辞書・表現検索" className="flex-1 h-9 px-2 rounded border text-sm" />
        <button className="h-9 px-3 rounded bg-gray-900 text-white text-sm" onClick={search}>検索</button>
      </div>

      {selected.length>0 && (
        <div className="px-3 py-2 border-b flex flex-wrap gap-1">
          {selected.map(h=> (
            <button key={h} onClick={()=> toggleSelect(h)} className="px-2 h-6 rounded-full bg-gray-900 text-white text-xs">{h} ✕</button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-auto p-3 space-y-3">
        {results.map((r,i)=> (
          <div key={i} className={`border rounded p-3 bg-white ${selected.includes(r.h)?'ring-2 ring-gray-900':''}`}>
            <div className="font-medium flex items-center justify-between">
              <span>{r.h} <span className="text-xs text-gray-500">{r.pos}</span></span>
              <div className="flex items-center gap-2">
                <button className="text-xs px-2 py-1 rounded border" onClick={()=> insertQuote(`${r.h} — ${r.ex}`)}>引用</button>
                <button className="text-xs px-2 py-1 rounded border" onClick={()=> toggleSelect(r.h)}>{selected.includes(r.h)?'選択解除':'選択'}</button>
              </div>
            </div>
            <div className="text-sm text-gray-700 mt-1">{r.ex}</div>
            <div className="text-xs text-gray-500 mt-1">類語: {r.syn.join('、')}</div>
          </div>
        ))}
        {results.length===0 && <div className="text-sm text-gray-500">結果なし</div>}
      </div>

      <div className="border-t p-2 space-y-2">
        <div className="text-xs text-gray-500">補助チャット（/dict 語 で辞書優先検索）</div>
        <div className="h-40 overflow-auto bg-gray-50 rounded p-2 space-y-3">
          {messages.map(m=> {
            const refs = refMap[m.id];
            const hasRefs = Array.isArray(refs) && refs.length>0;
            return (
              <div key={m.id} className="space-y-1">
                <div className={m.role==='user' ? 'text-right' : 'text-left'}>
                  <div className={`inline-block max-w-[85%] px-3 py-2 rounded-md text-sm whitespace-pre-wrap ${m.role==='user' ? 'bg-gray-900 text-white' : 'bg-white border'}`}>{m.content}</div>
                </div>
                {m.role==='assistant' && hasRefs && (
                  <div className="text-left text-xs">
                    <button className="px-2 py-1 rounded border" onClick={()=> setExpanded(e => ({ ...e, [m.id]: !e[m.id] }))}>
                      {expanded[m.id] ? '参照を隠す' : '参照を表示'}
                    </button>
                    {expanded[m.id] && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {refs.map((h)=> (
                          <span key={h} className="px-2 h-6 rounded-full bg-white border inline-flex items-center">{h}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {sending && (
            <div className="text-left">
              <div className="inline-block px-3 py-2 rounded-md text-sm bg-white border text-gray-500">…</div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e)=> setInput(e.target.value)}
            onKeyDown={(e)=>{ if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            className="flex-1 h-20 p-2 border rounded text-sm"
            placeholder="入力して Enter で送信（Shift+Enter 改行）"
          />
          <button disabled={sending} onClick={send} className="h-9 px-3 rounded bg-gray-900 text-white text-sm self-end disabled:opacity-50">送信</button>
        </div>
      </div>
    </div>
  );
} 