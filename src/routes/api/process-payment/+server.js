import { json } from '@sveltejs/kit';
import { randomUUID } from 'crypto';

// Step 1: Add a function to make HTTP requests to Square API
async function squareRequest(endpoint, data) {
  const response = await fetch(`https://connect.squareupsandbox.com/v2/${endpoint}`, {
    method: 'POST',
    headers: {
      'Square-Version': '2023-09-25',
      'Authorization': 'Bearer EAAAlzlvvRjSrhUHBMcZ3HG5Op3YI_hSF5VcSkKE_chjr1rYGwOX6gxiXvNMhV9j',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  return await response.json();
}

export async function POST({ request }) {
  try {
    const { token, amount } = await request.json();
    
    console.log('Payment token received:', token);
    console.log('Amount:', amount);
    
    // Step 2: Prepare payment data
    const paymentData = {
      source_id: token,
      idempotency_key: randomUUID(),
      amount_money: {
        amount: Math.round(parseFloat(amount) * 100), // Convert to cents
        currency: 'USD'
      }
    };
    
    // Step 3: Make the request to Square API
    const result = await squareRequest('payments', paymentData);
    console.log('Square API response:', result);
    
    if (result.payment) {
      return json({ 
        success: true, 
        payment: result.payment
      });
    } else {
      return json({ 
        success: false, 
        error: result.errors || 'Payment failed'
      });
    }
  } catch (error) {
    console.log('Payment error:', error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
}