
export type UserRole = 'admin' | 'treasurer' | 'member' | null;

export interface Group {
  id: string;
  name: string;
  description: string | null;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  member_count?: number;
}

export interface Member {
  id: string;
  user_id: string;
  full_name: string | null;
  phone_number: string | null;
  role: string;
  joined_at: string;
}
