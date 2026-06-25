const fs = require('fs');

['School_Panel.html', 'Admin_Panel.html'].forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    const searchStr = `                            r.updatedAt = Date.now();
                            r.updatedBy = getCurrentUserName();
                            
                            
                            
                            
                            pendingHighlightId = r.id;`;

    const replaceStr = `                            r.updatedAt = Date.now();
                            r.updatedBy = getCurrentUserName();
                            
                            serverCallSilent('updateRecord', [r]);
                            
                            pendingHighlightId = r.id;`;

    if (html.includes(searchStr)) {
        html = html.replace(searchStr, replaceStr);
        fs.writeFileSync(file, html);
        console.log(`Updated ${file}`);
    } else {
        console.log(`Could not find target string in ${file}`);
    }
});
