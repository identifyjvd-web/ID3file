const fs = require('fs');

['School_Panel.html', 'Admin_Panel.html'].forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    // 1. Update UI Preview Card Badge SN logic
    const uiSearch = `SN: \${ (() => {
                                        const isRecVerified = (rec.verified === true || String(rec.verified).toLowerCase() === 'true' || rec.verified === 'Completed');
                                        const si = (schoolConfig.name || "DPS").trim().split(/\\s+/).map(w=>w[0]).join('').toUpperCase() || "DPS";
                                        if (isRecVerified) {
                                            const snVal = rec.sn || '0';
                                            return si + String(snVal).padStart(2, '0');
                                        } else {
                                            return si + 'DRAFT';
                                        }
                                    })() }</div>`;
                                    
    const uiReplace = `SN: \${ (() => {
                                        const isRecVerified = (rec.verified === true || String(rec.verified).toLowerCase() === 'true' || rec.verified === 'Completed');
                                        const si = (schoolConfig.name || "DPS").trim().split(/\\s+/).map(w=>w[0]).join('').toUpperCase() || "DPS";
                                        if (isRecVerified) {
                                            const snVal = rec.sn || '0';
                                            return si + String(snVal).padStart(2, '0');
                                        } else {
                                            return si + 'DRAFT_' + String(rec.createdAt || Date.now()).slice(-6);
                                        }
                                    })() }</div>`;
                                    
    html = html.replace(uiSearch, uiReplace);

    // 2. Update Excel Export SN logic
    const excelSearch = `'Sn': (() => {
                            const isRecVerified = (r.verified === true || String(r.verified).toLowerCase() === 'true' || r.verified === 'Completed');
                            const si = (schoolConfig.name || "DPS").trim().split(/\\s+/).map(w=>w[0]).join('').toUpperCase() || "DPS";
                            if (isRecVerified) {
                                const snVal = r.sn || (index + 1);
                                return si + String(snVal).padStart(2, '0');
                            } else {
                                return si + 'DRAFT';
                            }
                        })(),`;
                        
    const excelReplace = `'Sn': (() => {
                            const isRecVerified = (r.verified === true || String(r.verified).toLowerCase() === 'true' || r.verified === 'Completed');
                            const si = (schoolConfig.name || "DPS").trim().split(/\\s+/).map(w=>w[0]).join('').toUpperCase() || "DPS";
                            if (isRecVerified) {
                                const snVal = r.sn || (index + 1);
                                return si + String(snVal).padStart(2, '0');
                            } else {
                                return si + 'DRAFT_' + String(r.createdAt || Date.now()).slice(-6);
                            }
                        })(),`;
                        
    html = html.replace(excelSearch, excelReplace);

    fs.writeFileSync(file, html);
    console.log(`Updated ${file}`);
});
