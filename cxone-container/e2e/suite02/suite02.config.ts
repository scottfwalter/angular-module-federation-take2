import { PlaywrightTestConfig } from '@playwright/test';
import { GetBaseConfig } from 'cxone-playwright-test-utils';

if (!process.env.PLAYWRIGHT_BASE_URL) {                                   // This block is only necessary if your
  process.env.PLAYWRIGHT_BASE_URL = 'https://na1.dev.nice-incontact.com'; // local tests point somewhere other than
}                                                                         // http://na1.dev.localhost:8088

const config: PlaywrightTestConfig = {
  ...GetBaseConfig('suite02'),
  globalSetup: require.resolve('./suite02.setup')
}
export default config;
