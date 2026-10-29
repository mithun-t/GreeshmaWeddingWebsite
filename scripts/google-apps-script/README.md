# Google Sheets RSVP Setup Guide for Hridayam

Connecting your wedding website to Google Sheets takes just 2 minutes and is completely free with zero maintenance.

---

### Step 1: Create a Google Sheet
1. Open [Google Sheets](https://sheets.new) in your web browser.
2. Title it: **"Greeshma & Aswin Wedding RSVPs"**.

---

### Step 2: Add the Apps Script Code
1. In your new Google Sheet, click **Extensions** > **Apps Script** in the top menu.
2. Clear any default code in `Code.gs`.
3. Open [`Code.gs`](file:///d:/Projects/WeddingWebsite/scripts/google-apps-script/Code.gs) in this project, copy the entire contents, and paste them into the Apps Script editor.
4. Click **Save** (disk icon or `Ctrl + S`).

---

### Step 3: Deploy as a Web App
1. At the top right of Apps Script, click the blue **Deploy** button > **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Configure the fields:
   - **Description**: `Wedding RSVP Webhook`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone` *(Crucial so guests can submit without signing into Google)*
4. Click **Deploy**.
5. Google will ask you to **Authorize access**:
   - Choose your Google account.
   - Click *Advanced* > *Go to Untitled project (unsafe)* (this is standard for your own personal scripts).
   - Click *Allow*.
6. Copy the generated **Web app URL** (starts with `https://script.google.com/macros/s/.../exec`).

---

### Step 4: Add to your Website Configuration
1. Open your `.env` file in the root of this project.
2. Add or update the line:
   ```env
   VITE_RSVP_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```
3. Save the file!

---

### How it works:
- Every time a guest submits the RSVP form on the website (locally or deployed on GitHub Pages), a new row is automatically added to your Google Sheet with:
  - Timestamp
  - Guest Name
  - Phone Number
  - Email Address
  - Attending (Yes/No)
  - Guest Count
  - Events Attending (Haldi, Sangeet, Wedding, etc.)
  - Warm Wishes / Note
- You can access this spreadsheet from the Google Sheets app on your iPhone or Android phone anytime!
- The Admin RSVP Dashboard on the website (press `Alt+A` or enter PIN `2027`) can also read live responses directly from this sheet.
