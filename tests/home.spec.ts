import { test, expect } from '@playwright/test';

test('ホーム: 切替→検索→新規作成→カードクリックで遷移', async ({ page }) => {
  await page.goto('/');
  // 切替
  await page.getByRole('button', { name: 'Grid' }).click();
  // 検索
  const search = page.getByPlaceholder('検索（/ でフォーカス）');
  await search.fill('サンプルブック');
  // 新規作成
  await page.getByRole('button', { name: '新規作成' }).click();
  await expect(page).toHaveURL(/\/book\//);
  // 戻ってカードクリック
  await page.goBack();
  await page.getByRole('button', { name: /サンプルブック/ }).first().click();
  await expect(page).toHaveURL(/\/book\//);
}); 