import { PageObjects } from 'cxone-playwright-test-utils';

/**
 * sub page containing specific selectors and methods for a specific page
 */
export default class ImportUserPage extends PageObjects.GenericPage {

    /**
     * overwrite specifc options to adapt it to page object
     */
    open () {
        return super.open('admin/#/bulkUploadDownload');
    }
}
