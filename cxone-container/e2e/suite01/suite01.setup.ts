import { AccountUtils, EnvUtils } from 'cxone-playwright-test-utils';

async function globalSetup() {

    await AccountUtils.createRandomTenantForTestExecution();

    // an example of how to use EnvUtils to send data to a test
    EnvUtils.setCustom('suite','01');

}
export default globalSetup;
