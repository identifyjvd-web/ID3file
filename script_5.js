
    function buildImportExportHtml() {
        return `
            <div class="p-6 bg-white rounded-3xl system-card flex flex-col items-start w-full max-w-md mx-auto mb-20">
                <div class="w-full space-y-4">
                    
                    <!-- Export Content -->
                    <div id="ie-content-export" class="space-y-4 block w-full">
                        <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm w-full">
                            <h3 class="text-[11px] font-black text-slate-800 mb-3 uppercase tracking-wider flex items-center gap-2"><i class="fa-solid fa-table-columns text-blue-500"></i> Select Fields to Export</h3>
                            <div id="ie-export-fields-grid" class="grid grid-cols-2 gap-2">
                                <!-- Injected by JS -->
                            </div>
                        </div>
                        
                        <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4 w-full">
                            <h3 class="text-[11px] font-black text-slate-800 mb-2 uppercase tracking-wider flex items-center gap-2"><i class="fa-solid fa-sliders text-blue-500"></i> Advanced Options</h3>
                            
                            <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer hover:bg-blue-50 transition w-full">
                                <input type="checkbox" id="ie-export-photos" class="w-4 h-4 accent-blue-600">
                                <div class="flex-1">
                                    <p class="text-[13px] font-bold text-slate-800">Include Photos</p>
                                    <p class="text-[10px] text-slate-500 leading-tight mt-0.5">Downloads images into a separate folder</p>
                                </div>
                            </label>
                            
                            <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer hover:bg-blue-50 transition w-full">
                                <input type="checkbox" id="ie-export-qr" onchange="ie_toggleExportQrFields()" class="w-4 h-4 accent-blue-600">
                                <div class="flex-1">
                                    <p class="text-[13px] font-bold text-slate-800">Generate QR Codes</p>
                                    <p class="text-[10px] text-slate-500 leading-tight mt-0.5">Creates QR code images for each record</p>
                                </div>
                            </label>
                            
                            <div id="ie-export-qr-options" class="hidden pl-8 pr-3 py-3 mt-2 border-l-2 border-blue-200 w-full">
                                <p class="text-[10px] font-bold text-slate-600 mb-2 uppercase tracking-wider">Select QR Data Fields</p>
                                <div id="ie-export-qr-fields-grid" class="grid grid-cols-2 gap-2">
                                    <!-- Injected by JS -->
                                </div>
                            </div>
                        </div>
                        
                        <button onclick="ie_runExport()" id="ie-btn-export" class="w-full py-3.5 rounded-xl bg-blue-600 text-white font-black text-[13px] uppercase tracking-widest hover:bg-blue-700 transition active:scale-[0.98] shadow-md flex items-center justify-center gap-2 mt-2">
                            <i class="fa-solid fa-download"></i> Export Now
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function openImportExportModal() {
        setBlankRecordMode('import_export');
        setTimeout(() => {
            ie_renderExportFields();
        }, 50);
    }
    
    function closeImportExportModal() {
        // Obsolete
    }
    
    function ie_switchTab(tab) {
        // Obsolete
    }
    
    function ie_renderExportFields() {
        const grid = document.getElementById('ie-export-fields-grid');
        const qrGrid = document.getElementById('ie-export-qr-fields-grid');
        let html = `<label class="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50"><input type="checkbox" value="_timestamp" class="ie-export-cb accent-blue-600 w-4 h-4" checked><span class="text-xs font-bold text-slate-700 truncate">Timestamp</span></label>`;
        let qrHtml = `<label class="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer hover:bg-blue-50"><input type="checkbox" value="id" class="ie-qr-cb accent-blue-600 w-3.5 h-3.5" checked><span class="text-[10px] font-bold text-slate-700 truncate">System ID</span></label>`;
        
        fb_form_order.forEach(id => {
            let f = null;
            let label = '';
            if (FB_STANDARD_FIELDS.some(sf => sf.id === id)) {
                const stdField = FB_STANDARD_FIELDS.find(sf => sf.id === id);
                if (!fb_standard_config[id] || fb_standard_config[id].enabled) {
                    f = stdField;
                    label = fb_getStandardLabel(id, stdField.label);
                }
            } else {
                f = fb_fields.find(cf => cf.id === id);
                if (f) label = f.label;
            }
            if (f && f.type !== 'section' && f.type !== 'image' && f.id !== 'photo') {
                html += `<label class="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50"><input type="checkbox" value="${f.id}" class="ie-export-cb accent-blue-600 w-4 h-4" checked><span class="text-xs font-bold text-slate-700 truncate">${label}</span></label>`;
                qrHtml += `<label class="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer hover:bg-blue-50"><input type="checkbox" value="${f.id}" class="ie-qr-cb accent-blue-600 w-3.5 h-3.5"><span class="text-[10px] font-bold text-slate-700 truncate">${label}</span></label>`;
            }
        });
        grid.innerHTML = html;
        qrGrid.innerHTML = qrHtml;
    }
    
    function ie_toggleExportQrFields() {
        const qrOpts = document.getElementById('ie-export-qr-options');
        if (document.getElementById('ie-export-qr').checked) {
            qrOpts.classList.remove('hidden');
        } else {
            qrOpts.classList.add('hidden');
        }
    }
    
    async function ie_runExport() {
        const btn = document.getElementById('ie-btn-export');
        const origHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Preparing...';
        btn.disabled = true;
        
        try {
            const selectedFields = Array.from(document.querySelectorAll('.ie-export-cb:checked')).map(cb => cb.value);
            const includePhotos = document.getElementById('ie-export-photos').checked;
            const includeQr = document.getElementById('ie-export-qr').checked;
            const qrFields = Array.from(document.querySelectorAll('.ie-qr-cb:checked')).map(cb => cb.value);
            
            const zip = new JSZip();
            const exportData = [];
            const photoFolder = includePhotos ? zip.folder("Photos") : null;
            const qrFolder = includeQr ? zip.folder("QR_Codes") : null;
            
            for (let i = 0; i < db.length; i++) {
                const rec = db[i];
                let row = { 'System ID': rec.id };
                
                selectedFields.forEach(id => {
                    if (id === '_timestamp') {
                        row['Timestamp'] = rec.createdAt ? new Date(rec.createdAt).toLocaleString('en-IN') : (rec.updatedAt ? new Date(rec.updatedAt).toLocaleString('en-IN') : '');
                        return;
                    }
                    let label = id;
                    if (FB_STANDARD_FIELDS.some(sf => sf.id === id)) {
                        label = fb_getStandardLabel(id, FB_STANDARD_FIELDS.find(sf => sf.id === id).label);
                    } else {
                        const f = fb_fields.find(cf => cf.id === id);
                        if (f) label = f.label;
                    }
                    row[label] = rec[id] || '';
                });
                exportData.push(row);
                
                const safeName = ((rec.studentName || rec.name || rec.title || 'Unknown') + '').replace(/[^a-zA-Z0-9]/g, '_');
                const safeId = String(rec.id || 'NID');
                const baseFileName = `${safeName}_${safeId.substring(Math.max(0, safeId.length - 4))}`;
                
                if (includePhotos) {
                    let photoUrl = rec.docUrl || rec.photoData;
                    if (photoUrl) {
                        try {
                            if (photoUrl.startsWith('data:image')) {
                                const base64Data = photoUrl.split(',')[1];
                                photoFolder.file(`Photo_${baseFileName}.jpg`, base64Data, {base64: true});
                            } else {
                                photoUrl = fixDriveImageUrl(photoUrl);
                                const response = await fetch(photoUrl, { mode: 'cors' });
                                if (response.ok) {
                                    const blob = await response.blob();
                                    photoFolder.file(`Photo_${baseFileName}.jpg`, blob);
                                }
                            }
                        } catch(e) {}
                    }
                }
                
                if (includeQr) {
                    let qrVal = "";
                    if (qrFields.length === 1 && qrFields[0] === 'id') {
                        qrVal = String(rec.id);
                    } else {
                        const obj = {};
                        qrFields.forEach(f => { obj[f] = rec[f] || ""; });
                        qrVal = JSON.stringify(obj);
                    }
                    try {
                        const qr = new QRious({ value: qrVal, size: 300, level: 'H' });
                        const qrBase64 = qr.toDataURL().split(',')[1];
                        qrFolder.file(`QR_${baseFileName}.png`, qrBase64, {base64: true});
                    } catch(e) {}
                }
                
                // Yield to main thread every 10 records to prevent browser freeze/crash
                if (i > 0 && i % 10 === 0) {
                    await new Promise(r => setTimeout(r, 0));
                }
            }
            
            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Exported_Data");
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            zip.file("Data_Export.xlsx", excelBuffer);
            
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Zipping...';
            const content = await zip.generateAsync({type:"blob"});
            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(content);
            downloadLink.download = `System_Export_${new Date().toISOString().split('T')[0]}.zip`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            showToast("Export Completed Successfully");
        } catch(err) {
            console.error(err);
            showToast("Error during export: " + err.message, true);
        } finally {
            btn.innerHTML = origHTML;
            btn.disabled = false;
        }
    }
    

    
