/**
 * Safely formats any WhatsApp input (phone number, username, handle, or full URL)
 * into a valid, working wa.me link.
 *
 * Supported formats:
 * - Username / Handle: "amanchaurasiya", "@amanchaurasiya" -> "https://wa.me/amanchaurasiya"
 * - Full URL: "https://wa.me/...", "wa.me/..." -> "https://wa.me/..."
 * - Phone number (10-digit): "7275523611" -> "https://wa.me/917275523611"
 * - International phone: "+91 72755 23611", "+1 (555) 123-4567" -> digits with country code
 */
export function getWhatsappUrl(input) {
  if (!input || typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // If already a full URL:
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // If starts with wa.me/
  if (/^wa\.me\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  // If starts with @ (e.g. @username)
  if (trimmed.startsWith("@")) {
    const handle = trimmed.slice(1).trim();
    return handle ? `https://wa.me/${handle}` : null;
  }

  // If input contains alphabetic characters, treat as a WhatsApp username / handle
  if (/[a-zA-Z]/.test(trimmed)) {
    // Strip leading slashes or whitespace
    const cleanHandle = trimmed.replace(/^[\s/]+/, "");
    return cleanHandle ? `https://wa.me/${cleanHandle}` : null;
  }

  // Otherwise, treat as phone number and extract digits:
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return null;

  // 10 digits mobile format (standard default country code 91 for India)
  const formattedNumber = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${formattedNumber}`;
}
