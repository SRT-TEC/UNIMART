import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const tokenKey = "unimart_access_token";
const expoHost = Constants.expoConfig?.hostUri?.split(":")[0] ?? "127.0.0.1";

export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? `http://${expoHost}:8080`
).replace(/\/+$/, "");

type TokenResponse = {
  access_token: string;
  token_type: string;
};

type UserRegistration = {
  full_name: string;
  email: string;
  password: string;
};

async function request<T>(path: string, body?: object): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new Error(`Cannot reach the UniMart API at ${API_BASE_URL}.`);
  }

  const result: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const detail =
      typeof result === "object" && result !== null && "detail" in result
        ? result.detail
        : null;
    throw new Error(
      typeof detail === "string" ? detail : `Request failed (${response.status}).`,
    );
  }

  return result as T;
}

async function storeToken(token: string): Promise<void> {
  if (Platform.OS === "web") {
    if (typeof window === "undefined") {
      throw new Error("Token storage is unavailable.");
    }
    window.localStorage.setItem(tokenKey, token);
    return;
  }

  await SecureStore.setItemAsync(tokenKey, token);
}

export function getAuthToken(): Promise<string | null> | string | null {
  if (Platform.OS === "web") {
    return typeof window === "undefined"
      ? null
      : window.localStorage.getItem(tokenKey);
  }

  return SecureStore.getItemAsync(tokenKey);
}

export async function registerUser(user: UserRegistration): Promise<void> {
  await request("/api/v1/auth/register", user);
}

export async function verifyEmailToken(token: string): Promise<void> {
  await request(
    `/api/v1/auth/verify-email/link?token=${encodeURIComponent(token)}`,
  );
}

export async function resendVerificationEmail(email: string): Promise<void> {
  await request(
    `/api/v1/auth/resend-verification?email=${encodeURIComponent(email)}&method=link`,
  );
}

export async function loginUser(email: string, password: string): Promise<void> {
  const result = await request<TokenResponse>("/api/v1/auth/login", {
    email,
    password,
  });
  await storeToken(result.access_token);
}