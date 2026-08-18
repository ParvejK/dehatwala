import { z } from "zod";

export const MAX_CV_BYTES = 5 * 1024 * 1024;

export const ACCEPTED_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const ACCEPTED_CV_EXTENSIONS = [".pdf", ".doc", ".docx"];

const hasAcceptedExtension = (name: string) =>
  ACCEPTED_CV_EXTENSIONS.some((extension) => name.toLowerCase().endsWith(extension));

export const CareerApplicationSchema = z.object({
  name: z.string().trim().min(3, "Full name is required"),
  mobile_number: z.string().regex(/^[6-9][0-9]{9}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().trim().email("Enter a valid email address"),
  state_id: z.string().min(1, "State is required"),
  city_id: z.string().min(1, "City is required"),
  role: z.string().trim().min(2, "Tell us the role you are applying for"),
  message: z.string().trim().max(1000, "Keep this under 1000 characters").optional(),
  cv: z
    .custom<File>((value) => value instanceof File, "Upload your CV")
    // Some browsers report an empty `type` for .doc/.docx, so fall back to the extension.
    .refine((file) => ACCEPTED_CV_TYPES.includes(file.type) || hasAcceptedExtension(file.name), {
      message: "Only PDF, DOC or DOCX files are accepted",
    })
    .refine((file) => file.size <= MAX_CV_BYTES, { message: "File must be 5MB or smaller" }),
});

export type CareerApplicationForm = z.infer<typeof CareerApplicationSchema>;
