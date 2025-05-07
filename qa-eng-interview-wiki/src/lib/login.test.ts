import { expect, test } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('Login to Wikipedia and save auth state', async ({ page, context }) => {

  const username = process.env.WIKIPEDIA_USERNAME;
  const password = process.env.WIKIPEDIA_PASSWORD;
  
  const authFile = 'lib/tests/auth/login.json';

  if (!username || !password) {
    throw new Error('Wikipedia credentials missing in .env!');
  }

  await page.goto('https://en.wikipedia.org/w/index.php?title=Special:UserLogin');

  await page.fill('#wpName1', username);
  await page.fill('#wpPassword1', password);
  await page.click('#wpLoginAttempt');

  // Wait for successful redirect 
  await page.waitForURL('https://en.wikipedia.org/wiki/Main_Page');

  // Verify login success
  await expect(page.getByText('Welcome to Wikipedia', { exact: false })).toBeVisible({
    timeout: 15000

});
  console.log('Login Successfully', username);

});

