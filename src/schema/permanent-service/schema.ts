import { z } from "zod";

export const employeeSchema = z.object({
  company_name: z.string().min(1, { message: "Company name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  owner_name: z.string().optional(),
  mobile_number: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters" })
    .max(20, { message: "Phone number must not exceed 20 characters" }),

  shift: z.string().min(1, { message: "Shift is required" }),
  state_id: z.string().min(1, "State is required"),
  city_id: z.string().min(1, "City is required"),
  address: z.string().min(1, { message: "Address is required" }),
  pincode: z
    .string()
    .min(5, { message: "Pincode must be at least 5 characters" })
    .max(10, { message: "Pincode must not exceed 10 characters" }),

  Mason: z.string().min(1, { message: "Please select a Skilled Mason type" }),
  mason_quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
  helper: z.string().min(1, { message: "Please select an Unskilled Helper type" }),
  helper_quantity: z.number().min(1, { message: "Quantity must be at least 1" }),

  service_id: z.number().optional(),
  permanent_service_id: z.number().optional(),

  // Faculties as an array of strings (assuming it's a list of facilities offered)
  faculties: z.array(z.string()).optional(),

  year: z.number().optional(),
  month: z.number().min(1).max(12, { message: "Month must be between 1 and 12" }),
  day: z.number().min(1).max(31, { message: "Day must be between 1 and 31" }),
  employee_position: z.string().min(1, { message: "Employee position is required" }),

  upload_photos: z
    .array(z.instanceof(File))
    .max(10, "Maximum 10 photos allowed")
    .optional(),

  alternative_work: z.string().optional(),

  // Terms and Conditions checkbox validation
  term_and_conditions: z.boolean().refine((val) => val === true, {
    message: "Terms and conditions must be accepted",
  }),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
