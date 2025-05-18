
export type LoanStatus = 'Pending' | 'Approved' | 'Active' | 'Overdue' | 'Repaid' | 'Rejected';

export type Loan = {
  id: string;
  user_id: string;
  member_name: string;
  group_id: string;
  group_name: string;
  amount: number;
  interest_rate: number;
  issued_date: string | null;
  due_date: string | null;
  application_date: string;
  status: LoanStatus;
  purpose: string;
  balance: number;
};

export type LoanFormValues = {
  group_id: string;
  user_id: string;
  amount: number;
  interest_rate: number;
  purpose: string;
  payment_period: number;
};

export type RepaymentFormValues = {
  amount: number;
  payment_method: string;
  reference_number?: string;
};
