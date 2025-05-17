
import * as z from "zod";

export const contributionFormSchema = z.object({
  group_id: z.string({
    required_error: "Please select a group.",
  }),
  user_id: z.string({
    required_error: "Please select a member.",
  }),
  amount: z.coerce.number({
    required_error: "Please enter an amount.",
    invalid_type_error: "Amount must be a number.",
  }).positive({
    message: "Amount must be positive.",
  }),
  payment_method: z.enum(['M-Pesa', 'Bank Transfer', 'Cash'] as const, {
    required_error: "Please select a payment method.",
  }),
  description: z.string().optional(),
});

// We're not exporting ContributionFormValues type from here anymore
// Instead we'll use the one from types/contribution.ts
