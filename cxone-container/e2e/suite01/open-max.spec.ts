import { test, expect } from '@playwright/test';
import { PageObjects, EnvUtils } from 'cxone-playwright-test-utils';

test('Open MAX', async ({ page }) => {
    test.skip(true, 'This feature requires a user with MAX');
    const loginPage = new PageObjects.LoginPage(page);
    await loginPage.open();
    await loginPage.login(EnvUtils.getCustom('tenant_username'), EnvUtils.getCustom('tenant_password'));

    let name = await page.innerText('h1.page-title');
    expect(name).toBe('Employees');

    // Click [aria-label="Open the CXone Help Center"]
    await page.click('[aria-label="Open the CXone Help Center"]');

    // Click #select-max div:has-text("MAX")
    const [page1] = await Promise.all([
        page.waitForEvent('popup'),
        page.click('#select-max div:has-text("MAX")')
    ]);

    const phoneNumber = await page1.waitForSelector('#phoneNumberText', {timeout : 60000});
    await phoneNumber.click();
    await phoneNumber.fill('12345');

    const visible = await page1.isVisible('#phoneNumberText');
    expect(visible).toBeTruthy();

    const enabled = await page1.isEnabled('#phoneNumberText');
    expect(enabled).toBeTruthy();

    // Close page
    await page1.close();

    name = await page.innerText('h1.page-title');
    expect(name).toBe('Employees');

});