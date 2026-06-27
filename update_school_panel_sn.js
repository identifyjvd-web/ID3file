const fs = require('fs');
const path = 'c:/Users/user/Downloads/id25-06-2026/School_Panel.html';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `sn: existing ? existing.sn : 0,`;
const replacementStr = `sn: nextSn,`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync(path, content, 'utf8');
console.log('Update successful');
