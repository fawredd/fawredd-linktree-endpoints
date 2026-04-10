import { neon } from "@neondatabase/serverless"
import * as fs from "fs"
import * as path from "path"

// Manually load .env from root
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), ".env");
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, "utf-8");
            envContent.split("\n").forEach(line => {
                const trimmedLine = line.trim();
                if (trimmedLine && !trimmedLine.startsWith("#")) {
                    const [key, ...valueParts] = trimmedLine.split("=");
                    if (key && valueParts.length > 0) {
                        process.env[key.trim()] = valueParts.join("=").trim().replace(/^"|"$/g, '');
                    }
                }
            });
        }
    } catch (err) {
        console.error("Error loading .env file:", err);
    }
}

loadEnv();

const sql = neon(process.env.DATABASE_URL!)

async function createTable() {
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL not found in environment or .env file");
        process.exit(1);
    }

    try {
        console.log("Creating profile_managers table...")
        await sql`
      CREATE TABLE IF NOT EXISTS profile_managers (
        id SERIAL PRIMARY KEY,
        profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        email TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(profile_id, email)
      )
    `
        console.log("Table created successfully!")
    } catch (error) {
        console.error("Error creating table:", error)
        process.exit(1);
    }
}

createTable()
