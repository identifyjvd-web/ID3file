const fs = require('fs');
const path = 'c:/Users/user/Downloads/id25-06-2026/School_Panel.html';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `storeRecordInDb(rec);`;
const replacementStr = `const existingInDb = db.find(r => String(r.id) === String(rec.id));
                        if (existingInDb) {
                            rec._pending = existingInDb._pending;
                            rec._syncStatus = existingInDb._syncStatus;
                            rec._serverSaved = existingInDb._serverSaved;
                        }
                        storeRecordInDb(rec);`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync(path, content, 'utf8');
console.log('Update successful');
