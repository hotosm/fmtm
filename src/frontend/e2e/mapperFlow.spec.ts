import { test, expect } from '@playwright/test';

test.describe('Project Details Test', () => {
  test('mapper flow test', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page
      .getByLabel('', { exact: true })
      .locator('div')
      .filter({ hasText: "Temporary AccountIf you're" })
      .nth(3)
      .click();

    // click first project card on the home page
    await page.locator('.MuiCardContent-root').first().click();

    // click on task
    await page.waitForTimeout(4000);
    await page.locator('canvas').click({
      position: {
        x: 445,
        y: 95,
      },
    });
    await expect(page.getByText('Status: READY')).toBeVisible();

    // STATUS: READY
    await page.getByRole('button', { name: 'START MAPPING' }).waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'START MAPPING' }).click();
    await page.waitForSelector('div:has-text("updated status to LOCKED_FOR_MAPPING"):nth-of-type(1)');
    await expect(
      page
        .locator('div')
        .filter({ hasText: /updated status to LOCKED_FOR_MAPPING/ })
        .first(),
    ).toBeVisible();

    //STATUS: LOCKED_FOR_MAPPING
    await page.getByRole('button', { name: 'MARK AS FULLY MAPPED' }).click();
    await page.getByRole('button', { name: 'MARK AS FULLY MAPPED' }).click();
    await page.waitForSelector('div:has-text("updated status to MAPPED"):nth-of-type(1)');
    await expect(
      page
        .locator('div')
        .filter({ hasText: /updated status to MAPPED/ })
        .first(),
    ).toBeVisible();

    // STATUS: MAPPED
    await page.getByRole('button', { name: 'START VALIDATION' }).click();
    await page.getByRole('button', { name: 'FULLY MAPPED' }).click();

    await page.getByText('has been updated to VALIDATED').waitFor({ state: 'visible' });
    await expect(page.getByText('has been updated to VALIDATED')).toBeVisible();

    // click on validated task after map renders
    await page.waitForTimeout(4000);
    await page.locator('canvas').click({
      position: {
        x: 445,
        y: 95,
      },
    });
    await expect(page.getByText('Status: VALIDATED')).toBeVisible();
  });

  test('comment section test', async ({ page }) => {});
});
