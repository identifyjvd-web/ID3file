const fs = require('fs');
const path = 'c:/Users/user/Downloads/id25-06-2026/School_Panel.html';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `const isVerified = rec && rec.verified && String(rec.verified).toLowerCase() !== 'false';
                        const modalTitle = isVerified ? 'Verified & Saved Successfully' : 'Saved Successfully';
                        showModal('success', modalTitle, '', null, 'Yes, Delete', \`\${(n || '').trim()}'s Data\`);`;

const replacementStr = `if (eid) {
                            const isVerified = rec && rec.verified && String(rec.verified).toLowerCase() !== 'false';
                            const modalTitle = isVerified ? 'Verified & Saved Successfully' : 'Saved Successfully';
                            showModal('success', modalTitle, '', null, 'Yes, Delete', \`\${(n || '').trim()}'s Data\`);
                        }`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync(path, content, 'utf8');
console.log('Update successful');
