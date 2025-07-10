import { test, expect } from '@playwright/test';

test('test main component', async ({ page }) => {
  await page.goto('/');

  const heading = page.getByText(/Dashboard/i);
  await expect(heading).toBeVisible();
});
