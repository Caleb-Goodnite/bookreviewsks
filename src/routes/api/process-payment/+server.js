import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  try {
    const { token, amount } = await request.json();
    
    // For testing, just return success
    // In production, you would process the payment with Square's API
    return json({ 
      success: true, 
      payment: { 
        id: 'test-payment',
        amount: amount,
        status: 'SUCCESS'
      } 
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
}