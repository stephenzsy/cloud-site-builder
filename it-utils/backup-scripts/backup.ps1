#Requires -Version 7.3

param(
    [Parameter(Mandatory)]
    [ValidateSet("full", "incremental")]
    [string]$BackupType
)

$isInc = $BackupType -eq "incremental"

# load config
. .\config.ps1

if (-not (Test-Path ${WorkDir} -PathType Container) ) {
    throw "Backup work path does not exist or is not a container: $WorkDir"
}

$stateDir = "$WorkDir\state"
if (-not (Test-Path $stateDir -PathType Container) ) {
    New-Item -Path $stateDir -ItemType Directory | Out-Null
}
$dataDir = "$WorkDir\data"
if (-not (Test-Path $dataDir -PathType Container) ) {
    New-Item -Path $dataDir -ItemType Directory | Out-Null
}

function loadLastBackupInfo($type) {
    $lastBackupInfoPath = "$BackupStateDir/$type-last-backup-info.json"
    if (-not (Test-Path $lastBackupInfoPath -PathType Leaf) ) {
        return $null
    }

    $lastBackupInfo = Get-Content $lastBackupInfoPath | ConvertFrom-Json
    return $lastBackupInfo
}

# mark current date
$startTs = Get-Date
$startTsString = $startTs.ToString("yyyyMMdd-HHmmss")

if ($isInc) {
    # load last full backup
    # do nothing
}
else {
    # create full backup at data
    $fullBackupDir = "$dataDir/${startTsString}/full"
    New-Item -Path $fullBackupDir -ItemType Directory | Out-Null
    $status = CreateFullBackup $fullBackupDir $startTsString
    if ($status) {
        throw "Failed to create full backup ${status}" 
    }
    # write state file
    $startTsString | Out-File -FilePath ${stateDir}/last-full-backup-ts.txt
    Write-Host "Created full backup at $startTsString"
}


