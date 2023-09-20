$WorkDir = "./"
$MariaBackupExe = "mariabackup.exe" # configure for production
$MariaBackupParameters = @("--user=mariabackup", "--password=mypassword", "--databases", "mysql") # configure for production
$IsAzureArcEnabled = $false
$StorageAccountName = "myaccount" # configure for production
$StorageBlobContainerName = "mycontainer" #configure for production
$IsTest = $true # change to $false this for production
$FullbackupCloudRetentionDays = 1 # configure for production

function ObtainStorageAccessTokenInAzureArc {    
    $apiVersion = "2021-02-01"
    $resource = "https://storage.azure.com/"
    $endpoint = "{0}?resource={1}&api-version={2}" -f $env:IDENTITY_ENDPOINT, $resource, $apiVersion
    $secretFile = ""
    Invoke-RestMethod -Method GET -Uri $endpoint -Headers @{Metadata = 'True' } -SkipHttpErrorCheck -ResponseHeadersVariable respHeaders | Out-Null
    $wwwAuthHeader = $_.Exception.Response.Headers["WWW-Authenticate"]
    if ($wwwAuthHeader -match "Basic realm=.+") {
        $secretFile = ($wwwAuthHeader -split "Basic realm=")[1]
    }
    $secret = Get-Content -Raw $secretFile
    $response = Invoke-RestMethod -Method GET -Uri $endpoint -Headers @{Metadata = 'True'; Authorization = "Basic $secret" }
    if ($response) {
        $token = (ConvertFrom-Json -InputObject $response.Content).access_token        
        return $token
    }
}

function UploadToAzureBlobStorageInAzureArc([string]$filename, [string]$blobKey, [hashtable]$metadata, [int]$retentionDays = 0) {
    $token = ObtainStorageAccessTokenInAzureArc
    if ([string]::IsNullOrEmpty($token)) {
        throw "Failed to obtain storage access token"
    }
    # put blob
    $headers = @{
        "Authorization"  = "Bearer $token"
        "Content-Type"   = "application/zip"
        "x-ms-version"   = "2023-08-03"
        "x-ms-blob-type" = "BlockBlob"      
    }
    if ($retentionDays -gt 0) {
        $now = (Get-Date).ToUniversalTime()
        $untilDate = $now.AddDays($retentionDays)
        $headers["x-ms-immutability-policy-until-date"] = $untilDate.ToString("R")
    }
    if ($metadata) {
        foreach ($key in $metadata.Keys) {
            $headers["x-ms-meta-$key"] = $metadata[$key]
        }
    }
    & az rest --method put `
        --headers (ConvertTo-Json -InputObject $headers -Compress)`
        --url "https://${StorageAccountName}.blob.core.windows.net/${StorageBlobContainerName}/${blobKey}" `
        --body "@$filename"
}

function UploadToAzureBlobStorage([string]$filename, [string]$blobKey, [hashtable]$metadata, [int] $retentionDays) {
    if ($IsAzureArcEnabled ) {
        UploadToAzureBlobStorageInAzureArc $filename $blobKey $metadata $retentionDays
    }
}

function MariaBackupInfoToMap([string]$filename) {
    $hash = @{}
    foreach ($line in Get-Content $filename) {
        $parts = $line -split "="
        if ($parts.Length -eq 2) {
            $hash[$parts[0].Trim()] = $parts[1].Trim()
        }    
    }
    return $hash
}

function CreateFullBackup([string]$backupDir, [string]$timestampKey) {
    $cloudRetentionDays = $FullbackupCloudRetentionDays
    $dataDir = "${backupDir}/data"
    if ($IsTest) {
        New-Item -ItemType Directory -Path $dataDir | Out-Null
        Write-Output "backup_type = full-backuped`nfrom_lsn = 0`nto_lsn = fake1000`nlast_lsn = fake1001`n" > ${dataDir}/xtrabackup_checkpoints
        $cloudRetentionDays = 1
    }
    else {
        & ${MariaBackupExe} --backup "--target-dir=${dataDir}" @MariaBackupParameters `
            3>&1 > ${backupDir}/mariabackup.log 2> ${backupDir}/mariabackup.err
    }
    $exitCode = $LASTEXITCODE
    if ($exitCode -ne 0) {
        throw "mariabackup full failed with exit code $exitCode"
    }
    
    # parse xtrabackup_checkpoints
    $m = MariaBackupInfoToMap "${dataDir}/xtrabackup_checkpoints"
    $toLsn = $m["to_lsn"]
    # create zip file
    Compress-Archive -Path ${dataDir}, ${backupDir}/*.log, ${backupDir}/*.err -DestinationPath "${backupDir}/${toLsn}.zip"
    
    # send to blob storage    
    UploadToAzureBlobStorage "${backupDir}/${toLsn}.zip" `
    ("{0}/full/{1}.zip" -f $timestampKey, $toLsn) `
        $m $cloudRetentionDays > ${backupDir}/upload.log 2> ${backupDir}/upload.err
    $uploadStatus = $LASTEXITCODE
    if ($uploadStatus -ne 0) {
        throw "Failed to upload backup to blob storage. Exit code: $uploadStatus"
    }
    return 0
}

function CreateIncrementalBackup([string]$backupDir, [string]$fromDir) {
    # change to script to create incremental backup
    Write-Output "Inc backup based on $f" > $backupDir/inc-backup.txt
}
