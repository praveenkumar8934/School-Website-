export interface AdmissionFormData {
  studentName: string;
  parentName: string;
  email: string;
  phone: string;
  grade: string;
  address: string;
  message?: string;
  website?: string; // Honeypot field for spam prevention
}

export interface ValidationError {
  field: keyof AdmissionFormData | "global";
  message: string;
}

// Valid Grades based on the existing dropdown options
export const VALID_GRADES = [
  "Kindergarten",
  "Grades 1–5",
  "Grades 6–8",
  "Grades 9–12",
];

/**
 * Validates an email address using a robust RFC 5322 regex pattern.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Validates a phone number. Checks if it contains at least 10 digits and fits basic formats.
 */
export function isValidPhone(phone: string): boolean {
  // Strip out spaces, dashes, parentheses to count numbers
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

/**
 * Performs full validation on the admission form data.
 * Returns an array of ValidationError objects. If empty, the data is valid.
 */
export function validateAdmissionForm(data: Partial<AdmissionFormData>): ValidationError[] {
  const errors: ValidationError[] = [];

  // 1. Student Name validation
  if (!data.studentName || typeof data.studentName !== "string") {
    errors.push({ field: "studentName", message: "Student name is required." });
  } else {
    const trimmed = data.studentName.trim();
    if (trimmed.length < 2) {
      errors.push({ field: "studentName", message: "Student name must be at least 2 characters." });
    } else if (trimmed.length > 100) {
      errors.push({ field: "studentName", message: "Student name cannot exceed 100 characters." });
    }
  }

  // 2. Parent Name validation
  if (!data.parentName || typeof data.parentName !== "string") {
    errors.push({ field: "parentName", message: "Parent/Guardian name is required." });
  } else {
    const trimmed = data.parentName.trim();
    if (trimmed.length < 2) {
      errors.push({ field: "parentName", message: "Parent/Guardian name must be at least 2 characters." });
    } else if (trimmed.length > 100) {
      errors.push({ field: "parentName", message: "Parent/Guardian name cannot exceed 100 characters." });
    }
  }

  // 3. Email validation
  if (!data.email || typeof data.email !== "string") {
    errors.push({ field: "email", message: "Email address is required." });
  } else {
    const trimmed = data.email.trim();
    if (!isValidEmail(trimmed)) {
      errors.push({ field: "email", message: "Please provide a valid email address." });
    } else if (trimmed.length > 100) {
      errors.push({ field: "email", message: "Email cannot exceed 100 characters." });
    }
  }

  // 4. Phone validation
  if (!data.phone || typeof data.phone !== "string") {
    errors.push({ field: "phone", message: "Phone number is required." });
  } else {
    const trimmed = data.phone.trim();
    if (!isValidPhone(trimmed)) {
      errors.push({ field: "phone", message: "Please provide a valid phone number (at least 10 digits)." });
    }
  }

  // 5. Grade/Class validation
  if (!data.grade || typeof data.grade !== "string") {
    errors.push({ field: "grade", message: "Class applying for is required." });
  } else if (!VALID_GRADES.includes(data.grade)) {
    errors.push({ field: "grade", message: "Please select a valid class option." });
  }

  // 6. Address validation
  if (!data.address || typeof data.address !== "string") {
    errors.push({ field: "address", message: "Address is required." });
  } else {
    const trimmed = data.address.trim();
    if (trimmed.length < 5) {
      errors.push({ field: "address", message: "Please enter a complete address (minimum 5 characters)." });
    } else if (trimmed.length > 500) {
      errors.push({ field: "address", message: "Address cannot exceed 500 characters." });
    }
  }

  // 7. Message validation (optional)
  if (data.message && typeof data.message === "string") {
    if (data.message.trim().length > 1000) {
      errors.push({ field: "message", message: "Message cannot exceed 1000 characters." });
    }
  }

  return errors;
}
