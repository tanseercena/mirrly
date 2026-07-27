# Google Drive API Setup Guide

## 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "NEW PROJECT"
4. Enter a project name (e.g., "digitally-downloader")
5. Click "CREATE"

## 2. Enable Google Drive API

1. In your new project, go to the navigation menu (☰)
2. Go to "APIs & Services" > "Library"
3. Search for "Google Drive API"
4. Click on it and click "ENABLE"

## 3. Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "+ CREATE CREDENTIALS"
3. Select "Service account"
4. Fill in:
   - Service account name: digitally-downloader
   - Service account ID: digitally-downloader@[PROJECT_ID].iam.gserviceaccount.com
   - Description: Downloads files for Digitally app
5. Click "CREATE AND CONTINUE"
6. Skip adding roles for now (click "CONTINUE")
7. Skip granting users access (click "DONE")

## 4. Generate JSON Key

1. Find your service account in the credentials list
2. Click on the email address
3. Go to the "KEYS" tab
4. Click "ADD KEY" > "Create new key"
5. Select "JSON" as the key type
6. Click "CREATE"
7. The JSON file will download automatically - keep it secure!

## 5. Share Google Drive Files/Folders

1. Open the downloaded JSON file and copy the `client_email` (looks like: digitally-downloader@....gserviceaccount.com)
2. For each Google Drive file/folder you want to download:
   - Right-click the file/folder
   - Click "Share"
   - Add the service account email with "Editor" access
   - Click "Send"

## 6. Configure in Laravel

1. Place the JSON key file in your project:
   ```
   storage/app/google-credentials.json
   ```

2. Add the following to your `.env` file:
   ```
   GOOGLE_DRIVE_SERVICE_ACCOUNT_FILE=/var/www/html/digitally/web/storage/app/google-credentials.json
   GOOGLE_DRIVE_FOLDER_ID=YOUR_ROOT_FOLDER_ID (optional)
   ```

3. Make sure the JSON file has proper permissions:
   ```bash
   chmod 600 storage/app/google-credentials.json
   chown www-data:www-data storage/app/google-credentials.json
   ```

## 7. Folder ID (Optional)

If you want to restrict access to a specific folder:
1. Open the Google Drive folder in your browser
2. Copy the ID from the URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
3. Add it to your `.env` as `GOOGLE_DRIVE_FOLDER_ID`

## Security Notes

- Never commit the JSON credentials file to version control
- The service account email should only be shared with files you want the app to access
- Regularly rotate the service account keys
- Monitor API usage in Google Cloud Console to detect abuse