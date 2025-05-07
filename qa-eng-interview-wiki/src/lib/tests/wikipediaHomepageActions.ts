import { Page, expect } from '@playwright/test';


export async function run(page: Page, params: {}) {
    // Navigate to Wikipedia's homepage */
    await page.goto('https://en.wikipedia.org/wiki/Main_Page');
    
    // Store initial font size for comparison
    const initialFontSize = await page.locator('body').evaluate(el => 
        window.getComputedStyle(el).fontSize
    );

    //Assert there are less than 7,000,000 articles in English
    const articleCountElement = page.getByText(/^[\d,]+ articles in English/).first();
    await expect(articleCountElement).toBeVisible();
    
    const articleCountText = await articleCountElement.textContent();
    const articleCount = parseInt(articleCountText?.replace(/[^0-9]/g, '') || '0');
    expect(articleCount).toBeLessThan(7000000);
    console.log("There are less than 700000 in english")

    // Simulate 'Small' text size and verify 
    await page.evaluate(() => {
        document.body.style.fontSize = '80%';
    });
    await page.waitForTimeout(500);
    
    const smallFontSize = await page.locator('body').evaluate(el => 
        window.getComputedStyle(el).fontSize
    );
    expect(parseFloat(smallFontSize)).toBeLessThan(parseFloat(initialFontSize));

    // Simulate 'Large' text size and verify 
    await page.evaluate(() => {
        document.body.style.fontSize = '120%';
    });
    await page.waitForTimeout(500);
    
    const largeFontSize = await page.locator('body').evaluate(el => 
        window.getComputedStyle(el).fontSize
    );
    expect(parseFloat(largeFontSize)).toBeGreaterThan(parseFloat(initialFontSize));

    // Reset to default size and verify
    await page.evaluate(() => {
        document.body.style.fontSize = '';
    });
    await page.waitForTimeout(500);
    
    const finalFontSize = await page.locator('body').evaluate(el => 
        window.getComputedStyle(el).fontSize
    );
    expect(finalFontSize).toBe(initialFontSize);
}