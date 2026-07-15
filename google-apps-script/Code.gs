/**
 * NAIOTH BIBLE INSTITUTE - REGISTRATION BACKEND
 * Google Apps Script Web App
 * 
 * Exposes a REST API connecting Google Spreadsheet database to React Frontend.
 * Features: Automatic sequential registration IDs, dynamic Gmail confirmations,
 * admin authorization, and statistics compilation.
 */

// Global configuration
const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE"; // Replace with your active sheet ID
const ADMIN_EMAIL = "YOUR_SECURE_ADMIN_EMAIL_HERE";
const ADMIN_PASSWORD = "YOUR_SECURE_ADMIN_PASSWORD_HASH_OR_PHRASE_HERE"; // Store securely, not in plaintext


/**
 * Handle incoming GET requests (Read operations)
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    const token = e.parameter.token;

    // 1. PUBLIC: Track application status by Registration ID
    if (action === "track") {
      const regId = e.parameter.id;
      if (!regId) return jsonResponse({ success: false, message: "Missing registration ID" });
      
      const registration = findRegistrationById(regId);
      if (!registration) return jsonResponse({ success: false, message: "Registration ID not found" });
      
      return jsonResponse({ success: true, data: registration });
    }

    // 2. ADMIN: Authorization check
    if (action === "registrations" || action === "stats") {
      if (token !== "mock-jwt-token-for-naioth-admin") {
        return jsonResponse({ success: false, message: "Unauthorized access" }, 401);
      }

      if (action === "registrations") {
        const data = getAllRegistrations();
        return jsonResponse({ success: true, data: data });
      }

      if (action === "stats") {
        const stats = compileStatistics();
        return jsonResponse({ success: true, stats: stats });
      }
    }

    return jsonResponse({ success: false, message: "Invalid action parameter" });
  } catch (error) {
    return jsonResponse({ success: false, message: "Server error: " + error.toString() }, 500);
  }
}

/**
 * Handle incoming POST requests (Write operations)
 */
function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;

    // 1. PUBLIC: Submit a new student registration
    if (action === "register" || !action) { // Default action
      return registerStudent(postData);
    }

    // 2. ADMIN: Login authentication
    if (action === "login") {
      const email = postData.email;
      const password = postData.password;

      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        return jsonResponse({
          success: true,
          token: "mock-jwt-token-for-naioth-admin",
          user: { email: ADMIN_EMAIL, role: "admin", name: "NBI Registrar" }
        });
      }
      return jsonResponse({ success: false, message: "Invalid credentials" }, 401);
    }

    // 3. ADMIN: Approve or Reject a candidate
    if (action === "status_update") {
      const token = postData.token;
      if (token !== "mock-jwt-token-for-naioth-admin") {
        return jsonResponse({ success: false, message: "Unauthorized access" }, 401);
      }

      const regId = postData.id;
      const newStatus = postData.status; // "Approved" or "Rejected"

      if (!regId || !["Approved", "Rejected", "Pending"].includes(newStatus)) {
        return jsonResponse({ success: false, message: "Invalid payload parameters" }, 400);
      }

      const success = updateRegistrationStatus(regId, newStatus);
      if (success) {
        return jsonResponse({ success: true, message: `Updated ${regId} to ${newStatus}` });
      }
      return jsonResponse({ success: false, message: "Registration ID not found" }, 404);
    }

    return jsonResponse({ success: false, message: "Invalid post action" });
  } catch (error) {
    return jsonResponse({ success: false, message: "Server error: " + error.toString() }, 500);
  }
}

/**
 * Register a new student in the spreadsheet database
 */
function registerStudent(data) {
  const sheet = getDatabaseSheet();
  
  // Basic Validation
  if (!data.fullName || !data.email || !data.phoneNumber || !data.gender || !data.church || !data.referralSource) {
    return jsonResponse({ success: false, message: "Missing required registration fields" }, 400);
  }

  const timestamp = new Date();
  const nextId = generateNextRegistrationId(sheet);

  // Column Mapping: Timestamp, ID, Name, Email, Phone, Gender, Church, Referral, Status, Created By
  const newRow = [
    timestamp,
    nextId,
    data.fullName,
    data.email,
    data.phoneNumber,
    data.gender,
    data.church,
    data.referralSource,
    "Pending", // Initial status
    "Online Form"
  ];

  sheet.appendRow(newRow);

  // Send Email Confirmation using GmailApp
  try {
    sendConfirmationEmail(data.fullName, data.email, nextId);
  } catch (err) {
    Logger.log("Email failed to send: " + err.toString());
  }

  return jsonResponse({
    success: true,
    data: {
      id: nextId,
      timestamp: timestamp.toISOString(),
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      gender: data.gender,
      church: data.church,
      referralSource: data.referralSource,
      status: "Pending",
      createdBy: "Online Form",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + nextId
    },
    message: "Registration successful!"
  });
}

/**
 * Send structural email confirmation voucher
 */
