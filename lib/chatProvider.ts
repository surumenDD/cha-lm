import type { ChatMessage } from './store';

export interface ChatProvider {
  send(messages: ChatMessage[], opts?: { sources?: string[] }): Promise<ChatMessage>;
}

export class MockProvider implements ChatProvider {
  async send(msgs: ChatMessage[], { sources = [] }: { sources?: string[] } = {}) {
    await new Promise((r) => setTimeout(r, 800));
    const msg: ChatMessage = {
      id: crypto.randomUUID?.() || String(Date.now()),
      role: 'assistant',
      ts: Date.now(),
      content: `（モック）参照: ${sources.slice(0, 3).join('、') || 'なし'}`,
    };
    return msg;
  }
}

export class OpenAIProvider implements ChatProvider {
  async send(messages: ChatMessage[], opts?: { sources?: string[] }): Promise<ChatMessage> {
    // 実装はダミー（後で差し替え可能）
    const msg: ChatMessage = {
      id: crypto.randomUUID?.() || String(Date.now()),
      role: 'assistant',
      ts: Date.now(),
      content: '（OpenAI ダミー応答）',
    };
    return msg;
  }
}

export function getChatProvider(): ChatProvider {
  if (typeof process !== 'undefined' && process.env.OPENAI_API_KEY) {
    return new OpenAIProvider();
  }
  return new MockProvider();
} 