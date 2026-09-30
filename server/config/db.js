import mongoose from "mongoose";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const connectDB = async (retries = 3) => {
  const uri = process.env.MONGO_URI?.trim();
  if (!uri) throw new Error("MONGO_URI is not defined in server/.env");

  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000 });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return true;
    } catch (error) {
      lastError = error;
      console.error(`MongoDB connection attempt ${attempt}/${retries} failed: ${error.message}`);
      if (attempt < retries) await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  if (lastError?.code === "ECONNREFUSED" && uri.startsWith("mongodb+srv://")) {
    console.error("MongoDB Atlas SRV DNS lookup was refused. Check Windows DNS/network, Atlas Network Access/IP allowlist, and MONGO_URI. Verify with: nslookup -type=SRV _mongodb._tcp.cluster0.ffgykbg.mongodb.net");
  }
  return false;
};

export default connectDB;
