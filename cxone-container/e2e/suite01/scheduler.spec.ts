import {test, expect, Page} from '@playwright/test';
import { EnvUtils, PageObjects } from 'cxone-playwright-test-utils';

test.describe.serial('Scheduler >', () => {

    let page: Page;

    test.beforeAll(async ({browser}) => {
        page = await browser.newPage();
        const loginPage = new PageObjects.LoginPage(page);
        await loginPage.open();
        await loginPage.login(EnvUtils.getCustom('tenant_username'), EnvUtils.getCustom('tenant_password'));
        let name = await page.innerText('h1.page-title');
        await expect(name).toBe('Employees');
    });

    test('Create a Shift', async () => {

        // an example of how to use EnvUtils to receive data from suite setup
        const suite = EnvUtils.getCustom('suite');
        if (suite) {
            console.log('This is suite ' + suite + '.');
        }

        // navigate to Scheduler
        await page.click('[aria-label="Open the CXone Help Center"]');
        await page.click('#select-scheduler');
        await page.waitForLoadState('networkidle');
        let name = await page.innerText('h1.page-title');
        name = await page.innerText('h1.page-title');
        expect(name).toBe('Schedule Manager');

        // scroll left to midnight
        await page.waitForSelector("tr.resource-schedule:first-child td:nth-child(1)", { state: "attached", timeout: 10000 });
        const cell12am = page.locator('tr.resource-schedule:first-child td:nth-child(1)');
        await cell12am.scrollIntoViewIfNeeded();

        // scroll right to 8:00 AM
        const cell8am = page.locator('tr.resource-schedule:first-child td:nth-child(33)');
        await cell8am.scrollIntoViewIfNeeded();
        await cell8am.click({position: {x:1,y:1}});

        // create shift 8:00 AM-5:00 PM
        const addShift = await page.waitForSelector(".popover-add-shift");
        await addShift.click();
        const saveShift = await page.waitForSelector("#save");
        await saveShift.click();
        await page.hover('div.shift-schedule.copyable.editable.removable');
        await page.waitForSelector('.schedule-event-tooltip .time-range');
        expect(await page.innerText('.schedule-event-tooltip .time-range')).toBe('8:00 AM - 5:00 PM');
    });

    test('Drag and Drop to Resize Shift', async () => {
        const shift = await page.waitForSelector(".shift-schedule");
        const shiftBoundingBox = await shift.boundingBox();
        const xStart = shiftBoundingBox.x;
        const yStart = shiftBoundingBox.y;
        await page.mouse.move(xStart + 2, yStart);
        await page.mouse.down();
        await page.mouse.move(xStart - 100, yStart);
        await page.mouse.up();
        await page.hover('div.shift-schedule.copyable.editable.removable');
        await page.waitForSelector('.schedule-event-tooltip .time-range');
        expect(await page.innerText('.schedule-event-tooltip .time-range')).toBe('6:30 AM - 5:00 PM');
    });

});
