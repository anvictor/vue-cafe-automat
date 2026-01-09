# Client Resources Apps Script Setup Guide

## Overview

This Google Apps Script manages the client coffee machine's resource inventory, providing persistent storage in Google Sheets.

## Prerequisites

- Google Account
- Access to Google Sheets: `https://docs.google.com/spreadsheets/d/1y_Hml8869168BClaawxVOQ7lVuIheIIkmnNx03NRITE/`

## Step 1: Open Apps Script Editor

1. Open your Google Sheet
2. Click **Extensions → Apps Script**
3. You should see the Apps Script editor

## Step 2: Create New Script File

1. In the Apps Script editor, click the **+** button next to "Files"
2. Select **Script**
3. Name it: `ClientResources`
4. Delete any default code

## Step 3: Copy the Script Code

1. Open the file: `server/google-apps-script/client-resources.gs`
2. Copy ALL the code
3. Paste it into the `ClientResources.gs` file in Apps Script editor
4. Click **Save** (💾 icon)

## Step 4: Test the Script (Optional but Recommended)

1. In the Apps Script editor, select the function `testScript` from the dropdown
2. Click **Run** (▶️ icon)
3. **First time only**: You'll need to authorize the script
   - Click **Review permissions**
   - Choose your Google account
   - Click **Advanced**
   - Click **Go to [Your Project Name] (unsafe)**
   - Click **Allow**
4. Check the **Execution log** - you should see inventory data
5. Open your Google Sheet - you should see a new sheet called "ClientResources"

## Step 5: Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description**: `Client Resources API`
   - **Execute as**: `Me (your@email.com)`
   - **Who has access**: `Anyone`
5. Click **Deploy**
6. **Important**: Copy the **Web app URL**
   - It looks like: `https://script.google.com/macros/s/AKfycby.../exec`
   - Save this URL - you'll need it for the frontend

## Step 6: Configure Frontend

1. Open `.env.development` in your project
2. Add the Apps Script URL:
   ```bash
   VITE_CLIENT_RESOURCES_URL=https://script.google.com/macros/s/AKfycby.../exec

   ```

  <!-- https://script.google.com/macros/s/AKfycbwshptJI8h7981t7Q1-qNPYTh0NA6wjkmWTSwnaNI-iYVXjvhwu58OvRkOd_ukoNJ1N/exec 
  
  AKfycbwshptJI8h7981t7Q1-qNPYTh0NA6wjkmWTSwnaNI-iYVXjvhwu58OvRkOd_ukoNJ1N
  -->

3. Save the file
4. Restart your dev server: `npm run dev`

## Step 7: Verify Integration

1. Open the app: `http://localhost:5174/`
2. Open browser console (F12)
3. Look for: `[ClientResources] Loaded from Google Sheets: {...}`
4. Make a coffee
5. Check Google Sheet - amounts should decrease
6. Reload page
7. Verify resources match Google Sheet

## Sheet Structure

The script automatically creates a "ClientResources" sheet:

| Resource  | Amount | Unit |
| --------- | ------ | ---- |
| water     | 300    | ml   |
| coffee    | 28     | g    |
| milk      | 300    | ml   |
| smallCups | 10     | pcs  |
| largeCups | 8      | pcs  |
| stirrers  | 10     | pcs  |
| sugar     | 10     | pcs  |

## API Endpoints

### GET - Read Inventory

```bash
GET https://script.google.com/macros/s/AKfycby.../exec
```

**Response:**

```json
{
  "success": true,
  "data": {
    "water": 300,
    "coffee": 28,
    "milk": 300,
    "smallCups": 10,
    "largeCups": 8,
    "stirrers": 10,
    "sugar": 10
  },
  "timestamp": "2026-01-08T17:00:00.000Z"
}
```

### POST - Consume Resources

```bash
POST https://script.google.com/macros/s/AKfycby.../exec
Content-Type: application/json

{
  "action": "consume",
  "ingredients": {
    "water": 30,
    "coffee": 7,
    "milk": 0,
    "cup": "small",
    "sugar": 2,
    "stirrer": true
  }
}
```

### POST - Refill Resources

```bash
POST https://script.google.com/macros/s/AKfycby.../exec
Content-Type: application/json

{
  "action": "refill",
  "amounts": {
    "water": 300,
    "coffee": 28,
    "smallCups": 10
  }
}
```

### POST - Update Inventory

```bash
POST https://script.google.com/macros/s/AKfycby.../exec
Content-Type: application/json

{
  "action": "update",
  "inventory": {
    "water": 500,
    "coffee": 50,
    "milk": 400,
    "smallCups": 20,
    "largeCups": 15,
    "stirrers": 30,
    "sugar": 25
  }
}
```

## Troubleshooting

### Error: "Script function not found: doGet"

- Make sure you copied ALL the code from `client-resources.gs`
- Click **Save** in Apps Script editor

### Error: "Authorization required"

- Run `testScript()` function first to authorize
- Follow the authorization steps in Step 4

### Resources not updating in Sheet

- Check browser console for errors
- Verify `VITE_CLIENT_RESOURCES_URL` is set correctly
- Check Apps Script **Executions** log for errors

### Sheet not created

- Run `testScript()` function manually
- Or just open the Web App URL in browser - it will create the sheet

## Security Notes

- **Execute as: Me** - Script runs with your permissions
- **Access: Anyone** - Anyone with the URL can call the API
- The URL is secret - don't share it publicly
- For production, consider using Google Cloud Project with proper authentication

## Updating the Script

If you need to update the script:

1. Edit the code in Apps Script editor
2. Click **Save**
3. Click **Deploy → Manage deployments**
4. Click ✏️ (Edit) on your deployment
5. Change **Version** to "New version"
6. Click **Deploy**
7. The URL stays the same - no need to update `.env`

## Next Steps

After setup:

1. Test consuming resources (make coffee)
2. Test refilling resources (admin panel)
3. Test page reload (data persistence)
4. Monitor Google Sheet for updates

## Support

If you encounter issues:

1. Check Apps Script **Executions** log
2. Check browser console for errors
3. Verify environment variables
4. Test API with curl/Postman
