const common = `
  --require-module ts-node/register
  --require e2e/cucumber/**/*.ts
  --format json:e2e/cucumber/reports/report.json 
  --format message:e2e/cucumber/reports/report.ndjson
  --format html:e2e/cucumber/reports/report.html
  --format summary 
  --format progress-bar 
  --format-options ${JSON.stringify({ snippetInterface: 'async-await' })}
  --publish-quiet
  `;

const getWorldParams = () => {
  const params = {
    foo: 'bar',
  };

  return `--world-parameters ${JSON.stringify({ params })}`;
};

module.exports = {
  default: `${common} ${getWorldParams()}`,
};