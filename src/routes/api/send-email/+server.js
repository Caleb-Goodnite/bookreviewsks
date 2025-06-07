import { json } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import PocketBase from 'pocketbase';
import { env } from '$env/dynamic/private';

// Create a transporter using Gmail SMTP with environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD
  },
  // Add these options to help with reliability
  pool: true,
  maxConnections: 1,
  maxMessages: 5,
  rateDelta: 20000,
  rateLimit: 5
});

export async function POST({ request }) {
  let pb;
  try {
    const data = await request.json();
    const { orderDetails, customerEmail } = data;

    if (!env.POCKETBASE_URL) {
      console.error('Missing POCKETBASE_URL for send-email endpoint.');
      return json({ success: false, error: 'Server configuration error for email processing.' }, { status: 500 });
    }
    pb = new PocketBase(env.POCKETBASE_URL);
    
    // Get cart items and total
    const cartItems = orderDetails.cart || [];
    const total = orderDetails.total || '0.00';
    
    // Use the Square payment/order ID as the order number, fallback if missing
    const orderNumber = orderDetails.id || 'Not Available';
    
    // Create HTML for cart items
    const itemsHtml = cartItems.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.title}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity || 1}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${(parseFloat(item.Price) * (item.quantity || 1)).toFixed(2)}</td>
      </tr>
    `).join('');
    
    // Create customer email HTML
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4CAF50;">Thank You for Your Order!</h1>
        <p>Dear ${orderDetails.shippingInfo?.name || 'Customer'},</p>
        <p>Your order has been successfully processed. We will ship your items to the address provided shortly.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Order Summary</h2>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> ${orderDetails.shippingInfo?.name || ''}</p>
          <p><strong>Email:</strong> ${customerEmail || ''}</p>
          <p><strong>Address:</strong><br>
            ${orderDetails.shippingInfo?.line1 || ''}<br>
            ${orderDetails.shippingInfo?.line2 ? orderDetails.shippingInfo.line2 + '<br>' : ''}
            ${orderDetails.shippingInfo?.city || ''}, ${orderDetails.shippingInfo?.state || ''} ${orderDetails.shippingInfo?.zip || ''}
          </p>
          
          <h3>Items Ordered:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f2f2f2;">
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Item</th>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Quantity</th>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Price</th>
            </tr>
            ${itemsHtml}
            <tr>
              <td colspan="2" style="text-align: right; padding: 8px; font-weight: bold;">Total:</td>
              <td style="padding: 8px; font-weight: bold;">$${total}</td>
            </tr>
          </table>
        </div>
        
        <p>If you have any questions about your order, please don't hesitate to contact us.</p>
        
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <div style="color: #666; font-size: 14px;">
          <p>If you have any questions about your order, please contact us:</p>
          <p>Email: newtonbkreviews@sbcglobal.net</p>
          <p>Phone: (316) 283-3442</p>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
        </div>
      </div>
    `;
    
    // Create owner email HTML
    const ownerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4CAF50;">New Order Received</h1>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Customer:</strong> ${orderDetails.shippingInfo?.name || 'N/A'}</p>
        <p><strong>Email:</strong> ${customerEmail || 'N/A'}</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Order Details</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f2f2f2;">
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Item</th>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Quantity</th>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Price</th>
            </tr>
            ${itemsHtml}
            <tr>
              <td colspan="2" style="text-align: right; padding: 8px; font-weight: bold;">Total:</td>
              <td style="padding: 8px; font-weight: bold;">$${total}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Shipping Information</h2>
          <p>
            ${orderDetails.shippingInfo?.name || ''}<br>
            ${orderDetails.shippingInfo?.line1 || ''}<br>
            ${orderDetails.shippingInfo?.line2 ? orderDetails.shippingInfo.line2 + '<br>' : ''}
            ${orderDetails.shippingInfo?.city || ''}, ${orderDetails.shippingInfo?.state || ''} ${orderDetails.shippingInfo?.zip || ''}
          </p>
        </div>
        
        <p>Please process this order as soon as possible.</p>
        <p><strong>Note:</strong> You can look up this order in Square Dashboard using the Order Number.</p>
      </div>
    `;
    
    try {
      // Send email to customer
      const customerMailOptions = {
        from: '"Book ReViews" <' + env.EMAIL_USER + '>',
        to: customerEmail,
        subject: 'Your Book ReViews Order Confirmation',
        html: customerEmailHtml,
        priority: 'high',
        // Add headers to help avoid spam filters
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'High'
        }
      };
      
      // Use a promise with timeout to ensure email sending doesn't hang
      const sendCustomerEmail = async () => {
        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Email sending timed out'));
          }, 30000);
          
          transporter.sendMail(customerMailOptions, (error, info) => {
            clearTimeout(timeout);
            if (error) {
              console.error('Customer email error:', error);
              reject(error);
            } else {
              console.log('Customer confirmation email sent:', info.response);
              resolve(info);
            }
          });
        });
      };
      
      await sendCustomerEmail();

      // If customer email was successful, proceed to update inventory
      try {
        console.log('Attempting to update inventory for order:', orderNumber);
        for (const item of cartItems) {
          if (!item.id || !item.quantity) {
            console.warn('Skipping inventory update for item with missing id or quantity:', item);
            continue;
          }
          const bookRecord = await pb.collection('books').getOne(item.id);
          const newStock = (parseInt(bookRecord.stock) || 0) - item.quantity;
          await pb.collection('books').update(item.id, { stock: newStock < 0 ? 0 : newStock }); // Ensure stock doesn't go negative
          console.log(`Updated stock for book ${item.id} (Order: ${orderNumber}) to ${newStock < 0 ? 0 : newStock}`);
        }
        console.log('Inventory update successful for order:', orderNumber);
      } catch (inventoryUpdateError) {
        console.error(`CRITICAL ERROR: Failed to update inventory for order ${orderNumber} after emails sent:`, inventoryUpdateError);
        // Emails were sent, but inventory update failed. This needs to be flagged for manual intervention.
        // The function will still return success to the caller (process-payment) as emails were sent,
        // but this backend issue is severe.
      }
      
      // Wait a bit before sending the owner email to avoid Gmail rate limits
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Send email to owner (inventory update is attempted before this, but after customer email)
      const ownerMailOptions = {
        from: '"Book ReViews System" <' + env.EMAIL_USER + '>',
        to: env.EMAIL_OWNER,
        subject: 'New Order Received - Book ReViews',
        html: ownerEmailHtml,
        priority: 'high',
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'High'
        }
      };
      
      // Use a promise with timeout for owner email too
      const sendOwnerEmail = async () => {
        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Owner email sending timed out'));
          }, 30000);
          
          transporter.sendMail(ownerMailOptions, (error, info) => {
            clearTimeout(timeout);
            if (error) {
              console.error('Owner email error:', error);
              // Don't reject here, we still want to return success for the customer
              resolve({ error: error.message });
            } else {
              console.log('Owner notification email sent:', info.response);
              resolve(info);
            }
          });
        });
      };
      
      try {
        await sendOwnerEmail();
      } catch (ownerEmailError) {
        console.error('Owner email failed but continuing:', ownerEmailError);
        // Continue processing even if owner email fails
      }
      
      // Update inventory in PocketBase
      if (cartItems.length > 0) {
        try {
          await updateInventory(cartItems);
        } catch (inventoryError) {
          console.error('Error updating inventory:', inventoryError);
        }
      }
      
      // Make sure to return a proper Response object
      return json({ success: true });
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      return json({ success: false, error: emailError.message });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return json({ success: false, error: error.message });
  }
}

// For PocketBase connection:
// In the updateInventory function:

async function updateInventory(cartItems) {
  try {
    const pb = new PocketBase(env.POCKETBASE_URL);
    
    for (const item of cartItems) {
      if (!item.id) {
        console.warn('Item missing ID, skipping inventory update:', item);
        continue;
      }
      
      try {
        // Get current book record
        const book = await pb.collection('books').getOne(item.id);
        console.log(`Current stock for "${book.title}": ${book.stock}`);
        
        // Calculate new stock
        const newStock = Math.max(0, book.stock - item.quantity);
        console.log(`New stock for "${book.title}": ${newStock}`);
        
        if (newStock <= 0) {
          // Delete the book if stock is zero or negative
          await pb.collection('books').delete(item.id);
          console.log(`Deleted book "${book.title}" with ID ${item.id} as stock is now ${newStock}`);
        } else {
          // Update the book stock
          await pb.collection('books').update(item.id, {
            stock: newStock
          });
          console.log(`Updated stock for "${book.title}" to ${newStock}`);
        }
      } catch (itemError) {
        console.error(`Error processing item ${item.id}:`, itemError);
      }
    }
    
    console.log('Inventory update completed successfully');
    return true;
  } catch (error) {
    console.error('Error connecting to PocketBase:', error);
    throw error;
  }
}