const fs = require('fs');

['Admin_Panel.html'].forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    let originalHtml = html;
    
    html = html.replace(/r\.updatedBy = getCurrentUserName\(\);\s*pendingHighlightId = r\.id;/g,
    `r.updatedBy = getCurrentUserName();
                            
                            serverCallSilent('updateRecord', [r]);
                            
                            pendingHighlightId = r.id;`);

    if(html !== originalHtml) {
        fs.writeFileSync(file, html);
        console.log(`Updated ${file}`);
    } else {
        console.log(`Could not find target string in ${file}`);
    }
});
