import { test, expect } from '@playwright/test';

test.describe('Blue Carbon persisted workflow', () => {
  test('loads the project map and exposes the registration workflow', async ({ page }) => {
    await page.goto('/blue-carbon/projects');
    await expect(page.getByText(/Blue Carbon Projects/i)).toBeVisible();
  });
  test.todo('draw, edit, delete, and calculate a custom polygon');
  test.todo('save and reopen persisted project geometry');
  test.todo('approve, reject, request changes, correct evidence, and inspect history');
});
