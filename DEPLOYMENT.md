# Deployment Guide: Naioth Bible Institute Registration System

This document contains step-by-step instructions for setting up the Google Sheets database, deploying the Google Apps Script REST API, and connecting the React frontend to run in production.

---

## Part 1: Creating the Google Spreadsheet

1. Log into your Google Account and visit [Google Sheets](https://sheets.google.com).
2. Create a new blank spreadsheet.
3. Name your spreadsheet: `NBI Basic Theology Registrations 2026`.
4. Rename the default sheet (the tab at the bottom) from `Sheet1` to exactly: `Registrations`.
5. Enter the following column headers in Row 1 (Columns A through J):
   * **A1:** `Timestamp`
   * **B1:** `Registration ID`
   * **C1:** `Full Name`
   * **D1:** `Email Address`
   * **E1:** `Phone Number`
   * **F1:** `Gender`
   * **G1:** `Church/Ministry`
   * **H1:** `Referral Source`
   * **I1:** `Status`
   * **J1:** `Created By`
6. Copy the **Spreadsheet ID** from your browser's address bar. The ID is the long string of characters between `/d/` and `/edit` in the URL:
   `https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID_HERE/edit`

---

## Part 2: Setting up Google Apps Script

1. Inside your Google Sheet, click **Extensions** in the top menu bar, then click **Apps Script**. This will open an empty script project.
2. In the Apps Script editor, rename the project to `NBI Registration Backend`.
3. Locate the file list on the left side of the editor. Click on `Code.gs` to open it.
4. Delete any default code inside `Code.gs` and copy-paste the entire content of the `/google-apps-script/Code.gs` file from this project.
5. In the first few lines of the pasted code, replace the value of the `SPREADSHEET_ID` variable with the Spreadsheet ID you copied in **Part 1**:
   ```javascript
   const SPREADSHEET_ID = "PASTE_YOUR_SPREADSHEET_ID_HERE";
   ```
6. (Optional) On the left menu, click **Project Settings** (the gear icon) and check the box that says: **Show "appsscript.json" manifest file in editor**.
7. Return to the **Editor** (code icon), open `appsscript.json`, and replace its contents with the `/google-apps-script/appsscript.json` content from this project.
8. Click the **Save Project** (floppy disk) icon at the top of the editor.

---

## Part 3: Deploying the Apps Script as a Web App

1. Click the **Deploy** button at the top-right of the Apps Script page, then click **New deployment**.
2. For the **Select type** configuration, click the gear icon next to "Select type" and choose **Web app**.
3. Fill in the deployment details:
   * **Description:** `NBI API Version 1.0`
   * **Execute as:** `Me (your-email@gmail.com)` (This allows the script to append rows and send emails on your behalf).
   * **Who has access:** Choose **Anyone** (This is crucial, as it allows your React app to send public registration requests without login credentials).
4. Click the **Deploy** button.
5. If prompted, click **Authorize Access** and grant permissions for the script to access your Google Sheets and send email notifications via Gmail.
6. Once the deployment finishes, copy the **Web App URL** provided. It will look like this:
   `https://script.google.com/macros/s/AKfyby...YOUR_DEPLOYMENT_ID.../exec`

---

## Part 4: Connecting React to the Backend Web App

1. In your local React environment or deployment workspace, locate or create the `.env` file at the project root.
2. Add your Google Apps Script Web App URL to the `VITE_API_URL` environment variable:
   ```env
   VITE_API_URL="https://script.google.com/macros/s/AKfyby...YOUR_DEPLOYMENT_ID.../exec"
   ```
3. Save the file. Our Axios instance (`src/services/api.ts`) will now proxy all actions (`/register`, `/registrations`, `/stats`, and `/login`) straight to Google Sheets instead of local mock storage!

---

## Part 5: Running the React Application

To boot up the React application in your local development environment:

1. Open your terminal at the project root folder.
2. Install all necessary dependencies listed in `package.json`:
   ```bash
   npm install
   ```
3. Boot up the Vite developer server:
   ```bash
   npm run dev
   ```
4. Open the development URL (usually `http://localhost:3000`) in your browser to test and navigate.

---

## Part 6: Deploying to Vercel

To host the React frontend in production using Vercel:

1. Commit your codebase and push it to a private or public repository on **GitHub**, **GitLab**, or **Bitbucket**.
2. Log into your [Vercel Dashboard](https://vercel.com) and click **Add New** > **Project**.
3. Import your repository.
4. Under **Configuration Settings**, locate the **Environment Variables** section.
5. Define the following key-value pair:
   * **Key:** `VITE_API_URL`
   * **Value:** `https://script.google.com/macros/s/AKfyby...YOUR_DEPLOYMENT_ID.../exec` (Your Google Apps Script Web App URL)
6. Click **Deploy**. Vercel will build your static files and supply a secure production URL for your prospective theology students!
