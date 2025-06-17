import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
// import { RECAPTCHA_SECRET_KEY } from '$env/static/private'; // reCAPTCHA disabled
import PocketBase from 'pocketbase';

export async function POST({ request, fetch: svelteKitFetch }) {
  let pb;
  try {
    // Log the incoming request details
    console.log('--- INCOMING REQUEST ---');
    const requestBody = await request.json();
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    // Log environment variables (without sensitive data)
    console.log('--- ENVIRONMENT ---');
    console.log('POCKETBASE_URL:', env.POCKETBASE_URL ? '***SET***' : 'MISSING');
    console.log('SQUARE_ACCESS_TOKEN:', env.SQUARE_ACCESS_TOKEN ? '***SET***' : 'MISSING');
    console.log('SQUARE_LOCATION_ID:', env.SQUARE_LOCATION_ID ? '***SET***' : 'MISSING');
    console.log('------------------------------------');

    const { token, clientAmount, cart, customerEmail, shippingInfo } = requestBody;
    
    // Validate required fields
    if (!token) {
      console.error('Missing required field: token');
      return json({ success: false, error: 'Missing payment token' }, { status: 400 });
    }
    if (!clientAmount) {
      console.error('Missing required field: clientAmount');
      return json({ success: false, error: 'Missing payment amount' }, { status: 400 });
    }
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      console.error('Invalid or empty cart');
      return json({ success: false, error: 'Cart is empty or invalid' }, { status: 400 });
    }

    // reCAPTCHA Verification Block Disabled
    // if (!recaptchaToken) {
    //   console.warn('Payment attempt without reCAPTCHA token.');
    //   return json({ success: false, message: 'reCAPTCHA verification failed. Please try again.' }, { status: 400 });
    // }
    // try {
    //   const recaptchaVerificationResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //     body: `secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    //   });
    //   const recaptchaData = await recaptchaVerificationResponse.json();
    //   if (!recaptchaData.success) {
    //     console.warn('reCAPTCHA verification unsuccessful:', recaptchaData['error-codes']);
    //     return json({ success: false, message: 'reCAPTCHA verification failed. Please try again.' }, { status: 400 });
    //   }
    //   console.log('reCAPTCHA verified successfully.');
    // } catch (error) {
    //   console.error('Error during reCAPTCHA verification:', error);
    //   return json({ success: false, message: 'Error during reCAPTCHA verification. Please try again later.' }, { status: 500 });
    // }

    // Check environment variables with more detailed error messages
    const missingVars = [];
    if (!env.POCKETBASE_URL) missingVars.push('POCKETBASE_URL');
    if (!env.SQUARE_ACCESS_TOKEN) missingVars.push('SQUARE_ACCESS_TOKEN');
    if (!env.SQUARE_LOCATION_ID) missingVars.push('SQUARE_LOCATION_ID');
    
    if (missingVars.length > 0) {
      const errorMsg = `Missing required environment variables: ${missingVars.join(', ')}`;
      console.error(errorMsg);
      return json({ 
        success: false, 
        error: 'Server configuration error.',
        details: errorMsg
      }, { status: 500 });
    }

    pb = new PocketBase(env.POCKETBASE_URL);

    let serverCalculatedTotal = 0;
    const verifiedCartItems = [];
    let inventoryCheckFailed = false;

    for (const cartItem of cart) {
      console.log('Processing cart item:', cartItem);
      
      if (!cartItem.id || !cartItem.quantity || cartItem.quantity <= 0) {
        console.error('Invalid cart item structure:', cartItem);
        inventoryCheckFailed = true;
        break;
      }
      
      try {
        console.log(`Fetching book with ID: ${cartItem.id}`);
        const book = await pb.collection('books').getOne(cartItem.id);
        console.log('Retrieved book:', book);
        
        if (!book) {
          console.error('Book not found for ID:', cartItem.id);
          inventoryCheckFailed = true;
          break;
        }
        
        if (book.stock < cartItem.quantity) {
          console.error(`Insufficient stock for ${book.title}. Requested: ${cartItem.quantity}, Available: ${book.stock}`);
          inventoryCheckFailed = true;
          break;
        }
        
        // Use the price from the book record or fall back to the cart item price
        const price = parseFloat(book.price || cartItem.price || 0);
        console.log(`Calculating price: ${price} * ${cartItem.quantity} = ${price * cartItem.quantity}`);
        serverCalculatedTotal += price * cartItem.quantity;
        verifiedCartItems.push({
          id: book.id,
          title: book.title,
          price: price, // Standardized to lowercase 'price'
          quantity: cartItem.quantity,
          // Add any other fields from 'book' that send-email might need
        });
      } catch (err) {
        console.error(`Error fetching book ${cartItem.id}:`, err);
        inventoryCheckFailed = true;
        break;
      }
    }

    if (inventoryCheckFailed) {
      return json({ success: false, error: 'Inventory validation failed. Some items may be out of stock or invalid.' }, { status: 400 });
    }

    serverCalculatedTotal = Math.round(serverCalculatedTotal * 100) / 100;

    // Sanity check client amount against server-calculated amount
    if (Math.abs(serverCalculatedTotal - parseFloat(clientAmount)) > 0.01) {
      console.warn(`Price mismatch: Client amount ${clientAmount}, Server amount ${serverCalculatedTotal}`);
      return json({ success: false, error: 'Price mismatch. Please refresh and try again.' }, { status: 400 });
    }

    const amountInCents = Math.round(serverCalculatedTotal * 100);
    if (amountInCents <= 0) {
        return json({ success: false, error: 'Invalid payment amount.' }, { status: 400 });
    }

    const idempotencyKey = `payment_${Date.now()}`;
    const paymentBody = {
      source_id: token,
      idempotency_key: idempotencyKey,
      amount_money: {
        amount: amountInCents,
        currency: 'USD'
      },
      location_id: env.SQUARE_LOCATION_ID,
      // You could add a note here, e.g., customerEmail or order summary if desired
      // note: `Order for ${customerEmail || 'N/A'}`.substring(0, 45) // Max 45 chars for note
    };

    const squareResponse = await fetch('https://connect.squareupsandbox.com/v2/payments', {
      method: 'POST',
      headers: {
        'Square-Version': '2023-09-25',
        'Authorization': `Bearer ${env.SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentBody)
    });

    const squareData = await squareResponse.json();

    if (squareData.payment) {
      // Payment successful, now record order and trigger emails/inventory update
      const orderData = {
        square_payment_id: squareData.payment.id,
        customer_email: customerEmail || null,
        items: verifiedCartItems, // Store verified items
        total_amount: serverCalculatedTotal,
        status: 'completed', // Or 'paid', 'processing'
        order_date: new Date().toISOString(),
        shipping_address_line1: shippingInfo?.line1 || null,
        shipping_address_line2: shippingInfo?.line2 || null,
        shipping_city: shippingInfo?.city || null,
        shipping_state: shippingInfo?.state || null,
        shipping_zip: shippingInfo?.zip || null,
        shipping_name: shippingInfo?.name || null,
      };

      try {
        const createdOrder = await pb.collection('orders').create(orderData);
        console.log('Order created in PocketBase:', createdOrder.id);

        // Call send-email endpoint (which also handles inventory update)
        // Pass the SvelteKit fetch for internal requests
        const emailResponse = await svelteKitFetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderDetails: { // Ensure send-email uses 'price' consistently if it reads from here
              id: squareData.payment.id, // Use Square payment ID as order number
              cart: verifiedCartItems,
              total: serverCalculatedTotal,
              shippingInfo: shippingInfo, // Pass along shipping info
            },
            customerEmail: customerEmail
          })
        });
        
        if (!emailResponse.ok) {
            const emailErrorData = await emailResponse.json().catch(() => ({}));
            console.error('Error calling send-email endpoint:', emailResponse.status, emailErrorData.error || 'Unknown email error');
            // Decide if this is critical enough to tell the user payment succeeded but confirmation failed
        }

      } catch (orderError) {
        console.error('Error creating order in PocketBase or calling send-email:', orderError);
        // Payment succeeded but order recording/email failed. This is a critical state to log/alert.
        // Inform user payment was successful but there's an issue with order confirmation.
        return json({
          success: true, // Payment was successful
          payment: { id: squareData.payment.id },
          warning: 'Payment processed, but there was an issue with order confirmation. Please contact support.'
        });
      }

      return json({ success: true, payment: { id: squareData.payment.id } });

    } else {
      console.error('Square payment failed:', squareData.errors);
      return json({ success: false, error: squareData.errors ? squareData.errors[0].detail : 'Payment failed at Square' }, { status: 400 });
    }

  } catch (error) {
    console.error('Overall payment processing error:', error);
    if (error instanceof SyntaxError) { // From await request.json()
        return json({ success: false, error: 'Invalid request format.' }, { status: 400 });
    }
    return json({ success: false, error: 'An unexpected error occurred during payment processing.' }, { status: 500 });
  }
}