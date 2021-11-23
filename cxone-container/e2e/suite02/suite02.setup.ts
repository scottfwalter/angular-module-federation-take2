import { AccountUtils } from 'cxone-playwright-test-utils';

async function globalSetup() {

    await AccountUtils.createRandomTenantForTestExecution();

}
export default globalSetup;
