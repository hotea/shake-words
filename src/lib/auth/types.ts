export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
  emailVerified?: boolean;
}

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  authEnabled: boolean;
  signInWithGitHub: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: string | null; needsConfirmation?: boolean }>;
  resendConfirmation: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  signInWithEmailCode?: (email: string, code: string) => Promise<{ error: string | null }>;
  sendEmailCode?: (email: string) => Promise<{ error: string | null }>;
  updateName?: (name: string) => Promise<{ error: string | null }>;
  sendVerifyLink?: () => Promise<{ error: string | null }>;
}
