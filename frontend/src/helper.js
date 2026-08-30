export const api_base_url = import.meta.env.VITE_API_BASE_URL;
const TOKEN_KEY = "authToken";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);

  const res = await fetch(api_base_url + path, {
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      // Fallback for mobile browsers that block the cross-site auth cookie.
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  const data = await res.json();

  return {
    ok: res.ok,
    status: res.status,
    data,
  };
}

export function saveAuthToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}
