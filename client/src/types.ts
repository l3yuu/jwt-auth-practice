// client/src/types.ts
export interface AuthResponse {
  token: string;
  user?: {
    id: string;
    username: string;
  };
}

export interface LoginError {
  message: string;
}