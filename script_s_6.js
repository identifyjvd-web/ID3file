
    (function() {
        let touchstartX = 0;
        let touchstartY = 0;
        const SWIPE_THRESHOLD = 50; 
        const EDGE_THRESHOLD = 50; 

        document.addEventListener('touchstart', e => {
            if (!e.changedTouches || e.changedTouches.length === 0) return;
            touchstartX = e.changedTouches[0].screenX;
            touchstartY = e.changedTouches[0].screenY;
        }, {passive: true});

        document.addEventListener('touchend', e => {
            if (!e.changedTouches || e.changedTouches.length === 0) return;
            const touchendX = e.changedTouches[0].screenX;
            const touchendY = e.changedTouches[0].screenY;
            
            if (touchstartX > EDGE_THRESHOLD) return;
            
            const deltaX = touchendX - touchstartX;
            const deltaY = Math.abs(touchendY - touchstartY);
            
            if (deltaX > SWIPE_THRESHOLD && deltaX > deltaY * 1.5) {
                handleGlobalSwipeBack();
            }
        }, {passive: true});

        function isVisible(el) {
            if (!el) return false;
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.opacity !== '0' && style.visibility !== 'hidden' && !el.classList.contains('hidden') && !el.classList.contains('translate-y-full');
        }

        function handleGlobalSwipeBack() {
            if (isVisible(document.getElementById('crop-modal'))) {
                if(typeof closeCropModal === 'function') closeCropModal();
                return;
            }
            if (isVisible(document.getElementById('custom-modal'))) {
                if(typeof closeModal === 'function') closeModal();
                return;
            }
            if (isVisible(document.getElementById('student-detail-popup'))) {
                if(typeof closeStudentDetailPopup === 'function') closeStudentDetailPopup();
                return;
            }
            if (isVisible(document.getElementById('account-modal'))) {
                if(typeof closeAccountModal === 'function') closeAccountModal();
                return;
            }
            if (isVisible(document.getElementById('school-config'))) {
                if(typeof closeSchoolConfig === 'function') closeSchoolConfig();
                return;
            }
            if (isVisible(document.getElementById('import-export-modal'))) {
                if(typeof closeImportExportModal === 'function') closeImportExportModal();
                return;
            }
            if (isVisible(document.getElementById('student-form-section'))) {
                if(typeof closeStudentForm === 'function') closeStudentForm();
                return;
            }
        }
    })();
    
