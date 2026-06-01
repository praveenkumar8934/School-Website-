import { z } from "zod";

// Zod Schema representing all 22 required fields for school admissions
export const admissionsSchema = z.object({
  // Step 1: Student Information
  studentName: z.string().trim().min(2, "Student name must be at least 2 characters").max(100, "Too long"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Please select gender"),
  religion: z.string().trim().min(2, "Religion is required"),
  bloodGroup: z.string().min(1, "Please select blood group"),
  studentPhoto: z.any()
    .refine((val) => val && val.length > 0, "Student photo is required"),

  // Step 2: Parent & Contacts
  fatherName: z.string().trim().min(2, "Father's name must be at least 2 characters").max(100),
  motherName: z.string().trim().min(2, "Mother's name must be at least 2 characters").max(100),
  parentPhone: z.string().trim().regex(/^\d{10,15}$/, "Enter a valid 10-15 digit mobile number"),
  altPhone: z.string().trim().regex(/^\d{10,15}$/, "Enter a valid alternate mobile number").or(z.string().length(0)),
  parentEmail: z.string().trim().email("Please enter a valid parent email address"),
  emergencyContact: z.string().trim().regex(/^\d{10,15}$/, "Enter a valid emergency contact number"),

  // Step 3: Academic Profile
  prevSchool: z.string().trim().min(2, "Previous school name must be at least 2 characters"),
  prevClass: z.string().trim().min(1, "Previous class is required"),
  grade: z.string().min(1, "Class applying for is required"),
  marksheet: z.any()
    .refine((val) => val && val.length > 0, "Previous marksheet upload is required"),

  // Step 4: Residential Details & Notes
  aadharNumber: z.string().trim().regex(/^\d{12}$/, "Aadhar number must be exactly 12 digits"),
  aadharImage: z.any()
    .refine((val) => val && val.length > 0, "Aadhar card image upload is required"),
  address: z.string().trim().min(5, "Complete address must be at least 5 characters"),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().min(2, "State is required"),
  pinCode: z.string().trim().regex(/^\d{6}$/, "Pin code must be exactly 6 digits"),
  notes: z.string().max(1000, "Notes cannot exceed 1000 characters").optional().or(z.string().length(0)),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type AdmissionsFormValues = z.infer<typeof admissionsSchema>;
