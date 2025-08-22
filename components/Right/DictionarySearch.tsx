"use client";
import { useState } from "react";

export default function DictionarySearch() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<{h:string; pos:string; ex:string; syn:string[]}[]>([]);
  const [chat, setChat] = useState<string[]>([]);

  function search() {
    const r = Array.from({length: 5}).map((_,i)=> ({h:`${q} 見出し ${i+1}`, pos:'名詞', ex:`用例 ${i+1}`, syn:['類語A','類語B']}));
    setResults(r);
  }

  function ask() {
    if (!q) return;
    setChat((c)=> [...c, `Q: ${q}`, `A: （ダミー応答）${q} の言い換え候補です。`]);
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b flex gap-2">
        <input value={q} onChange={(e)=> setQ(e.target.value)} placeholder="辞書・表現検索" className="flex-1 h-9 px-2 rounded border text-sm" />
        <button className="h-9 px-3 rounded bg-gray-900 text-white text-sm" onClick={search}>検索</button>
      </div>
      <div className="flex-1 overflow-auto p-3 space-y-3">
        {results.map((r,i)=> (
          <div key={i} className="border rounded p-3 bg-white">
            <div className="font-medium">{r.h} <span className="text-xs text-gray-500">{r.pos}</span></div>
            <div className="text-sm text-gray-700 mt-1">{r.ex}</div>
            <div className="text-xs text-gray-500 mt-1">類語: {r.syn.join('、')}</div>
          </div>
        ))}
        {results.length===0 && <div className="text-sm text-gray-500">結果なし</div>}
      </div>
      <div className="border-t p-2 space-y-2">
        <div className="text-xs text-gray-500">補助チャット</div>
        <div className="h-24 overflow-auto bg-gray-50 rounded p-2 text-xs whitespace-pre-wrap">{chat.join('\n')}</div>
        <button className="h-8 px-3 rounded border text-sm" onClick={ask}>質問する</button>
      </div>
    </div>
  );
} 