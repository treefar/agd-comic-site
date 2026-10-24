# ASCII-only, one permitted method repair. Original failed attempt stays intact.
$ErrorActionPreference = 'Stop'
$outDir = Join-Path $PSScriptRoot 'attempt-r2'
if (Test-Path -LiteralPath $outDir) { throw 'Fresh attempt-r2 directory required' }
[void][System.IO.Directory]::CreateDirectory($outDir)
$inputDir = 'C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-final-docs-20261024/internship/raw'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$word = $null
$document = $null
$ownedProcessId = 0
$oldLinkSetting = $null
$rows = New-Object 'System.Collections.Generic.List[object]'
$beforeIds = @(Get-Process -Name WINWORD -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Id)
function Write-JsonFile($name, $value) {
  $serialized = ConvertTo-Json -InputObject $value -Depth 12
  if ([String]::IsNullOrWhiteSpace($serialized)) { throw 'Refuse empty JSON serialization' }
  [System.IO.File]::WriteAllText((Join-Path $outDir $name), $serialized, $utf8)
}
function Write-Stage($stage) {
  Write-JsonFile 'office-stage.json' @{ stage=$stage; at=[DateTime]::UtcNow.ToString('o'); owned_process_id=$ownedProcessId; powershell_pid=$PID }
  Write-Output ('STAGE ' + $stage)
}
function Assert-OwnedHidden {
  $current = @(Get-Process -Name WINWORD -ErrorAction SilentlyContinue)
  $newIds = @($current | Where-Object { $beforeIds -notcontains $_.Id } | Select-Object -ExpandProperty Id)
  if ($newIds.Count -ne 1 -or $newIds[0] -ne $ownedProcessId) { throw 'No unique new Word process; will not use/close existing user Word' }
  $owned = Get-Process -Id $ownedProcessId -ErrorAction Stop
  if ($owned.MainWindowHandle -ne [IntPtr]::Zero -or -not [String]::IsNullOrEmpty($owned.MainWindowTitle) -or $word.Visible) { throw 'Unexpected visible Word window; stopping' }
}
$doNotSave = [object]0
$missing = [object][Type]::Missing
try {
  Write-JsonFile 'process-before.json' @{ ids=$beforeIds; at=[DateTime]::UtcNow.ToString('o') }
  Write-Stage 'creating-dedicated-instance'
  $word = New-Object -ComObject Word.Application
  $word.Visible = $false
  $word.DisplayAlerts = 0
  $word.AutomationSecurity = 3
  $oldLinkSetting = $word.Options.UpdateLinksAtOpen
  $word.Options.UpdateLinksAtOpen = $false
  $newIds = @(Get-Process -Name WINWORD -ErrorAction SilentlyContinue | Where-Object { $beforeIds -notcontains $_.Id } | Select-Object -ExpandProperty Id)
  if ($newIds.Count -ne 1) { throw 'Cannot prove a unique dedicated new Word process' }
  $ownedProcessId = [int]$newIds[0]
  Assert-OwnedHidden
  if ($word.Documents.Count -ne 0) { throw 'Unexpected pre-existing document in new instance' }
  $owned = Get-Process -Id $ownedProcessId
  Write-JsonFile 'office-instance.json' @{ owned_process_id=$ownedProcessId; start_time=$owned.StartTime.ToUniversalTime().ToString('o'); prior_word_ids=$beforeIds; dedicated_new_instance=$true; application_visible=$word.Visible; main_window_handle=$owned.MainWindowHandle.ToInt64(); word_version=$word.Version; automation_security=$word.AutomationSecurity; display_alerts=$word.DisplayAlerts; update_links_at_open=$word.Options.UpdateLinksAtOpen }
  foreach ($name in @('recognition','evaluation')) {
    Assert-OwnedHidden
    $source = Join-Path $inputDir ('department-' + $name + '.doc')
    $copy = Join-Path $outDir ('input-' + $name + '.doc')
    [System.IO.File]::Copy($source, $copy, $false)
    Write-Stage ('opening-read-only-' + $name)
    $fileName=[object]$copy; $confirm=[object]$false; $readOnly=[object]$true; $mru=[object]$false
    $revert=[object]$false; $visible=[object]$false; $conflict=[object]$false; $repair=[object]$false; $noEncoding=[object]$true
    $document = $word.Documents.Open([ref]$fileName,[ref]$confirm,[ref]$readOnly,[ref]$mru,[ref]$missing,[ref]$missing,[ref]$revert,[ref]$missing,[ref]$missing,[ref]$missing,[ref]$missing,[ref]$visible,[ref]$conflict,[ref]$repair,[ref]$missing,[ref]$noEncoding)
    Assert-OwnedHidden
    if (-not $document.ReadOnly) { throw 'Read-only contract not met' }
    Write-Stage ('extracting-' + $name)
    $text=[string]$document.Content.Text
    $xml=[string]$document.WordOpenXML
    [System.IO.File]::WriteAllText((Join-Path $outDir ($name+'-content.txt')),$text,$utf8)
    [System.IO.File]::WriteAllText((Join-Path $outDir ($name+'-flat.xml')),$xml,$utf8)
    $tables=New-Object 'System.Collections.Generic.List[object]'
    for ($ti=1; $ti -le $document.Tables.Count; $ti++) {
      $table=$document.Tables.Item($ti)
      $cells=New-Object 'System.Collections.Generic.List[object]'
      foreach ($cell in $table.Range.Cells) { $cells.Add(@{ row=$cell.RowIndex; column=$cell.ColumnIndex; text=[string]$cell.Range.Text }) }
      $tables.Add(@{ table=$ti; range_text=[string]$table.Range.Text; cells=$cells.ToArray() })
    }
    $row=@{ name=$name; source=$source; opened_copy=$copy; read_only=$document.ReadOnly; text_characters=$text.Length; flat_xml_characters=$xml.Length; tables=$tables.ToArray(); table_count=$document.Tables.Count; inline_shapes=$document.InlineShapes.Count; shapes=$document.Shapes.Count; paragraphs=$document.Paragraphs.Count; fields=$document.Fields.Count; saved=$document.Saved }
    Write-JsonFile ($name+'-office.json') $row
    $rows.Add($row)
    $document.Close([ref]$doNotSave,[ref]$missing,[ref]$missing)
    [void][System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($document)
    $document=$null
    Write-Stage ('closed-no-save-'+$name)
  }
  Write-JsonFile 'office-results.json' $rows.ToArray()
  Write-Output ('SUCCESS documents='+$rows.Count)
} catch {
  Write-JsonFile 'office-error.json' @{ at=[DateTime]::UtcNow.ToString('o'); error=$_.Exception.Message; owned_process_id=$ownedProcessId }
  throw
} finally {
  if ($null -ne $document) { $document.Close([ref]$doNotSave,[ref]$missing,[ref]$missing); [void][System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($document); $document=$null }
  if ($null -ne $word) {
    if ($null -ne $oldLinkSetting) { $word.Options.UpdateLinksAtOpen=$oldLinkSetting }
    $word.Quit([ref]$doNotSave,[ref]$missing,[ref]$missing)
    [void][System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($word)
    $word=$null
  }
  [GC]::Collect()
  [GC]::WaitForPendingFinalizers()
  Write-Stage 'dedicated-instance-quit-no-save'
}
