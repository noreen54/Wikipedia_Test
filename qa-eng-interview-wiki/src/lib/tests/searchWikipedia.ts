import { Page, expect } from '@playwright/test';


export async function run(page: Page, params: {}) {
    /** STEP 1: Navigate to Wikipedia */
    await page.goto('https://www.wikipedia.org/');

    await expect(page).toHaveTitle('Wikipedia');

    /** STEP 2: Search for and navigate to AI page */
    const searchInputField = page.getByRole('searchbox', {
        name: 'Search Wikipedia',
    });
    
    // Type the complete search term
    await searchInputField.fill('Artificial intelligence');

      // Click on the search button 
      await page.click('.sprite.svg-search-icon');

     //verify header of Artificial intelligence
    await expect(page.getByRole('heading', { name: /Artificial [iI]ntelligence/ })).toBeVisible();

    // Go to View History page
    const historyTab = page.getByRole('link', { 
        name: 'View history',
        exact: true
    });
    await expect(historyTab).toBeVisible();
    await historyTab.click();

    // Verify we're on history page url
    await expect(page).toHaveURL('https://en.wikipedia.org/w/index.php?title=Artificial_intelligence&action=history');

    // Verify if header 'Artificial intelligence: Revision history' is visible
    await expect(page.getByRole('heading', { name: /Artificial intelligence: Revision history/ })).toBeVisible();


    // Verify latest editor 
    const latestEditRow = page.locator('#pagehistory li:visible').first();
    await expect(latestEditRow).toBeVisible({ 
    timeout: 15000
     });

    const latestEditor = latestEditRow.locator('.history-user > .mw-userlink');
    await expect(latestEditor).toBeVisible();

    const actualEditorName = (await latestEditor.textContent())?.trim();
    if (!actualEditorName) {
    throw new Error('Could not determine editor name - element was empty');
     }

     // Case-insensitive check
     if (!actualEditorName.toLowerCase().includes('worstbull')) {
    // Get more context about the edit
    const editTimestamp = await latestEditRow.locator('.mw-changeslist-date').textContent();
    const editSummary = (await latestEditRow.locator('.comment').textContent())?.trim() || 'No edit summary';
    
    throw new Error([
        `Latest edit was not made by Worstbull.`,
        `- Actual editor: ${actualEditorName}`,
        `- Edit time: ${editTimestamp}`,
        `- Edit summary: ${editSummary}`,
        `Please verify if the expected editor name needs updating.`
    ].join('\n'));
     }

    console.log(`Test passed - Latest edit was made by ${actualEditorName}`);

};
