const fs = require('fs');
let a = fs.readFileSync('Admin_Panel.html', 'utf8');
a = a.split("\\\\'FILL\\\\'").join("\\'FILL\\'");
fs.writeFileSync('Admin_Panel.html', a);
let b = fs.readFileSync('School_Panel.html', 'utf8');
b = b.split("\\\\'FILL\\\\'").join("\\'FILL\\'");
fs.writeFileSync('School_Panel.html', b);
