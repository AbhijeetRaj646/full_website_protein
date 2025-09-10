import { APP_CONFIG } from "../config";

const API_URL = `${APP_CONFIG.API_BASE_URL}/contact`;

export async function getContact() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function updateContact(contact, token) {
  const res = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(contact),
  });
  return res.json();
}
