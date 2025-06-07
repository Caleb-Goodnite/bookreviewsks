import { json } from '@sveltejs/kit';
import { RECAPTCHA_SECRET_KEY } from '$env/static/private';

export async function POST({ request }) {
  const { token } = await request.json();

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
    });

    const result = await response.json();
    return json(result);
  } catch (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
}