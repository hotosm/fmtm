import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, './.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Navigate to the app's base URL
  await page.goto('/');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Select OSM login
  await page.getByText('Personal OSM Account').click();
  await page.waitForSelector('text=Log in to OpenStreetMap');

  // OSM Login page
  await page.getByLabel('Email Address or Username').fill('FMTM Playwright');
  await page.getByLabel('Password').fill('Boondocks County Send6 Slingshot Villain Vocalist');
  await page.getByRole('button', { name: 'Log in' }).click();

  // Save authentication state
  await page.context().storageState({ path: authFile });

  // Wait for redirect and valid login (sign out button)
  await page.waitForSelector('text=Sign Out');
});
