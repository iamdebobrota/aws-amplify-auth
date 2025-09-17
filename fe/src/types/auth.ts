export interface AuthState {
  isAuthenticated: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any | null;
  loading: boolean;
}

export interface AuthContextType extends AuthState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signIn: (username: string, password: string) => Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signUp: (username: string, password: string, email: string) => Promise<any>;
  signOut: () => Promise<void>;
  token: {
    idToken: string;
    accessToken: string;
  };
}
