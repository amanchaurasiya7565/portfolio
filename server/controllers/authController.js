import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
});

export const loginAdmin = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
      { id: admin._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("adminToken", token, cookieOptions());

    return res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const logoutAdmin = (req, res) => {
  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.json({
    message: "Logged out successfully",
  });
};

export const getCurrentAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");

    if (!admin) {
      return res.status(401).json({
        message: "Admin not found",
      });
    }

    return res.json({ admin });
  } catch (error) {
    console.error("Get current admin error:", error);
    return res.status(500).json({
      message: "Failed to get current admin",
    });
  }
};

export const resetPasswordAdmin = async (req, res) => {
  try {
    const email = String(req.body?.email || process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const newPassword = String(req.body?.newPassword || req.body?.password || "");
    const secretKey = String(req.body?.secretKey || req.body?.masterKey || "").trim();
    const currentPassword = String(req.body?.currentPassword || "");

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long.",
      });
    }

    if (!email) {
      return res.status(400).json({
        message: "Admin email is required.",
      });
    }

    // Find the admin
    let admin = await Admin.findOne({ email });
    if (!admin) {
      // Fallback: check if single admin exists in the system
      admin = await Admin.findOne();
    }

    if (!admin) {
      return res.status(404).json({
        message: "Admin account not found.",
      });
    }

    // Check caller authentication if token is provided
    let isCallerAuthenticated = false;
    const token =
      req.cookies?.adminToken ||
      req.headers?.authorization?.replace(/^Bearer\s+/i, "");
    if (token && process.env.JWT_SECRET) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded && (decoded.id === admin._id.toString() || decoded.id)) {
          isCallerAuthenticated = true;
        }
      } catch {
        // Token invalid or expired, continue to fallback checks
      }
    }

    const isMasterSecretValid =
      Boolean(secretKey) &&
      (secretKey === process.env.JWT_SECRET ||
        secretKey === process.env.RESET_SECRET ||
        secretKey === process.env.ADMIN_PASSWORD);

    let isAuthorized = false;

    if (isCallerAuthenticated) {
      isAuthorized = true;
    } else if (isMasterSecretValid) {
      isAuthorized = true;
    } else if (currentPassword) {
      const match = await bcrypt.compare(currentPassword, admin.password);
      if (match) {
        isAuthorized = true;
      } else {
        return res.status(401).json({
          message: "Current password is incorrect.",
        });
      }
    }

    if (!isAuthorized) {
      return res.status(401).json({
        message:
          "Unauthorized: A valid master secret key (JWT_SECRET/RESET_SECRET), current password, or active admin session is required to reset password.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    admin.password = hashedPassword;
    await admin.save();

    return res.json({
      success: true,
      message: `Password has been reset successfully for ${admin.email}. You can now sign in with your new password.`,
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      message: "Server error while resetting password.",
    });
  }
};

export const changePasswordAdmin = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long.",
      });
    }

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({
        message: "Admin account not found.",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect.",
      });
    }

    admin.password = await bcrypt.hash(newPassword, 12);
    await admin.save();

    return res.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      message: "Server error while changing password.",
    });
  }
};

