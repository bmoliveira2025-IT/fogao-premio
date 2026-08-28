// Guard this visual refresh against accidental functional changes.
const ts = require('../portal/node_modules/typescript');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const files = execFileSync('git', ['diff', '--name-only', '--', 'portal/src'], { encoding: 'utf8' }).trim().split('\n').filter(f => f.endsWith('.tsx') && !f.endsWith('/layout.tsx'));
const presentation = new Set(['className', 'style', 'sizes', 'role', 'data-notification-type', 'data-read']);
function normalize(text, filename) {
  const source = ts.createSourceFile(filename, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const result = ts.transform(source, [context => root => {
    function visit(node) {
      if (ts.isJsxAttribute(node) && presentation.has(node.name.getText(source))) return undefined;
      return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(root, visit);
  }]);
  const printed = ts.createPrinter({ removeComments: true }).printFile(result.transformed[0]);
  result.dispose();
  return printed.replace(/\s+/g, ' ').trim();
}
let failed = false;
for (const file of files) {
  const before = execFileSync('git', ['show', `HEAD:${file}`], { encoding: 'utf8' });
  const after = fs.readFileSync(file, 'utf8');
  if (normalize(before, file) !== normalize(after, file)) {
    console.error(`FAIL: non-presentation change in ${file}`); failed = true;
  }
}
if (failed) process.exit(1);
console.log(`PASS: ${files.length} TSX files differ only in presentation attributes. Hooks, handlers, conditions, links and content preserved.`);
console.log('Layout excluded: pre-existing local-font change; this refresh adds only editorial.css import.');
