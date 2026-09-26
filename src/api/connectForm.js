// Formspree endpoint for the /connect contact-gate form.
// Create a free form at https://formspree.io, then set VITE_FORMSPREE_CONNECT_ENDPOINT
// in a .env file (see .env.example) to your form's endpoint, e.g.
// https://formspree.io/f/xxxxxxxx
const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_CONNECT_ENDPOINT;

export async function submitConnectRequest({ name, email, phone, message }) {
  if (!FORMSPREE_ENDPOINT) {
    throw new Error(
      'Formspree endpoint is not configured. Set VITE_FORMSPREE_CONNECT_ENDPOINT in your .env file.'
    );
  }

  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      name,
      email,
      phone,
      message,
      _subject: `New /connect contact from ${name}`,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit contact request.');
  }
}
