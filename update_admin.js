const fs = require('fs');
const path = 'c:/Users/user/Downloads/id25-06-2026/Admin_Panel.html';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(`let activeStatusFilter = 'all';`, `let activeStatusFilter = 'verified';`);

const swipeRegex = /function handleHomeSwipe\(direction\)\s*\{[\s\S]*?setChipFilter\('status', statuses\[currentIndex\]\);\s*\}/g;
content = content.replace(swipeRegex, `function handleHomeSwipe(direction) {\n                // Swipe disabled in Admin Panel\n            }`);

const btnRegex = /<button id="btn-all-data"[\s\S]*?id="btn-pending"[\s\S]*?<\/button>/g;
content = content.replace(btnRegex, '');

fs.writeFileSync(path, content, 'utf8');
console.log('Update successful');
