export const apiBase = process.env.NEXT_PUBLIC_API_BASE || "";

export function validateInput(input: string) {
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(input);
}

export async function signup(username: string, password: string) {
  if (!validateInput(username) || !validateInput(password)) {
    throw new Error("入力はアルファベットか数字である必要があります");
  }

  const res = await fetch(apiBase + "/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "サインアップ失敗");
  return data;
}

export async function fetchProfile(
  setUsername: (username: string) => void,
  setAvatar: (avatar: string | null) => void
) {
  try {
    const res = await fetch(apiBase + "/profile", {
      method: "GET",
      credentials: "include", // Cookieを送信
    });

    const data = await res.json();
    if (data.status === "success" && data.username) {
      setUsername(data.username);
      setAvatar(apiBase + data.avatar);
    }
  } catch (err) {
    setUsername("ゲスト");
    setAvatar(null);
    console.error("profile fetch error:", err);
  }
}
