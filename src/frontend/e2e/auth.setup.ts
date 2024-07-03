import { test, expect } from '@playwright/test';

const authFile = '.src/frontend/playwright/.auth/user.json';

test('test', async ({ page }) => {
  await page.goto('http://ui:7051');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page
    .locator('div')
    .filter({ hasText: /^Personal OSM AccountEdits made in FMTM will be credited to your OSM account\.$/ })
    .first()
    .click();
  await page.getByLabel('Email Address or Username').click();
  await page.getByLabel('Email Address or Username').fill('your mail@gmail.com');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('your password');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.context().storageState({ path: authFile });
});
