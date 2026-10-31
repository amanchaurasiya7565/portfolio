import "dotenv/config";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import Admin from "./models/Admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function resetPassword() {
  console.log("\n==========================================");
  console.log("       PORTFOLIO ADMIN PASSWORD RESET     ");
  console.log("==========================================\n");

  const connected = await connectDB();
  if (!connected) {
    console.error("❌ Database connection failed. Aborting.");
    process.exit(1);
  }

  const args = process.argv.slice(2);
  let targetEmail = args[0]?.trim();
  let newPassword = args[1]?.trim();

  // If arguments not provided via CLI, prompt interactively
  if (!targetEmail || !newPassword) {
    const defaultEmail = process.env.ADMIN_EMAIL || "amanchaurasiya7565@gmail.com";
    const rl = readline.createInterface({ input, output });

    try {
      if (!targetEmail) {
        const enteredEmail = await rl.question(
          `Enter admin email [default: ${defaultEmail}]: `
        );
        targetEmail = enteredEmail.trim() || defaultEmail;
      }

      if (!newPassword) {
        newPassword = await rl.question("Enter new password (min 6 characters): ");
        newPassword = newPassword.trim();
      }
    } finally {
      rl.close();
    }
  }

  targetEmail = targetEmail.toLowerCase();

  if (!newPassword || newPassword.length < 6) {
    console.error("\n❌ Error: Password must be at least 6 characters long.\n");
    process.exit(1);
  }

  try {
    let admin = await Admin.findOne({ email: targetEmail });
    if (!admin) {
      // If specific email wasn't found, check if single admin exists in database
      admin = await Admin.findOne();
      if (admin) {
        console.log(`ℹ️  No account for '${targetEmail}'. Found primary admin '${admin.email}'.`);
      }
    }

    if (!admin) {
      console.error(`\n❌ Error: No admin account found in the database. Run 'npm run create-admin' first.\n`);
      process.exit(1);
    }

    console.log(`⏳ Hashing password and updating credentials for: ${admin.email}...`);
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    admin.password = hashedPassword;
    await admin.save();

    // Optionally synchronize server/.env if ADMIN_PASSWORD is set there
    try {
      const envPath = path.resolve(__dirname, ".env");
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, "utf-8");
        if (envContent.includes("ADMIN_PASSWORD=")) {
          envContent = envContent.replace(
            /ADMIN_PASSWORD=.*/g,
            `ADMIN_PASSWORD=${newPassword}`
          );
          fs.writeFileSync(envPath, envContent, "utf-8");
          console.log("📝 Updated ADMIN_PASSWORD in server/.env");
        }
      }
    } catch (envErr) {
      console.warn("⚠️  Could not update .env file:", envErr.message);
    }

    console.log("\n==========================================");
    console.log("✅ SUCCESS: Password has been successfully reset!");
    console.log(`📧 Admin Account: ${admin.email}`);
    console.log(`🔑 New Password:  ${newPassword}`);
    console.log("==========================================\n");
  } catch (error) {
    console.error("\n❌ Failed to reset password:", error.message, "\n");
    process.exit(1);
  } finally {
    const { default: mongoose } = await import("mongoose");
    await mongoose.connection.close();
    process.exit(0);
  }
}

resetPassword();