function sendConfirmationEmail(name, email, regId) {
  const subject = "Naioth Bible Institute - Registration Voucher Code: " + regId;
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
      <h2 style="color: #0A2A66; margin-top: 0;">Naioth Bible Institute</h2>
      <p style="color: #FFC107; font-weight: bold; margin-top: -10px; text-transform: uppercase; font-size: 11px; tracking: 1px;">Basic Theology Module 2026</p>
      
      <p>Dear <strong>${name}</strong>,</p>
      <p>Congratulations! Your online registration for the <strong>Basic Theology Module</strong> has been logged successfully.</p>
      
      <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #0A2A66; margin: 20px 0; border-radius: 8px;">
        <p style="margin: 0; font-size: 12px; color: #64748b;">YOUR REGISTRATION ID</p>
        <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: bold; color: #2563EB;">${regId}</p>
      </div>

      <p><strong>Course Schedule:</strong> August 21 – September 27, 2026 (Weekend Intensive Sessions)</p>
      <p>Please keep this Registration ID safe. You will need it to download your final admission slips and access online classes.</p>
      
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
      <p style="font-size: 11px; color: #64748b; text-align: center;">Naioth Educational Complex, Port Harcourt, Rivers State, Nigeria.<br/>info@naioth.org | +234 803 456 7890</p>
    </div>
  `;

  GmailApp.sendEmail(email, subject, "", { htmlBody: htmlBody });
}

/**
 * Generate sequential registration IDs (e.g. NBI2026-0001)
 */
function generateNextRegistrationId(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return "NBI2026-0001"; // Headers only

  const lastId = sheet.getRange(lastRow, 2).getValue(); // Row, Column 2 (ID)
  if (!lastId || typeof lastId !== "string") return "NBI2026-0001";

  const parts = lastId.split("-");
  if (parts.length < 2) return "NBI2026-0001";

  const nextNum = parseInt(parts[1], 10) + 1;
  return "NBI2026-" + String(nextNum).padStart(4, "0");
}

/**
 * Retrieve specific candidate by ID
 */
function findRegistrationById(regId) {
  const sheet = getDatabaseSheet();
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]).toLowerCase() === String(regId).toLowerCase()) {
      return rowToObject(data[i]);
    }
  }
  return null;
}

/**
 * Update candidate approval/rejection status
 */
function updateRegistrationStatus(regId, status) {
  const sheet = getDatabaseSheet();
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]).toLowerCase() === String(regId).toLowerCase()) {
      sheet.getRange(i + 1, 9).setValue(status); // Column 9 (Status) is 1-indexed (A=1, I=9)
      return true;
    }
  }
  return false;
}

/**
 * Read all registrations as array of JSON objects
 */
function getAllRegistrations() {
  const sheet = getDatabaseSheet();
  const data = sheet.getDataRange().getValues();
  const regs = [];
  
  for (let i = 1; i < data.length; i++) {
    regs.push(rowToObject(data[i]));
  }
  return regs;
}

/**
 * Compiles real-time metrics for admin dashboard
 */
function compileStatistics() {
  const regs = getAllRegistrations();
  
  const total = regs.length;
  const approved = regs.filter(r => r.status === "Approved").length;
  const pending = regs.filter(r => r.status === "Pending").length;
  const rejected = regs.filter(r => r.status === "Rejected").length;

  const male = regs.filter(r => r.gender === "Male").length;
  const female = regs.filter(r => r.gender === "Female").length;

  const referrals = { Facebook: 0, WhatsApp: 0, Friend: 0, Other: 0 };
  regs.forEach(r => {
    const src = r.referralSource;
    if (referrals[src] !== undefined) {
      referrals[src]++;
    } else {
      referrals["Other"]++;
    }
  });

  const dateCounts = {};
  regs.forEach(r => {
    if (r.timestamp) {
      const d = r.timestamp.split("T")[0];
      dateCounts[d] = (dateCounts[d] || 0) + 1;
    }
  });

  const timeline = Object.keys(dateCounts).sort().map(d => ({
    date: d,
    count: dateCounts[d]
  }));

  return {
    total: total,
    approved: approved,
    pending: pending,
    rejected: rejected,
    gender: { male: male, female: female },
    referrals: referrals,
    timeline: timeline
  };
}

/**
 * Map sheet row cells to clear JavaScript Object keys
 */
function rowToObject(row) {
  return {
    timestamp: row[0] ? new Date(row[0]).toISOString() : "",
    id: row[1],
    fullName: row[2],
    email: row[3],
    phoneNumber: row[4],
    gender: row[5],
    church: row[6],
    referralSource: row[7],
    status: row[8],
    createdBy: row[9],
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + row[1]
  };
}

/**
 * Get active sheet instance, automatically bootstrapping headers if empty
 */
function getDatabaseSheet() {
  let ss;
  if (SPREADSHEET_ID === "YOUR_SPREADSHEET_ID_HERE") {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } else {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  }

  let sheet = ss.getSheetByName("Registrations");
  if (!sheet) {
    sheet = ss.insertSheet("Registrations");
    const headers = [
      "Timestamp", "Registration ID", "Full Name", "Email Address", 
      "Phone Number", "Gender", "Church/Ministry", "Referral Source", "Status", "Created By"
    ];
    sheet.appendRow(headers);
    // Format headers bold
    sheet.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#0A2A66").setFontColor("#FFFFFF");
  }
  return sheet;
}

/**
 * Helper to build CORS-enabled application/json responses
 */
function jsonResponse(obj, statusCode) {
  const outputStr = JSON.stringify(obj);
  return ContentService.createTextOutput(outputStr)
    .setMimeType(ContentService.MimeType.JSON);
}
