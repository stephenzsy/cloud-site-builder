$WorkDir = "./"

function CreateFullBackup([string]$backupDir) {
    # change to script to create full backup
    Write-Output "Full backup" > $backupDir/full-backup.txt
}

function CreateIncrementalBackup([string]$backupDir, [string]$fromDir) {
    # change to script to create incremental backup
    Write-Output "Inc backup based on $f" > $backupDir/inc-backup.txt
}