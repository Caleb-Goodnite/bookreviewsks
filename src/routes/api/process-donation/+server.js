import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
  try {
    const { token, amount /*, captchaToken*/ } = await request.json(); // captchaToken removed

    // Verify Google reCAPTCHA - DISABLED
    /*
    if (!env.RECAPTCHA_SECRET_KEY) {
      console.error('RECAPTCHA_SECRET_KEY is not set in environment variables.');
      return json({ success: false, error: 'Server configuration error.' }, { status: 500 });
    }
    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`
    });
    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      console.error('reCAPTCHA verification failed:', recaptchaData['error-codes']);
      return json({
        success: false,
        error: "CAPTCHA verification failed. Please try again."
      }, { status: 400 });
    }
    */

    // Validate the amount
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return json({
        success: false,
        error: "Invalid donation amount."
      }, { status: 400 });
    }
    
    // Convert amount to cents (Square requires amount in cents)
    const amountInCents = Math.round(numAmount * 100);
    
    // Generate a unique idempotency key (keeping under 45 character limit)
    const timestamp = Date.now().toString().slice(-8); // Use last 8 digits of timestamp
    const idempotencyKey = `don_${timestamp}${Math.floor(Math.random() * 10000)}`; // Much shorter key
    
    // Create payment request body
    const paymentBody = {
      source_id: token,
      idempotency_key: idempotencyKey,
      amount_money: {
        amount: amountInCents,
        currency: 'USD'
      },
      location_id: env.SQUARE_LOCATION_ID,
      note: "Donation" // Shorter note
    };
    
    // Make the payment request to Square
    const response = await fetch('https://connect.squareupsandbox.com/v2/payments', {
      method: 'POST',
      headers: {
        'Square-Version': '2023-09-25',
        'Authorization': `Bearer ${env.SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentBody)
    });
    
    const data = await response.json();
    
    if (data.payment) {
      return json({ 
        success: true, 
        payment: { 
          id: data.payment.id,
          amount: amount
        } 
      });
    } else {
      return json({ 
        success: false, 
        error: data.errors ? data.errors[0].detail : 'Donation payment failed'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Donation processing error:', error);
    return json({ 
      success: false, 
      error: 'An unexpected error occurred. Please try again later.'
    }, { status: 500 });
  }
}