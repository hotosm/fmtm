import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://fmtm.localhost:7050/');
  await page.getByRole('button', { name: '+ Create New Project' }).click();

  //UNCOMMENT FOR LOGIN
  await page.getByText('Personal OSM Account').click();
  await page.goto(
    'https://www.openstreetmap.org/login?cookie_test=true&referer=%2Foauth2%2Fauthorize%3Fresponse_type%3Dcode%26client_id%3D9qmECyRwBNFyqNl9LszwHX1WOxKFKeBsA5ofAS1GJGY%26redirect_uri%3Dhttp%253A%252F%252F127.0.0.1%253A7051%252Fosmauth%252F%26scope%3Dread_prefs%26state%3D0SqgC9WJxFnGYX4OS3iVrIb3pM6AqY',
  );
  await page.getByLabel('Email Address or Username').click();
  await page.getByLabel('Email Address or Username').fill('suwalnishit@gmail.com');
  await page.getByLabel('Email Address or Username').press('Tab');
  await page.getByLabel('Password').fill('nsuwal123');
  await page.getByRole('button', { name: 'Log in' }).click();

  await page.locator('#name').click();
  await page.locator('#name').fill('test tes ttes');
  await page.locator('#short_description').click();
  await page.locator('#short_description').fill('short');
  await page.locator('#description').click();
  await page.locator('#description').fill('esc');
  await page.getByRole('combobox').click();
  await page.getByLabel('Nsuwal ORG').click();
  await page.getByText('Project Name*Short').click();

  await page.getByRole('button', { name: 'NEXT' }).click();

  // await page.locator('canvas').click({
  //   position: {
  //     x: 361,
  //     y: 146,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 361,
  //     y: 146,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 361,
  //     y: 146,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 363,
  //     y: 139,
  //   },
  // });
  // await page.locator('canvas').click({
  //   position: {
  //     x: 362,
  //     y: 100,
  //   },
  // });
  // await page.locator('canvas').click({
  //   position: {
  //     x: 360,
  //     y: 144,
  //   },
  // });
  // await page.locator('canvas').click({
  //   position: {
  //     x: 360,
  //     y: 144,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 361,
  //     y: 146,
  //   },
  // });
  // await page.locator('canvas').dblclick({
  //   position: {
  //     x: 361,
  //     y: 146,
  //   },
  // });
  // await page.locator('canvas').click({
  //   position: {
  //     x: 361,
  //     y: 146,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 364,
  //     y: 142,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 364,
  //     y: 142,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 364,
  //     y: 142,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 367,
  //     y: 140,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 367,
  //     y: 140,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 367,
  //     y: 140,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 398,
  //     y: 144,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 407,
  //     y: 145,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 407,
  //     y: 145,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 407,
  //     y: 145,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 407,
  //     y: 145,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 407,
  //     y: 145,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 407,
  //     y: 145,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 228,
  //     y: 172,
  //   },
  // });

  // await page.locator('canvas').click({
  //   position: {
  //     x: 361,
  //     y: 146,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 361,
  //     y: 146,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 361,
  //     y: 146,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 363,
  //     y: 139,
  //   },
  // });
  // await page.locator('canvas').click({
  //   position: {
  //     x: 362,
  //     y: 100,
  //   },
  // });
  // await page.locator('canvas').click({
  //   position: {
  //     x: 360,
  //     y: 144,
  //   },
  // });
  // await page.locator('canvas').click({
  //   position: {
  //     x: 360,
  //     y: 144,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 361,
  //     y: 146,
  //   },
  // });
  // await page.locator('canvas').dblclick({
  //   position: {
  //     x: 361,
  //     y: 146,
  //   },
  // });
  // await page.locator('canvas').click({
  //   position: {
  //     x: 361,
  //     y: 146,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 364,
  //     y: 142,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 364,
  //     y: 142,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 364,
  //     y: 142,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 367,
  //     y: 140,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 367,
  //     y: 140,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 367,
  //     y: 140,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 398,
  //     y: 144,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 407,
  //     y: 145,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 407,
  //     y: 145,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 407,
  //     y: 145,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 407,
  //     y: 145,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 407,
  //     y: 145,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 407,
  //     y: 145,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 228,
  //     y: 172,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 367,
  //     y: 140,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 398,
  //     y: 144,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 407,
  //     y: 145,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 407,
  //     y: 145,
  //   },
  // });
  // await page.locator('canvas').click({
  //   clickCount: 3,
  //   position: {
  //     x: 407,
  //     y: 145,
  //   },
  // });

  await page.getByText('Draw', { exact: true }).click();

  await page.evaluate(() => {
    console.log('testttttttttttt ----------------------------------------------------------------------------------');
    const map = document.getElementById('ol-map');

    draw.appendCoordinates([
      [85.30975492561487, 27.69184476860042],
      [85.30975492561487, 27.685529976740412],
      [85.31878796930516, 27.685529976740412],
      [85.31878796930516, 27.69184476860042],
      [85.30975492561487, 27.69184476860042],
    ]);
    draw.finishDrawing();
  });

  // await page.locator('canvas').click({
  //   position: {
  //     x: 137,
  //     y: 48,
  //   },
  // });
  // await page.locator('canvas').click({
  //   position: {
  //     x: 114,
  //     y: 311,
  //   },
  // });
  // await page.locator('canvas').click({
  //   position: {
  //     x: 430,
  //     y: 334,
  //   },
  // });
  // await page.locator('canvas').click({
  //   position: {
  //     x: 397,
  //     y: 38,
  //   },
  // });
  // await page.locator('canvas').click({
  //   position: {
  //     x: 137,
  //     y: 48,
  //   },
  // });
  // await page.locator('canvas').click({
  //   position: {
  //     x: 137,
  //     y: 48,
  //   },
  // });

  await page.getByRole('button', { name: 'NEXT' }).click();
  // await page.getByRole('combobox').click();
  // await page.getByLabel('buildings').getByText('buildings').click();
  // await page.getByRole('button', { name: 'NEXT' }).click();
  // await page.getByText('Use OSM data extract').click();
  // await page.getByRole('button', { name: 'Generate Data Extract' }).click();
  // await page.getByRole('button', { name: 'NEXT' }).click();
  // await page.getByText('Divide on square').click();
  // await page.getByRole('spinbutton').click();
  // await page.getByRole('spinbutton').fill('500');
  // await page.getByRole('button', { name: 'Click to generate task' }).click();
  // await page.getByRole('button', { name: 'SUBMIT' }).click();

  // await page.goto('http://fmtm.localhost:7050/project/64');
});
