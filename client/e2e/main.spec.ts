import { test, expect } from '@playwright/test';

test('test main component', async ({ page }) => {
  await page.goto('/');

  const heading = page.getByText(/Articles Dashboard/i);
  await expect(heading).toBeVisible();
});
