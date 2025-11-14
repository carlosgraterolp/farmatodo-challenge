/**
 * Payment form formatting and validation utilities
 */

/** Format card number with spaces every 4 digits (e.g., "1234 5678 9012 3456") */
export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  const limited = cleaned.slice(0, 16);
  const parts: string[] = [];
  for (let i = 0; i < limited.length; i += 4) {
    parts.push(limited.slice(i, i + 4));
  }
  return parts.join(" ");
};

/** Format expiration date as MM/YY */
export const formatExpDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  const limited = cleaned.slice(0, 4);

  if (limited.length === 0) {
    return "";
  } else if (limited.length === 1) {
    return limited;
  } else if (limited.length === 2) {
    return `${limited}/`;
  } else {
    const month = limited.slice(0, 2);
    const year = limited.slice(2, 4);
    return `${month}/${year}`;
  }
};

/** Validate card number (must be exactly 16 digits) */
export const validateCardNumber = (cardNumber: string): boolean => {
  const cleanCardNumber = cardNumber.replace(/\s/g, "");
  return cleanCardNumber.length === 16 && /^\d{16}$/.test(cleanCardNumber);
};

/** Validate expiration date (MM/YY format, month must be 01-12) */
export const validateExpDate = (
  expDate: string
): { valid: boolean; error?: string } => {
  if (!/^\d{2}\/\d{2}$/.test(expDate)) {
    return {
      valid: false,
      error: "La fecha de expiración debe tener el formato MM/YY",
    };
  }
  const month = parseInt(expDate.slice(0, 2), 10);
  if (month < 1 || month > 12) {
    return { valid: false, error: "El mes debe estar entre 01 y 12" };
  }
  return { valid: true };
};

/** Validate CVV (must be 3 or 4 digits) */
export const validateCVV = (cvv: string): boolean => {
  return /^\d{3,4}$/.test(cvv);
};
