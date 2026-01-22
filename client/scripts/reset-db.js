import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Define the clean structure
const cleanDB = {
  "people": [],
  "companies": [],
  "activities": [],
  "documents": [],
  "resources": [],
  "values": []
};

// 2. Find the db.json file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../db.json');

// 3. Write the clean data to the file
fs.writeFileSync(dbPath, JSON.stringify(cleanDB, null, 2));

console.log("✅ Database has been wiped clean!");