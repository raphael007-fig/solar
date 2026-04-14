# Google Sheets Setup

## Step 1 – Create your Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet.
2. Name it something like **Solar Equipment Installations**.
3. Copy the **Spreadsheet ID** from the URL:
   `https://docs.google.com/spreadsheets/d/**SPREADSHEET_ID**/edit`

---

## Step 2 – Add the Apps Script

1. In the spreadsheet: **Extensions → Apps Script**
2. Delete the default code and paste this:

```javascript
const SHEET_NAME = 'Submissions'; // change if you want a different tab name

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const rows = data.rows;

    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    let sheet   = ss.getSheetByName(SHEET_NAME);

    // Create the sheet + header row on first run
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Installation ID', 'Facility', 'System Types', 'Date Submitted',
        'Equipment Type', 'Equipment #',
        'System Type', 'Linked Inverter', 'Make', 'Model', 'Serial Number',
        'Quantity', 'Equipment Status',
        'Rated Power', 'Voltage', 'Capacity', 'Battery Type', 'Accessory Type',
        'Integrated Battery', 'Battery Capacity',
        'Warranty Start', 'Warranty End',
        'Maintenance Frequency', 'Last Maintenance', 'Installation Date',
        'General Notes',
      ]);
    }

    rows.forEach(row => {
      sheet.appendRow([
        row.installationId   || '',
        row.facility         || '',
        row.systemTypes      || '',
        row.dateSubmitted    || '',
        row.equipmentType    || '',
        row.equipmentIndex   || '',
        row.systemType       || '',
        row.linkedInverter   || '',
        row.make             || '',
        row.model            || '',
        row.serialNumber     || '',
        row.quantity         || '',
        row.equipmentStatus  || '',
        row.ratedPower       || '',
        row.voltage          || '',
        row.capacity         || '',
        row.batteryType      || '',
        row.accessoryType    || '',
        row.integratedBattery || '',
        row.batteryCapacity  || '',
        row.warrantyStart    || '',
        row.warrantyEnd      || '',
        row.maintenanceFrequency || '',
        row.lastMaintenance  || '',
        row.installationDate || '',
        row.generalNotes     || '',
      ]);
    });

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, rowsAdded: rows.length }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Allow GET for quick health-check
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Save** (name the project anything, e.g. "Solar Equipment API").

---

## Step 3 – Deploy as a Web App

1. Click **Deploy → New deployment**
2. Choose type: **Web app**
3. Description: `Solar Equipment Receiver`
4. Execute as: **Me**
5. Who has access: **Anyone** *(so the app can POST without login)*
6. Click **Deploy** → Authorise when prompted
7. Copy the **Web app URL** — it looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

---

## Step 4 – Add the URL to Vercel

1. In your Vercel project: **Settings → Environment Variables**
2. Add:
   - **Name:** `VITE_GOOGLE_SHEETS_URL`
   - **Value:** *(paste the Web app URL from Step 3)*
3. Redeploy for the variable to take effect.

For local development, create a `.env.local` file in the project root:
```
VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/YOUR_ID/exec
```

---

## How it works

Every time a user completes and submits the 6-step wizard, the app sends all equipment rows to the Apps Script URL. The script appends one row per piece of equipment (inverter, solar panel, battery, accessory) to the **Submissions** tab, so you can filter/sort by Installation ID to see a full submission.
