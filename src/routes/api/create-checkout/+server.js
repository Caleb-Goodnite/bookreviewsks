import { json } from '@sveltejs/kit';
import { SQUARE_ACCESS_TOKEN } from '$env/static/private';
import { PUBLIC_SQUARE_LOCATION_ID } from '$env/static/public';

export async function POST({ request }) {
  try {
    const { items, redirectUrl } = await request.json();
    
    // Validate request
    if (!items || !items.length) {
      return json({ error: 'No items provided' }, { status: 400 });
    }
    
    // Create line items for Square API
    const lineItems = items.map(item => ({
      quantity: item.quantity,
      name: item.name,
      base_price_money: {
        amount: item.amount,
        currency: item.currency || 'USD'
      }
    }));
    
    // Ensure the redirect URL is absolute
    const origin = request.headers.get('origin') || 'http://localhost:5173';
    const fullRedirectUrl = redirectUrl.startsWith('http') 
      ? redirectUrl 
      : `${origin}${redirectUrl.startsWith('/') ? '' : '/'}${redirectUrl}`;
    
    console.log('Redirect URL:', fullRedirectUrl);
    
    // Create checkout request
    const checkoutRequest = {
      idempotency_key: crypto.randomUUID(),
      order: {
        location_id: PUBLIC_SQUARE_LOCATION_ID,
        line_items: lineItems
      },
      redirect_url: fullRedirectUrl,
      checkout_options: {
        redirect_url: fullRedirectUrl
      }
    };
    
    console.log('Checkout request:', JSON.stringify(checkoutRequest, null, 2));
    
    // Call Square API
    const response = await fetch('https://connect.squareupsandbox.com/v2/online-checkout/payment-links', {
      method: 'POST',
      headers: {
        'Square-Version': '2023-09-25',
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(checkoutRequest)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('Square API error:', result);
      return json({ error: result.errors?.[0]?.detail || 'Error creating checkout' }, { status: 500 });
    }
    
    return json({
      checkoutUrl: result.payment_link.url,
      checkoutId: result.payment_link.id
    });
  } catch (error) {
    console.error('Error creating checkout:', error);
    return json({ error: error.message }, { status: 500 });
  }
}