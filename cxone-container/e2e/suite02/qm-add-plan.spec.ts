import { test, expect } from '@playwright/test';
import { EnvUtils, PageObjects } from 'cxone-playwright-test-utils';

test.describe('QM >', () => {
  test('Add New Plan', async ({ page }) => {
    const loginPage = new PageObjects.LoginPage(page);

    await loginPage.open();
    await loginPage.login(EnvUtils.getCustom('tenant_username'), EnvUtils.getCustom('tenant_password'));

    const name = await page.innerText('h1.page-title');
    expect(name).toBe('Employees');

    // Click [aria-label="Open the CXone Help Center"]
    await page.click('[aria-label="Open the CXone Help Center"]');

    // Click text=QM Analytics
    await page.click('#select-formManager');

    // click on Quality Planner
    await page.click('#qpPlanManager');

    const qmPageTitle = await page.innerText('#quality-plans-page-title');
    expect(qmPageTitle).toBe('Quality Plans');

    // click on Add New Plan
    await page.click('#newPlan');
    const qmNewPlanTitle = await page.innerText('.quality-plan-details-page-title');
    expect(qmNewPlanTitle).toBe('Create New Quality Plan');

    // Click text=Add Evaluators
    await page.click('button#add-evaluators-btn');

    // check that the modal appears
    const evaluatorsTitle = await page.innerText('.headerTitle');
    expect(evaluatorsTitle).toBe('Add Evaluators');
  })
});
