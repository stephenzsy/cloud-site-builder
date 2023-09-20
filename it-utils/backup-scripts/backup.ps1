param(
    [Parameter(Mandatory)]
    [ValidateSet("full", "incremental")]
    [string]$BackupType
)

$isInc = $BackupType -eq "incremental"

# load config
. .\config.ps1

$backupBasePath = $FullBackupPath
if ($isInc) {
    $backupBasePath = $IncrementalBackupPath
}


if (-not (Test-Path ${WorkDir} -PathType Container) ) {
    throw "Backup work path does not exist or is not a container: $WorkDir"
}

if (-not (Test-Path "$WorkDir\state" -PathType Container) ) {
    New-Item -Path "$WorkDir\state" -ItemType Directory | Out-Null
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
    $lastFullBackupInfo = loadLastBackupInfo $FullBackupPath
    if ($null -eq $lastFullBackupInfo) {
        throw "No full backup found. Please run a full backup first."
    }
    [datetime]::ParseExact("20181010134412", 'yyyyMMddHHmmss', $null)
    
}
else {
    # create full backup at data
    $fullBackupDir = "$dataDir/${startTsString}/full"
    New-Item -Path $fullBackupDir -ItemType Directory | Out-Null
    CreateFullBackup $fullBackupDir
}


