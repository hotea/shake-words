"use client";

import { createContext, useContext } from "react";
import type { AuthContextValue } from "./types";

const noOp = async () => {};
const noOpResult = async () => ({ error: null });

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: false,
  authEnabled: false,
  signInWithGitHub: noOp,
  signInWithEmail: noOpResult as AuthContextValue["signInWithEmail"],
  signUpWithEmail: noOpResult as AuthContextValue["signUpWithEmail"],
  resendConfirmation: noOpResult as AuthContextValue["resendConfirmation"],
  signOut: noOp,
});

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

export { AuthContext };
