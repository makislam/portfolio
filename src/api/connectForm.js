// Formspree endpoint for the optional follow-up email field on /connect.
// Create a free form at https://formspree.io, then set VITE_FORMSPREE_CONNECT_ENDPOINT
// in a .env file (see .env.example) to your form's endpoint, e.g.
// https://formspree.io/f/xxxxxxxx
const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_CONNECT_ENDPOINT;

export async function submitFollowUp({ email, event }) {
  if (!FORMSPREE_ENDPOINT) {
    throw new Error(
      'Formspree endpoint is not configured. Set VITE_FORMSPREE_CONNECT_ENDPOINT in your .env file.'
    );
  }

  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      email,
      event: event || undefined,
      _subject: `New /connect follow-up request from ${email}`,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit. Please try again or email me directly.');
  }
}
