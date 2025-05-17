
export type Member = {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  role: string;
  joined_at: string;
  user_id: string;
};

export type Group = {
  id: string;
  name: string;
  description: string | null;
};

export type UserRole = "admin" | "treasurer" | "member" | null;
