import { test, expect } from '@playwright/test';
import ImportPage from  '../pageobjects/import-user.page';
import * as path from "path";
import { EnvUtils, PageObjects, AccountUtils } from 'cxone-playwright-test-utils';

test.describe('Users >', () => {

    test('Import Users', async ({ page }) => {

        // set up the data
        const emailGeneric = AccountUtils.getRandomEmail(5);
        const key = emailGeneric.split('@')[0];
        const first  = "first" + key;
        const last  = "last" + key;
        let data = "";
        // create 19 rows, appending ".A" through ".S" to make
        // each email address unique (ASCII 65: A, ASCII 83: S)
        for (let i=65;i<=83;i++) {
            let email = emailGeneric.replace(key,key+ "." + String.fromCharCode(i));
            let newLine = '\n' + email + ',' + first + ',' + last + ','+ email + ',,"",Nov-19-2019,,,' + email + ',Agent,DefaultTeam,,,FALSE,TRUE,FALSE,FALSE';
            data = data + newLine;
        }
        // create file to import
        const fileUsersToImport = path.resolve('./e2e/suite02/usersToImport.csv');
        const fs = require('fs');
        fs.writeFileSync(
            fileUsersToImport,
            'Username,First Name,Last Name,Email Address,Mobile Number,Time Zone,Hire Date,Rank,Invite,ACD Login Id,Role Name,Team Name,OS Login,External Identity,Can Be Coached Or Evaluated,Can Be Scheduled,Can Be Recorded,Can Be Analyzed'
            + data
        );

        // login
        const loginPage = new PageObjects.LoginPage(page);
        await loginPage.open();
        await loginPage.login(EnvUtils.getCustom('tenant_username'), EnvUtils.getCustom('tenant_password'));
        let name = await page.innerText('h1.page-title');
        expect(name).toBe('Employees');

        // navigate to import users page
        await page.click('button#importUsers');

        // upload the file
        const handle = await page.$('input[type="file"]');
        await handle.setInputFiles(fileUsersToImport);

        // Click button:has-text("Upload")
        await page.click('button:has-text("Upload")');
        expect(page.url()).toContain('bulkUploadDownload');

        await page.waitForSelector('.toast-message');

        // navigate to Employees list page
        await page.click('#userManagement');
        name = await page.innerText('h1.page-title');
        expect(name).toBe('Employees');
        const label = await page.waitForSelector('text=20 users');
        expect(await label.innerText()).toBe('20 users');

        // remove the file
        fs.unlinkSync(fileUsersToImport);

    });
});
