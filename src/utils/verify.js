// Calls the Netlify backend — API key never leaves the server
const BACKEND_URL = process.env.EXPO_PUBLIC_VERIFY_URL || 'https://snapawake.netlify.app/.netlify/functions/verify';

export async function verifyPhoto(imageBase64, targetObject) {
  const response = await fetch(BACKEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, targetObject }),
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  const data = await response.json();
  return data.verified === true;
}
