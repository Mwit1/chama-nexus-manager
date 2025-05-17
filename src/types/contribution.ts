
export type Group = {
  id: string;
  name: string;
};

export type Member = {
  id: string;
  full_name: string | null;
};

export type GroupMemberResponse = {
  user_id: string;
  profiles?: {
    id: string;
    full_name: string | null;
  } | null;
};

export type PaymentMethod = 'M-Pesa' | 'Bank Transfer' | 'Cash';

export type ContributionFormValues = {
  group_id: string;
  user_id: string;
  amount: number;
  payment_method: PaymentMethod;
  description?: string;
};
