param([int]$Port = 8785, [switch]$NoBrowser, [switch]$Check)
$ErrorActionPreference = 'Stop'
if ($Check) { Write-Output ('STARTER_PARSE_OK PowerShell ' + $PSVersionTable.PSVersion.ToString()); exit 0 }
$siteRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot 'site'))
if (-not (Test-Path -LiteralPath (Join-Path $siteRoot 'index.html'))) { throw 'Extract the entire ZIP before starting.' }
$listener = New-Object Net.HttpListener
for ($attempt = 0; $attempt -lt 20; $attempt++) {
  $listener.Prefixes.Clear()
  $listener.Prefixes.Add(('http://localhost:' + $Port + '/'))
  try { $listener.Start(); break } catch { if ($attempt -eq 19) { throw }; $Port++ }
}
$url = 'http://localhost:' + $Port + '/#/play/zone'
Write-Host ('Play Zone: ' + $url)
Write-Host 'Keep this window open. Press Ctrl+C to stop.'
if (-not $NoBrowser) { Start-Process $url }
$mime = @{ '.html'='text/html; charset=utf-8'; '.js'='text/javascript; charset=utf-8'; '.mjs'='text/javascript; charset=utf-8'; '.json'='application/json; charset=utf-8'; '.css'='text/css'; '.png'='image/png'; '.webp'='image/webp'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.svg'='image/svg+xml'; '.woff2'='font/woff2'; '.woff'='font/woff'; '.ttf'='font/ttf'; '.wasm'='application/wasm'; '.mp3'='audio/mpeg'; '.ogg'='audio/ogg'; '.wav'='audio/wav'; '.mp4'='video/mp4'; '.ico'='image/x-icon' }
try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    try {
      if ($ctx.Request.HttpMethod -ne 'GET' -and $ctx.Request.HttpMethod -ne 'HEAD') { $ctx.Response.StatusCode = 405; continue }
      $relative = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
      if ($relative -eq '') { $relative = 'index.html' }
      $file = [IO.Path]::GetFullPath((Join-Path $siteRoot $relative))
      if (-not $file.StartsWith($siteRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { $ctx.Response.StatusCode = 403; continue }
      if (-not [IO.File]::Exists($file)) { $ctx.Response.StatusCode = 404; continue }
      $ext = [IO.Path]::GetExtension($file).ToLowerInvariant()
      if ($mime.ContainsKey($ext)) { $ctx.Response.ContentType = $mime[$ext] } else { $ctx.Response.ContentType = 'application/octet-stream' }
      $bytes = [IO.File]::ReadAllBytes($file)
      $ctx.Response.Headers['Cache-Control'] = 'no-cache'
      $ctx.Response.ContentLength64 = $bytes.LongLength
      if ($ctx.Request.HttpMethod -ne 'HEAD') { $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length) }
    } catch { try { $ctx.Response.StatusCode = 500 } catch {} }
    finally { $ctx.Response.Close() }
  }
} finally { $listener.Stop(); $listener.Close() }
