import { test, expect } from '@playwright/test';

test('左で選択→検索→左チャットへ→モック応答表示', async ({ page }) => {
  // ホーム→ブック遷移
  await page.goto('/');
  await page.getByText('+ 新規ブックを作成').click();

  // 左: アップロード
  const upload = page.getByTestId('source-upload');
  await upload.setInputFiles({ name: 'sample.txt', mimeType: 'text/plain', buffer: Buffer.from('hello world') });

  // 選択→検索で左チャットへ
  await page.getByRole('checkbox').check();
  await page.getByTestId('left-search').click();

  // チャット送信
  await page.getByPlaceholder(/入力して Enter/).click();
  await page.keyboard.type('テスト');
  await page.keyboard.press('Enter');

  await expect(page.getByText('（モック）参照:')).toBeVisible({ timeout: 10_000 });
}); 