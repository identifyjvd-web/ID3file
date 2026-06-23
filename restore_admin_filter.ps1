$files = @(
    "c:\Users\Anjuman Chhindwara\Downloads\muhrrm\Admin_Panel.html",
    "c:\Users\Anjuman Chhindwara\Downloads\muhrrm\School_Panel.html"
)

# Literal multiline target and replacement using here-strings
$target = @'
                    if (currentUser && currentUser.userId === 'admin') {
                        // Admin should not see pending records (without photos)
                        if (activeStatusFilter === 'pending' || (!isRecVerified && !hasAppPhoto)) {
                            return false;
                        }
                    }
'@

$replacement = @'
                    if (currentUser && currentUser.userId === 'admin') {
                        if (!isRecVerified) return false;
                    }
'@

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Output "Processing file: $file"
        $content = [System.IO.File]::ReadAllText($file)
        
        # Replace CRLF and LF variations
        $targetCRLF = $target.Replace("`n", "`r`n").Replace("`r`r`n", "`r`n")
        $replacementCRLF = $replacement.Replace("`n", "`r`n").Replace("`r`r`n", "`r`n")
        $targetLF = $target.Replace("`r", "")
        $replacementLF = $replacement.Replace("`r", "")
        
        if ($content.Contains($targetCRLF)) {
            $content = $content.Replace($targetCRLF, $replacementCRLF)
            [System.IO.File]::WriteAllText($file, $content)
            Write-Output "  Successfully restored admin filter (CRLF)"
        } elseif ($content.Contains($targetLF)) {
            $content = $content.Replace($targetLF, $replacementLF)
            [System.IO.File]::WriteAllText($file, $content)
            Write-Output "  Successfully restored admin filter (LF)"
        } else {
            Write-Warning "  Could not find target content in $file"
        }
    } else {
        Write-Error "File not found: $file"
    }
}
