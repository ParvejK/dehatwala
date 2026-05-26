import { z } from "zod";

export const FormJoinUsSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  state_id: z.string().min(1, "State is required"),
  city_id: z.string().min(1, "City is required"),
  work_experience: z.string().optional(),
  shift: z.string().optional(),
  joining: z.string().optional(),
  mobile_number: z.string().regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
  other_work_text: z.string().optional(),
  works: z.array(z.string()).min(1, "Select at least one work type"),
});

export type FormJoinUsType = z.infer<typeof FormJoinUsSchema>;
