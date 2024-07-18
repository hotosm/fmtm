import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://fmtm.localhost:7050/');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByText('Temporary Account').click();
  await page.getByRole('button', { name: '+ Create New Project' }).click();
  await page.getByRole('button', { name: 'NEXT' }).click();

  // 1. Project Details Step
  await expect(page.getByText('Project Name is Required.')).toBeVisible();
  await expect(page.getByText('Short Description is Required.')).toBeVisible();
  await expect(page.getByText('Description is Required.')).toBeVisible();
  await expect(page.getByText('Organization is Required.')).toBeVisible();
  await expect(page.getByText('ODK URL is Required.')).toBeVisible();

  await page.locator('#name').click();
  await page.locator('#name').fill('playwright test');
  await page.locator('#short_description').click();
  await page.locator('#short_description').fill('short');
  await page.locator('#description').click();
  await page.locator('#description').fill('desc');
  await page.getByRole('combobox').click();
  await page.getByLabel('Nsuwal ORG').click();
  await page.getByRole('button', { name: 'NEXT' }).click();

  // 2. Upload Area Step
  await page.getByText('Upload File').click();
  await page.waitForSelector('#file-input');
  await page.locator('#file-input').click();
  const input = page.locator('#data-extract-custom-file');
  // Remove the hidden class from the input element
  await page.evaluate(
    (input) => {
      if (input) input.classList.remove('fmtm-hidden');
    },
    await input.elementHandle(),
  );

  await page.locator('#data-extract-custom-file').setInputFiles(`${__dirname}/files/invalid-aoi.geojson`);
  // await page.getByRole('alert').locator('div').filter({ hasText: 'The project area exceeded 200' }).click();
  // await page.getByRole('heading', { name: 'The project area exceeded 200' }).click();

  await page.locator('#data-extract-custom-file').setInputFiles(`${__dirname}/files/valid-aoi.geojson`);
  // Reapply the hidden class to the input element
  await page.evaluate(
    (input) => {
      if (input) input.classList.add('fmtm-hidden');
    },
    await input.elementHandle(),
  );
  await page.getByRole('button', { name: 'NEXT' }).click();

  // 3. Select Category Step
  await page.getByRole('combobox').click();
  await page.getByLabel('buildings').getByText('buildings').click();

  // 4. Data Extract Step
  await page.getByRole('button', { name: 'NEXT' }).click();
  await page.getByText('Use OSM data extract').click();
  await page.getByRole('button', { name: 'Generate Data Extract' }).click();
  await page.getByRole('button', { name: 'NEXT' }).click();

  // 5. Split Tasks Step
  await page.getByText('Divide on square').click();
  await page.getByRole('spinbutton').click();
  await page.getByRole('spinbutton').fill('200');
  await page.getByRole('button', { name: 'Click to generate task' }).click();
  await page.getByRole('button', { name: 'SUBMIT' }).click();
});
