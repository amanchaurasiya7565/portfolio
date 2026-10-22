import mongoose from "mongoose";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

/**
 * Resolves a mongodb+srv:// URI into a standard replica set mongodb:// URI
 * using DNS-over-HTTPS (DoH). This resolves the common "querySrv ECONNREFUSED"
 * error on Windows systems where UDP port 53 SRV queries are blocked or refused by local DNS/ISP.
 */
async function resolveSrvUriViaDoH(srvUri) {
  try {
    const srvMatch = srvUri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/\?]+)(\/[^\?]*)?(\?.*)?$/);
    if (!srvMatch) return null;

    const [, user, pass, host, rawDbPath, rawQuery] = srvMatch;
    const dbName = (rawDbPath && rawDbPath !== "/") ? rawDbPath.replace(/^\//, "") : "portfolio";

    // 1. Resolve SRV record for hosts and ports
    const srvUrl = `https://dns.google/resolve?name=_mongodb._tcp.${host}&type=SRV`;
    const srvRes = await fetch(srvUrl, { signal: AbortSignal.timeout(5000) });
    if (!srvRes.ok) return null;
    const srvData = await srvRes.json();

    if (!srvData.Answer || srvData.Answer.length === 0) return null;

    const hosts = srvData.Answer.map((ans) => {
      const parts = ans.data.trim().split(/\s+/);
      const port = parts[2] || "27017";
      const target = parts[3].replace(/\.$/, "");
      return `${target}:${port}`;
    }).join(",");

    // 2. Resolve TXT record for replicaSet and authSource
    let replicaSet = "";
    let authSource = "admin";
    try {
      const txtUrl = `https://dns.google/resolve?name=${host}&type=TXT`;
      const txtRes = await fetch(txtUrl, { signal: AbortSignal.timeout(5000) });
      if (txtRes.ok) {
        const txtData = await txtRes.json();
        if (txtData.Answer) {
          for (const ans of txtData.Answer) {
            const txt = ans.data.replace(/"/g, "");
            const params = new URLSearchParams(txt);
            if (params.get("replicaSet")) replicaSet = params.get("replicaSet");
            if (params.get("authSource")) authSource = params.get("authSource");
          }
        }
      }
    } catch {
      // TXT resolution failure is non-fatal
    }

    const queryParams = new URLSearchParams(rawQuery ? rawQuery.replace(/^\?/, "") : "");
    queryParams.set("ssl", "true");
    queryParams.set("authSource", authSource);
    if (replicaSet) queryParams.set("replicaSet", replicaSet);
    if (!queryParams.has("retryWrites")) queryParams.set("retryWrites", "true");
    if (!queryParams.has("w")) queryParams.set("w", "majority");

    return `mongodb://${user}:${pass}@${hosts}/${dbName}?${queryParams.toString()}`;
  } catch (err) {
    return null;
  }
}

const connectDB = async (retries = 3) => {
  let uri = process.env.MONGO_URI?.trim();
  if (!uri) throw new Error("MONGO_URI is not defined in server/.env");

  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host} (DB: ${conn.connection.name})`);
      return true;
    } catch (error) {
      lastError = error;
      console.error(`MongoDB connection attempt ${attempt}/${retries} failed: ${error.message}`);

      // If SRV lookup failed due to Windows DNS/ISP ECONNREFUSED, attempt DoH fallback
      if (
        (error.message.includes("querySrv") || error.code === "ECONNREFUSED") &&
        uri.startsWith("mongodb+srv://")
      ) {
        console.log("SRV DNS lookup was refused. Attempting automatic DNS-over-HTTPS resolution fallback...");
        const resolvedUri = await resolveSrvUriViaDoH(uri);
        if (resolvedUri) {
          try {
            console.log("Retrying connection with resolved standard replica set URI...");
            const conn = await mongoose.connect(resolvedUri, {
              serverSelectionTimeoutMS: 10000,
              connectTimeoutMS: 10000,
            });
            console.log(`MongoDB Connected successfully via fallback: ${conn.connection.host} (DB: ${conn.connection.name})`);
            return true;
          } catch (fallbackError) {
            console.error(`Fallback connection attempt failed: ${fallbackError.message}`);
          }
        }
      }

      if (attempt < retries) await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  if (lastError?.code === "ECONNREFUSED" && uri.startsWith("mongodb+srv://")) {
    console.error(
      "MongoDB Atlas SRV DNS lookup was refused. This is a known Windows/ISP DNS issue.\n" +
      "Use the direct replica set URI format in server/.env (starting with mongodb:// instead of mongodb+srv://)."
    );
  }
  return false;
};

export default connectDB;
