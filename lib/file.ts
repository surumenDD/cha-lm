export async function extractText(file: File): Promise<string> {
  const name = file.name;
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf).slice(0, 8000);
  const head = new TextDecoder().decode(bytes).slice(0, 400);
  return `${name}\n\n${head}`;
}

export function downloadText(filename: string, content: string) {
  // LF 正規化
  const lf = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const blob = new Blob([new TextEncoder().encode(lf)], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
} 