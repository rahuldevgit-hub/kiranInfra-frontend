export default function formatPhoneNumber(phone?: string) {
  if (!phone) {
    return ""; // or return phone; if you want undefined/null to pass through
  }

  // Remove anything except digits and +
  const clean = phone.replace(/[^\d+]/g, "");

  if (!clean.startsWith("+")) {
    return phone; // return as-is if not valid
  }

  // Example: +911412331030
  const countryCode = clean.slice(0, 3);   // +91
  const areaCode = clean.slice(3, 6);      // 141
  const restNumber = clean.slice(6);       // 2331030

  return `${countryCode}-${areaCode}-${restNumber}`;
}
