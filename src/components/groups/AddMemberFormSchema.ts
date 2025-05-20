
import * as z from "zod";

export const addMemberFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.enum(['admin', 'treasurer', 'member'], {
    required_error: "Please select a role for this member.",
  }),
});

export type AddMemberFormValues = z.infer<typeof addMemberFormSchema>;
