param(
  [Parameter(Mandatory)][string]$FolderPath, # e.g. "public/frames-elixir"
  [int]$Step = 2                             # 2 = keep every 2nd frame (50% lighter), 3 = keep every 3rd frame (66% lighter)
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $FolderPath)) {
  Write-Error "Folder $FolderPath does not exist."
}

$allFrames = Get-ChildItem -Path "$FolderPath\*.webp" | Sort-Object Name
if ($allFrames.Count -eq 0) {
  Write-Error "No .webp frames found in $FolderPath"
}

$tempFolder = "$FolderPath`_temp"
New-Item -ItemType Directory -Force -Path $tempFolder | Out-Null

$count = 1
for ($i = 0; $i -lt $allFrames.Count; $i += $Step) {
  $newName = "frame-{0:D4}.webp" -f $count
  Copy-Item -Path $allFrames[$i].FullName -Destination "$tempFolder\$newName"
  $count++
}

$newCount = $count - 1

# Replace original folder with temp folder
Remove-Item -Path $FolderPath -Recurse -Force
Rename-Item -Path $tempFolder -NewName (Split-Path $FolderPath -Leaf)

$newFiles = Get-ChildItem -Path "$FolderPath\*.webp"
$mb = ($newFiles | Measure-Object Length -Sum).Sum / 1MB

Write-Host "Success! Reduced '$FolderPath' from $($allFrames.Count) frames to $newCount frames ($([Math]::Round($mb, 1)) MB total)." -ForegroundColor Green
Write-Host "Set frameCount = $newCount in your component code for $FolderPath." -ForegroundColor Yellow
