import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    //testDir: '.',
    testDir: './lib/tests',
    //testMatch: '**/all.test.ts',
    testMatch: '**/*.test.ts',
    workers: 1,
    fullyParallel: false,
    retries: 1,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [['html', { open: 'never' }], ['list']],
    timeout: 180_000,
    
    use: {
        baseURL: process.env.TARGET_URL,
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on',
        actionTimeout: 60_000,
        headless: false,
        contextOptions: {
            permissions: ['clipboard-read', 'clipboard-write'],
        },
        screenshot: 'on',
        video: 'on',
       // Default storage state for all tests (except login)
       storageState: path.join('lib', 'tests', 'auth', 'login.json'),
    },
    expect: {
        timeout: 60_000,
    },
    projects: [
        {
            name: 'login',
            testMatch: '**/login.test.ts',
            // Login test runs with clean state
      use: { 
        storageState: undefined,
      },
        },
        {
            name: 'All Test',
            testMatch: '**/all.test.ts',
            dependencies: ['login'],
            use: {
                ...devices['Desktop Chrome'],
            },
        },
    ],
});
