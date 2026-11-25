import { readFileSync, appendFileSync } from 'node:fs';

const report = JSON.parse(readFileSync('reports/results.json', 'utf-8'));

// Collect every test result (one per spec x browser)
const results = [];
const walk = (suite) => {
  for (const spec of suite.specs ?? []) {
    const isSmoke = (spec.tags ?? []).some((t) => t.replace('@', '') === 'smoke');
    for (const t of spec.tests) {
      results.push({ title: spec.title, project: t.projectName, status: t.status, isSmoke });
    }
  }
  (suite.suites ?? []).forEach(walk);
};
report.suites.forEach(walk);

const count = (list, status) => list.filter((r) => r.status === status).length;
const smoke = results.filter((r) => r.isSmoke);
const regression = results.filter((r) => !r.isSmoke);
const failed = results.filter((r) => r.status === 'unexpected');

// Decision rules
let decision = '✅ GO';
if (count(smoke, 'unexpected') > 0) decision = '❌ NO-GO: smoke (P1) failure';
else if (failed.length > 0 || count(results, 'flaky') > 0) decision = '⚠️ GO under conditions: regression failures or flaky tests to analyse';

const row = (name, list) =>
  `| ${name} | ${list.length} | ${count(list, 'expected')} | ${count(list, 'unexpected')} | ${count(list, 'flaky')} | ${count(list, 'skipped')} |`;

const lines = [
  `## Release decision: ${decision}`,
  '',
  '| Scope | Total | Passed | Failed | Flaky | Skipped |',
  '|---|---|---|---|---|---|',
  row('Smoke (P1)', smoke),
  row('Regression', regression),
  row('**All**', results),
  '',
  `Duration: ${Math.round(report.stats.duration / 1000)}s`,
];

if (failed.length > 0) {
  lines.push('', '### Failed tests', ...failed.map((f) => `- [${f.project}] ${f.title}${f.isSmoke ? ' **(smoke)**' : ''}`));
}

const markdown = lines.join('\n');
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown + '\n');
else console.log(markdown);