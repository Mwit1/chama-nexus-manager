
import * as z from "zod";

export const addMemberByNameFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  role: z.enum(['admin', 'treasurer', 'member'], {
    required_error: "Please select a role for this member.",
  }),
});

export type AddMemberByNameFormValues = z.infer<typeof addMemberByNameFormSchema>;
