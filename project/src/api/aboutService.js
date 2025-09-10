import { APP_CONFIG } from "../config";

const API_URL = `${APP_CONFIG.API_BASE_URL}/about`;

export async function getAbout() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function updateAbout(content, token) {
  const res = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  return res.json();
}
