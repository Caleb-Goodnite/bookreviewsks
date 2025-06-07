import { json } from '@sveltejs/kit';
// reCAPTCHA verification is currently disabled
// This is a mock implementation that always succeeds
export async function POST() {
  // In a production environment, you would verify the reCAPTCHA token here
  // For now, we'll just return success to allow the form submission
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}