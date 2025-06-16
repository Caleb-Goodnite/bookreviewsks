import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

// Helper function to create error response
function createErrorResponse(message, status = 400) {
  console.error(`[${status}] ${message}`);
  return json(
    { success: false, error: message },
    { 
      status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      }
    }
  );
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400' // 24 hours
    }
  });
}

export async function POST({ request }) {
  // Handle CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  try {
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (e) {
      return createErrorResponse('Invalid request body', 400);
    }

    const { token, amount, verificationToken } = requestBody;

    // Validate required fields
    if (!token) {
      return createErrorResponse('Missing payment token', 400);
    }

    // Validate the amount
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return createErrorResponse('Invalid donation amount', 400);
    }
    
    // Convert amount to cents (Square requires amount in cents)
    const amountInCents = Math.round(numAmount * 100);
    
    // Generate a unique idempotency key (keeping under 45 character limit)
    const timestamp = Date.now().toString().slice(-8);
    const idempotencyKey = `don_${timestamp}${Math.floor(Math.random() * 10000)}`;
    
    console.log('Processing donation:', { amountInCents, idempotencyKey });
    
    // Create payment request body
    const paymentBody = {
      source_id: token,
      idempotency_key: idempotencyKey,
      amount_money: {
        amount: amountInCents,
        currency: 'USD'
      },
      location_id: env.SQUARE_LOCATION_ID,
      note: `Donation $${numAmount.toFixed(2)}`
    };
    
    // Make the payment request to Square
    const squareResponse = await fetch('https://connect.squareupsandbox.com/v2/payments', {
      method: 'POST',
      headers: {
        'Square-Version': '2023-09-25',
        'Authorization': `Bearer ${env.SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentBody)
    });
    
    let squareData;
    try {
      squareData = await squareResponse.json();
    } catch (e) {
      console.error('Error parsing Square response:', e);
      return createErrorResponse('Error processing payment', 500);
    }
    
    console.log('Square API response:', JSON.stringify(squareData, null, 2));
    
    if (squareData.payment) {
      return json(
        { 
          success: true, 
          payment: { 
            id: squareData.payment.id,
            amount: numAmount.toFixed(2)
          } 
        },
        {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          }
        }
      );
    } else {
      const errorMsg = squareData.errors?.[0]?.detail || 'Donation payment failed';
      console.error('Square payment error:', errorMsg, squareData.errors);
      return createErrorResponse(errorMsg, 400);
    }
  } catch (error) {
    console.error('Donation processing error:', error);
    return createErrorResponse(
      error.message || 'An unexpected error occurred. Please try again later.',
      500
    );
  }
}