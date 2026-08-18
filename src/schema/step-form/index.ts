import { z } from "zod";

export const FormJoinUsSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  // Nullable server-side (`direct_joins.email`) and absent from the current
  // registration design, so it is optional here.
  email: z.string().email("Invalid email address").optional(),
  state_id: z.string().min(1, "State is required"),
  city_id: z.string().min(1, "City is required"),
  work_experience: z.string().optional(),
  shift: z.string().optional(),
  joining: z.string().optional(),
  mobile_number: z.string().regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
  other_work_text: z.string().optional(),
  works: z.array(z.string()).min(1, "Select at least one work type"),

  // Collected by the registration form. NOTE: `direct_joins` has no columns for
  // these yet, so saveJoinUsData currently discards them.
  current_location: z.string().optional(),
  transport: z.string().optional(),
  availability: z.string().optional(),
});

export type FormJoinUsType = z.infer<typeof FormJoinUsSchema>;
