import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
  try {
    const { token, amount } = await request.json();
    
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
    
    // Generate a unique idempotency key
    const idempotencyKey = `donation_${Date.now()}_${crypto.randomUUID()}`;
    
    // Create payment request body
    const paymentBody = {
      source_id: token,
      idempotency_key: idempotencyKey,
      amount_money: {
        amount: amountInCents,
        currency: 'USD'
      },
      location_id: env.SQUARE_LOCATION_ID,
      note: "Donation to Book ReViews"
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