param([string[]]$AdditionalRoots = @())
# Read-only inventory. Never opens Unity, edits a source project, installs, or builds.
$ErrorActionPreference = 'Continue'
$machine = [Environment]::MachineName
$result = [ordered]@{ host = $machine; expectedHost = 'LAPTOP-5K6L9A6M'; timestamp = (Get-Date).ToString('o'); editorGuard = $null; webglModule = $false; candidates = @(); visited = 0; truncated = $false; errors = @() }
if ($machine -ine 'LAPTOP-5K6L9A6M') { $result.errors = @('WRONG_MACHINE: run this inventory on TF-BASE.'); $result | ConvertTo-Json -Depth 8; exit 2 }
$roots = New-Object 'System.Collections.Generic.List[string]'
foreach ($p in @('C:\Projects', (Join-Path $env:USERPROFILE 'Desktop')) + $AdditionalRoots) { if (Test-Path -LiteralPath $p) { $roots.Add($p) } }
$archiveVolumes = @(Get-Volume -ErrorAction SilentlyContinue | Where-Object { $_.FileSystemLabel -eq 'MainData18TB' -and $_.DriveLetter })
foreach ($v in $archiveVolumes) { $roots.Add(([string]$v.DriveLetter + ':\')) }
$guard = 'C:\AIHome\claude\skills\unity-version-guard\scripts\assert-unity-version.ps1'
if (Test-Path -LiteralPath $guard) {
  $PS = if (Get-Command pwsh -ErrorAction SilentlyContinue) { 'pwsh' } else { 'powershell' }
  $raw = & $PS -NoProfile -File $guard -EditorOnly -Json 2>$null
  try { $result.editorGuard = $raw | ConvertFrom-Json } catch { $result.errors += 'Could not parse exact-editor guard output.' }
  if ($result.editorGuard.editorPath) { $result.webglModule = Test-Path -LiteralPath (Join-Path (Split-Path $result.editorGuard.editorPath) 'Data\PlaybackEngines\WebGLSupport') }
} else { $result.errors += 'Version guard not installed; no Unity action is allowed.' }
$namePattern = '(?i)flora|hamster|' + [char]0x80D6
$queue = New-Object 'System.Collections.Generic.Queue[object]'
$seen = New-Object 'System.Collections.Generic.HashSet[string]'
$found = New-Object 'System.Collections.Generic.List[object]'
foreach ($p in $roots) { $queue.Enqueue([pscustomobject]@{ path=$p; depth=0 }) }
while ($queue.Count -gt 0 -and $result.visited -lt 12000) {
  $item = $queue.Dequeue()
  if (-not $seen.Add($item.path.ToLowerInvariant())) { continue }
  $result.visited++
  $pv = Join-Path $item.path 'ProjectSettings\ProjectVersion.txt'
  $matched = $item.path -match $namePattern
  if ((Test-Path -LiteralPath $pv) -and $matched) {
    $head = $null; $branch = $null; $dirty = $null
    if (Get-Command git -ErrorAction SilentlyContinue) { $head = & git -C $item.path rev-parse HEAD 2>$null; $branch = & git -C $item.path branch --show-current 2>$null; $dirty = @(& git -C $item.path status --porcelain 2>$null).Count }
    $found.Add([pscustomobject]@{ path=$item.path; engine='Unity'; version=(Get-Content -LiteralPath $pv -Raw); sourcePresent=((Test-Path -LiteralPath (Join-Path $item.path 'Assets')) -and (Test-Path -LiteralPath (Join-Path $item.path 'Packages'))); gitHead=$head; branch=$branch; changedFiles=$dirty })
    continue
  }
  if ($matched -and $item.depth -le 4) {
    $binaries = @(Get-ChildItem -LiteralPath $item.path -File -ErrorAction SilentlyContinue | Where-Object { $_.Extension -in @('.exe','.uproject','.godot','.zip','.7z','.rar') } | Select-Object -First 12 -ExpandProperty Name)
    if ($binaries.Count) { $found.Add([pscustomobject]@{ path=$item.path; engine='unverified'; sourcePresent=$false; files=$binaries }) }
  }
  if ($item.depth -ge 5) { continue }
  foreach ($d in @(Get-ChildItem -LiteralPath $item.path -Directory -ErrorAction SilentlyContinue)) {
    if (($d.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { continue }
    if ($d.Name -match '^(\.git|Library|Temp|Logs|obj|node_modules|Assets|Packages|ProjectSettings|Windows|Program Files.*|\$.*|System Volume Information)$') { continue }
    $queue.Enqueue([pscustomobject]@{ path=$d.FullName; depth=$item.depth+1 })
  }
}
$result.candidates = $found.ToArray()
$result.truncated = $queue.Count -gt 0
$json = $result | ConvertTo-Json -Depth 8
if ([string]::IsNullOrWhiteSpace($json)) { throw 'Inventory serialization produced empty output.' }
$json
