const API_BASE_URL = 'http://localhost:5000/api';

export async function generateDigest(notes) {
  const response = await fetch(`${API_BASE_URL}/digests/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ notes }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Something went wrong');
  }

  return response.json();
}

export async function fetchDigestHistory() {
  const response = await fetch(`${API_BASE_URL}/digests`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Something went wrong');
  }

  return response.json();
}