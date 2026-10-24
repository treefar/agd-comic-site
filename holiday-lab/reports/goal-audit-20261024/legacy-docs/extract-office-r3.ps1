# ASCII-only launcher. C# owns all Word COM argument marshaling and cleanup.
$ErrorActionPreference='Stop'
Add-Type -Path (Join-Path $PSScriptRoot 'LegacyDocExtractor.cs') -ReferencedAssemblies 'System','System.Core','System.Web.Extensions'
$result=[LegacyDocExtractor]::Run((Join-Path $PSScriptRoot 'attempt-r3'),'C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-final-docs-20261024/internship/raw')
exit $result
