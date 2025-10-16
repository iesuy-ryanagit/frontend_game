// src/lib/auth.ts
export const apiBase = process.env.NEXT_PUBLIC_API_BASE || "";

export function validateInput(input: string) {
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(input);
}

function isBrowser() {
  return typeof window !== "undefined";
}

export async function login(username: string, password: string) {
  if (!validateInput(username) || !validateInput(password)) {
    throw new Error("入力はアルファベットか数字である必要があります");
  }

  // If apiBase isn't configured, use a local mock for development
  if (!apiBase) {
    // simple fake delay
    await new Promise((r) => setTimeout(r, 300));
    const fakeJwt = "fake-jwt-token";
    if (isBrowser()) {
      localStorage.setItem("access_token", fakeJwt);
      localStorage.setItem("username", username);
      document.cookie = `jwt=${fakeJwt}; path=/; max-age=86400; SameSite=Lax`;
    }
    return { jwt: fakeJwt, username };
  }

  const res = await fetch(apiBase + "login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "ログイン失敗");

  if (isBrowser()) {
    localStorage.setItem("access_token", data.jwt);
    localStorage.setItem("username", username);
    document.cookie = `jwt=${data.jwt}; path=/; max-age=86400; SameSite=Lax`;
  }

  return data;
}

export async function fetchUserProfile() {
  if (!isBrowser()) return null;
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  if (!apiBase) {
    // return a mocked profile
    return { username: localStorage.getItem("username") || "guest" };
  }

  const res = await fetch(apiBase + "profile/", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "プロフィール取得失敗");

  return data;
}

export async function logout() {
  if (isBrowser()) {
    localStorage.clear();
    document.cookie = "jwt=; path=/; max-age=0";
  }

  if (!apiBase) return true;

  const res = await fetch(apiBase + "logout/", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  return res.ok;
}

// 2FA / OAuth / サインアップも同様に関数化 (stubs)
export async function loginWith2FA(_username: string, _password: string, _otp: string) {
  throw new Error("Not implemented");
}
export async function signUp(_username: string, _password: string) {
  throw new Error("Not implemented");
}
export async function setUpTfa() {
  throw new Error("Not implemented");
}
export async function loginWith42Oauth(_code: string) {
  throw new Error("Not implemented");
}
export async function Goto42Oauth() {
  throw new Error("Not implemented");
}
