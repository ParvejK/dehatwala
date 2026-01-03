import { z } from "zod";

export const FormJoinUsSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  state_id: z.string().min(1, "State is required"),
  city_id: z.string().min(1, "City is required"),
  work_experience: z.number().optional(),
  shift: z.string().optional(),
  joining: z.string().optional(), // You may want to use z.date() if joining is a date
  mobile_number: z.string().regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
  // password: z.string().min(8, "Password must be at least 8 characters"),
  // password_confirmation: z.string().min(8, "Password confirmation must be at least 8 characters"),
  skills: z.array(
    z.object({
      skill_name: z.string().min(1, "Skill name is required"),
      skill_type: z.string().min(1, "Skill type is required"),
      work_with_skill: z.array(z.string()).optional(),
    })
  ),
  // categories: z.object({}).optional(), // Adjust as needed based on the structure of categories
});

export type FormJoinUsType = z.infer<typeof FormJoinUsSchema>;
