export default function formatPhoneNumber(phone: string) {
  // Remove any non-digit except + at the start
  let clean = phone.replace(/[^\d+]/g, "");

  let countryCode = "";
  let areaCode = "";
  let restNumber = "";

  if (clean.startsWith("+") && clean.length > 10) {
    // Case: +911412331030
    countryCode = clean.slice(0, 3); // +91
    areaCode = clean.slice(3, 6); // 141
    restNumber = clean.slice(6); // 2331030
  } else if (clean.length === 12) {
    // Case: 911412331030
    countryCode = clean.slice(0, 2); // 91
    areaCode = clean.slice(2, 5); // 141
    restNumber = clean.slice(5); // 2331030
  } else if (clean.length === 10) {
    // Case: 1412331030
    areaCode = clean.slice(0, 3); // 141
    restNumber = clean.slice(3); // 2331030
  } else {
    // fallback for unexpected format
    return phone;
  }

  return countryCode
    ? `${countryCode}-${areaCode}-${restNumber}`
    : `${areaCode}-${restNumber}`;
}