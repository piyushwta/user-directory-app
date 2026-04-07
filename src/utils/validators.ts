import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["Admin", "Editor", "Viewer"]),
  status: z.enum(["Active", "Inactive"]),
  language: z.string().min(1, "Language required"),
});

export type UserFormData = z.infer<typeof userSchema>;
