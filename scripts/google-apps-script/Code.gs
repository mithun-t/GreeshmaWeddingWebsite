/**
 * Google Apps Script for Hridayam Wedding Website RSVP
 * 
 * Instructions:
 * 1. Open Google Sheets (https://sheets.new) and name it (e.g., "Greeshma & Aswin Wedding RSVPs").
 * 2. Click Extensions > Apps Script.
 * 3. Delete any default code, paste this entire file, and click Save (Ctrl+S).
 * 4. Click "Deploy" > "New deployment".
 * 5. Select type "Web app".
 * 6. Set Description: "Wedding RSVP Webhook"
 * 7. Set "Execute as": "Me"
 * 8. Set "Who has access": "Anyone" (Crucial so wedding guests can submit without signing in)
 * 9. Click "Deploy", authorize permissions when prompted, and copy the Web App URL.
 * 10. Paste the Web App URL into your .env file as:
 *     VITE_RSVP_API_URL=https://script.google.com/macros/s/AKfycb.../exec
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Initialize headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Submitted At",
        "Guest Name",
        "Phone",
        "Email",
        "Attending",
        "Guest Count",
        "Events Attending",
        "Warm Wishes / Note",
        "Submission ID"
      ]);
      // Format header row
      sheet.getRange(1, 1, 1, 9).setFontWeight("bold").setBackground("#F3EDE2");
    }

    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var submittedAt = data.submittedAt || new Date().toISOString();
    var guestName = data.guestName || "";
    var phone = data.phone || "";
    var email = data.email || "";
    var attending = data.attending === true || data.attending === "true" || data.attending === "Yes" ? "Yes" : "No";
    var guestCount = attending === "Yes" ? (data.guestCount || 1) : 0;
    var eventsAttending = Array.isArray(data.eventsAttending) 
      ? data.eventsAttending.join(", ") 
      : (data.eventsAttending || "");
    var message = data.message || "";
    var id = data.id || ("rsvp_" + new Date().getTime());

    sheet.appendRow([
      submittedAt,
      guestName,
      phone,
      email,
      attending,
      guestCount,
      eventsAttending,
      message,
      id
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "RSVP recorded successfully in Google Sheets",
      id: id
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
    }

    var headers = rows[0];
    var data = [];

    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      data.push({
        submittedAt: row[0],
        guestName: row[1],
        phone: row[2],
        email: row[3],
        attending: row[4] === "Yes",
        guestCount: Number(row[5]) || 0,
        eventsAttending: row[6] ? String(row[6]).split(", ") : [],
        message: row[7],
        id: row[8]
      });
    }

    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
