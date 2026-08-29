export const api_base_url = "https://compilerx-at36.onrender.com";

export async function apiFetch(path, options = {}) {
  const res = await fetch(api_base_url + path, {
    mode: "cors",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}
