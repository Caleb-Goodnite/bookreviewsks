import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
  try {
    const { token, amount, cart } = await request.json();
    
    // Validate cart quantities against inventory
    // This would typically connect to your database to check inventory
    // For now, we'll just log the validation
    console.log("Validating cart quantities:", cart);
    
    // Calculate the total based on quantities in cart
    let calculatedTotal = 0;
    for (const item of cart) {
      const itemPrice = parseFloat(item.Price) || 0;
      const quantity = item.quantity || 1; // Default to 1 if quantity not specified
      calculatedTotal += itemPrice * quantity;
    }
    
    // Round to 2 decimal places
    calculatedTotal = Math.round(calculatedTotal * 100) / 100;
    
    console.log("Calculated total:", calculatedTotal);
    console.log("Submitted amount:", parseFloat(amount));
    
    // Verify the submitted amount matches our calculation (with small tolerance for rounding)
    if (Math.abs(calculatedTotal - parseFloat(amount)) > 0.01) {
      return json({
        success: false,
        error: "Price mismatch. Please refresh the page and try again."
      });
    }
    
    // Convert amount to cents (Square requires amount in cents)
    const amountInCents = Math.round(calculatedTotal * 100);
    
    // Generate a unique idempotency key
    const idempotencyKey = `payment_${Date.now()}`;
    
    // Create payment request body
    const paymentBody = {
      source_id: token,
      idempotency_key: idempotencyKey,
      amount_money: {
        amount: amountInCents,
        currency: 'USD'
      },
      location_id: env.SQUARE_LOCATION_ID
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
          id: data.payment.id 
        } 
      });
    } else {
      return json({ 
        success: false, 
        error: data.errors ? data.errors[0].detail : 'Payment failed'
      });
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return json({ 
      success: false, 
      error: error.message 
    });
  }
}