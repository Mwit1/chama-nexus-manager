
import * as z from "zod";
import { PaymentMethod } from "@/types/contribution";

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

export type ContributionFormValues = z.infer<typeof contributionFormSchema>;
