# Only the empty Word process created by the failed extraction; never all WINWORD processes.
$ErrorActionPreference='Stop'
$targetId=41452
$stage=Get-Content -LiteralPath (Join-Path $PSScriptRoot 'office-stage.json') -Raw | ConvertFrom-Json
if ($stage.stage -ne 'creating-dedicated-instance') { throw 'Unexpected stage; cleanup guard rejected' }
$created=[DateTime]::Parse($stage.at).ToUniversalTime()
$target=Get-Process -Id $targetId -ErrorAction SilentlyContinue
$row=@{ at=[DateTime]::UtcNow.ToString('o'); target_id=$targetId; original_stage=$stage.stage; action='already-exited'; closed=$false }
if ($null -ne $target) {
  $wordIds=@(Get-Process -Name WINWORD -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Id)
  if ($target.ProcessName -ne 'WINWORD' -or $wordIds.Count -ne 1 -or $wordIds[0] -ne $targetId) { throw 'Word process identity guard rejected' }
  $start=$target.StartTime.ToUniversalTime()
  if ([Math]::Abs(($start-$created).TotalSeconds) -gt 10) { throw 'Word start-time guard rejected' }
  if ($target.MainWindowHandle -ne [IntPtr]::Zero -or -not [String]::IsNullOrEmpty($target.MainWindowTitle)) { throw 'Visible/user Word window; cleanup refused' }
  if (Test-Path -LiteralPath (Join-Path $PSScriptRoot 'input-recognition.doc')) { throw 'Unexpected document-open stage; cleanup refused' }
  $row.start_time=$start.ToString('o')
  $row.main_window_handle=$target.MainWindowHandle.ToInt64()
  $row.action='stop-only-owned-empty-process'
  Stop-Process -Id $targetId -Force
  [void]$target.WaitForExit(10000)
}
$row.closed=$null -eq (Get-Process -Id $targetId -ErrorAction SilentlyContinue)
$row.remaining_word_ids=@(Get-Process -Name WINWORD -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Id)
$json=ConvertTo-Json -InputObject $row -Depth 5
if ([String]::IsNullOrWhiteSpace($json)) { throw 'Refuse empty cleanup JSON' }
[System.IO.File]::WriteAllText((Join-Path $PSScriptRoot 'cleanup-result.json'),$json,(New-Object System.Text.UTF8Encoding($false)))
Write-Output $json
if (-not $row.closed) { exit 1 }
