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
    
    try {
      // Make the payment request to Square
      console.log('Sending request to Square API...');
      const squareResponse = await fetch('https://connect.squareupsandbox.com/v2/payments', {
        method: 'POST',
        headers: {
          'Square-Version': '2023-09-25',
          'Authorization': `Bearer ${env.SQUARE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(paymentBody)
      });
      
      console.log(`Square API response status: ${squareResponse.status}`);
      
      let responseText;
      try {
        responseText = await squareResponse.text();
        console.log('Square API raw response:', responseText);
        
        if (!responseText) {
          throw new Error('Empty response from Square API');
        }
        
        const squareData = JSON.parse(responseText);
        
        if (squareData.payment) {
          console.log('Payment successful:', squareData.payment.id);
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
          throw new Error(errorMsg);
        }
      } catch (parseError) {
        console.error('Error parsing Square response:', parseError);
        throw new Error(`Invalid response from payment processor: ${parseError.message}`);
      }
    } catch (error) {
      console.error('Square API request failed:', error);
      throw error; // This will be caught by the outer try-catch
    }
  } catch (error) {
    console.error('Donation processing error:', error);
    return createErrorResponse(
      error.message || 'An unexpected error occurred. Please try again later.',
      500
    );
  }
}