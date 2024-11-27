import { test as setup } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, './.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Note this sets a token so we can proceed, but the login will be
  // overwritten by svcfmtm localadmin user (as DEBUG=True)
  await page.goto('/playwright-temp-login/');

  // Now check we are signed in as localadmin
  await page.waitForSelector('text=localadmin');

  // Save authentication state
  await page.context().storageState({ path: authFile });
});
