import "dotenv/config";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import Admin from "./models/Admin.js";

const createOrUpdateAdmin = async () => {
  const connected = await connectDB();

  if (!connected) {
    process.exit(1);
  }

  const name = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    console.error(
      "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD must be set in server/.env"
    );
    process.exit(1);
  }

  if (password.length < 6) {
    console.error("ADMIN_PASSWORD must be at least 6 characters long.");
    process.exit(1);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      existingAdmin.name = name;
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();

      console.log(`Admin credentials updated for ${email}.`);
      console.log("You can now use the ADMIN_EMAIL and ADMIN_PASSWORD from server/.env to sign in.");
    } else {
      await Admin.create({
        name,
        email,
        password: hashedPassword,
      });

      console.log(`Admin created successfully for ${email}.`);
      console.log("Use the ADMIN_EMAIL and ADMIN_PASSWORD from server/.env to sign in.");
    }
  } catch (error) {
    console.error("Failed to create/update admin:", error.message);
    process.exit(1);
  } finally {
    await import("mongoose").then(({ default: mongoose }) => mongoose.connection.close());
  }
};

createOrUpdateAdmin();
