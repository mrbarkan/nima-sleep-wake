/**
 * Authentication-related type definitions
 */

import { User, Session } from "@supabase/supabase-js";

export type { User, Session };

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export interface AuthError {
  message: string;
  status?: number;
}

export interface SignUpCredentials {
  email: string;
  password: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}
