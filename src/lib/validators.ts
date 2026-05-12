/* ============================================
   VALIDATORS — KULIT NUSANTARA
   Form & input validation functions
   ============================================ */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate email address
 */
export function validateEmail(email: string): ValidationResult {
  if (!email.trim()) return { valid: true }; // Email is optional
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(email)) return { valid: false, error: 'Format email tidak valid' };
  return { valid: true };
}

/**
 * Validate phone number (Indonesian format)
 */
export function validatePhone(phone: string): ValidationResult {
  const cleaned = phone.replace(/[\s-]/g, '');
  // The normalized format we want is just the numbers starting with 8
  // Minimum 10 digits (e.g., 8123456789)
  const regex = /^8[0-9]{9,12}$/;
  
  if (!cleaned) return { valid: false, error: 'Nomor telepon wajib diisi' };
  
  // If it still starts with +62, 62, or 0, it means it hasn't been normalized yet
  let normalized = cleaned;
  if (normalized.startsWith('+62')) normalized = normalized.slice(3);
  else if (normalized.startsWith('62')) normalized = normalized.slice(2);
  else if (normalized.startsWith('0')) normalized = normalized.slice(1);
  
  if (!regex.test(normalized)) return { valid: false, error: 'Format nomor telepon tidak valid (min. 10 digit)' };
  
  return { valid: true };
}

/**
 * Validate required field
 */
export function validateRequired(value: string, fieldName: string): ValidationResult {
  if (!value.trim()) return { valid: false, error: `${fieldName} wajib diisi` };
  return { valid: true };
}

/**
 * Validate minimum length
 */
export function validateMinLength(value: string, min: number, fieldName: string): ValidationResult {
  if (value.length < min) return { valid: false, error: `${fieldName} minimal ${min} karakter` };
  return { valid: true };
}

/**
 * Validate postal code (Indonesian)
 */
export function validatePostalCode(code: string): ValidationResult {
  const regex = /^[0-9]{5}$/;
  if (!code.trim()) return { valid: false, error: 'Kode pos wajib diisi' };
  if (!regex.test(code)) return { valid: false, error: 'Kode pos harus 5 digit angka' };
  return { valid: true };
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate checkout form
 */
export interface CheckoutData {
  name: string;
  email: string;
  phone: string;
  address: string;
  province: string;
  city: string;
  district: string;
  village: string;
  notes?: string;
}

export function validateCheckoutForm(data: CheckoutData): Record<string, string> {
  const errors: Record<string, string> = {};

  const nameResult = validateRequired(data.name, 'Nama');
  if (!nameResult.valid) errors.name = nameResult.error!;

  const emailResult = validateEmail(data.email);
  if (!emailResult.valid) errors.email = emailResult.error!;

  const phoneResult = validatePhone(data.phone);
  if (!phoneResult.valid) errors.phone = phoneResult.error!;

  const addressResult = validateRequired(data.address, 'Alamat');
  if (!addressResult.valid) errors.address = addressResult.error!;

  const provinceResult = validateRequired(data.province, 'Provinsi');
  if (!provinceResult.valid) errors.province = provinceResult.error!;

  const cityResult = validateRequired(data.city, 'Kota/Kabupaten');
  if (!cityResult.valid) errors.city = cityResult.error!;

  const districtResult = validateRequired(data.district, 'Kecamatan');
  if (!districtResult.valid) errors.district = districtResult.error!;

  const villageResult = validateRequired(data.village, 'Kelurahan/Desa');
  if (!villageResult.valid) errors.village = villageResult.error!;

  return errors;
}
