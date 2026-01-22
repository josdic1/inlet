import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const content = `# Inlet
**The Job Hunt CRM that keeps you sane.**

![Dashboard Preview](screenshot4.png)

## 🌊 What is Inlet?
**Inlet** is a local-first Personal Relationship Manager (PRM) designed specifically for the modern job search.

Standard spreadsheets are messy, and generic CRMs are too bloated. Inlet sits in the sweet spot: it tracks your **outreach**, manages your **network**, and—most importantly—filters every opportunity through your personal **Values**.

It is built to run locally on your machine, giving you complete ownership of your data with zero latency.

---

## 🚀 Key Features

### 1. Activity Feed & Pipeline
Stop wondering *"Did I follow up with Sarah?"*. The Activity Feed treats your job hunt like a sales pipeline.
- **Track Everything:** Log applications, cold outreach, networking calls, and content creation.
- **Status Tracking:** Mark threads as \`Active\`, \`Waiting\`, or \`Closed\`.
- **Quick Add:** Rapidly log new tasks without breaking your flow.

### 2. Values-Driven Filtering
Most job trackers only care about *getting* the job. Inlet helps you decide if you *want* it.
- Define your **Must Haves** (e.g., Remote, Equity).
- Define your **Deal Breakers** (e.g., No open floor plans).
- Evaluate companies against this "North Star" before applying.

![Values Screen](screenshot.png)

### 3. Network & Documents
- **People:** Link contacts to specific companies and track interaction history.
- **Documents:** Manage versions of your Resumes, Cover Letters, and Portfolios in one place.

---

## 🛠 Tech Stack
* **Frontend:** React + Vite
* **Backend:** JSON-Server (Local REST API)
* **Process Management:** PM2 (Keeps client + server alive in background)
* **Styling:** CSS Modules / Styled Components
* **Icons:** Lucide React

---

## ⚡️ Quick Start

This project uses **PM2** to manage the frontend and backend simultaneously in the background.

### 1. Installation
\`\`\`bash
git clone https://github.com/josdic1/inlet.git
cd inlet/client
npm install
\`\`\`

### 2. Start the App
We have a custom shortcut that spins up the Database (Port 3000) and the Client (Port 5175) and daemonizes them.
\`\`\`bash
npm run pm2:start
\`\`\`
*The app will now be running at [http://localhost:5175](http://localhost:5175)*.

### 3. Managing the Server
Since the app runs in the background, use these commands to control it:

| Command | Description |
| :--- | :--- |
| \`npm run pm2:list\` | Check status of Client and DB |
| \`npm run pm2:stop\` | Pause the server (save state) |
| \`npm run pm2:delete\` | Kill processes completely |
| \`npm run db:reset\` | **⚠️ Wipe Data:** Resets DB to default state |

---

## 📂 Project Structure

\`\`\`text
inlet/
├── client/              # React Application
│   ├── src/
│   │   ├── components/  # Reusable UI cards & forms
│   │   ├── pages/       # Main route views
│   │   ├── providers/   # Auth & Context logic
│   │   └── scripts/     # Node maintenance scripts
│   └── package.json     # Scripts & Dependencies
│
├── db.json              # Your Local Database (Do not delete)
└── README.md            # You are here
\`\`\`

---

*Built by [Josh Dicker](https://github.com/josdic1)*
`; // <--- I MOVED THE CLOSING BACKTICK HERE!

// Resolve path to the root 'inlet' folder (one level up from client, then one level up from scripts)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const readmePath = path.join(__dirname, '../../README.md');

fs.writeFileSync(readmePath, content);
console.log("✅ README.md generated successfully at: " + readmePath);