<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  let orderDetails = null;
  let emailSent = false;
  let emailError = false;
  
  // Function to send confirmation email
  const sendConfirmationEmail = async () => {
    if (!orderDetails || !orderDetails.shippingInfo || !orderDetails.shippingInfo.email) {
      console.error('Missing order details or email address');
      emailError = true;
      return;
    }
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: orderDetails.shippingInfo.email,
          orderDetails: orderDetails
        })
      });
      
      const result = await response.json();
      if (result.success) {
        emailSent = true;
      } else {
        console.error('Email API returned error:', result.error);
        emailError = true;
      }
    } catch (error) {
      console.error('Error sending email:', error);
      emailError = true;
    }
  };
  
  onMount(() => {
    // Try to get order details from localStorage
    const paymentData = localStorage.getItem('lastPayment');
    if (paymentData) {
      try {
        orderDetails = JSON.parse(paymentData);
        // Send confirmation email once we have order details
        sendConfirmationEmail();
        
        // Clear the cart ONLY if payment data was successfully parsed
        localStorage.setItem('cart', '[]');
      } catch (e) {
        console.error('Failed to parse payment data', e);
      }
    } else {
      console.error('No payment data found in localStorage');
    }
  });
</script>


<div class="success-container">
  <div class="success-card">
    <div class="success-icon">✓</div>
    <h1>Thank you for your purchase!</h1>
    <p>Your order has been successfully placed.</p>
    <p><u>Your order will be processed within 3-5 days</u></p>

    {#if orderDetails}
      <div class="order-details">
        <h2>Order Details</h2>
        <p>Order Number: {orderDetails.orderNumber || orderDetails.id}</p>
        <p>Amount: ${orderDetails.amount || orderDetails.total}</p>
        
        {#if orderDetails.shippingInfo}
          <h3>Shipping Address</h3>
          <p>
            {orderDetails.shippingInfo.name}<br>
            {orderDetails.shippingInfo.line1}<br>
            {orderDetails.shippingInfo.line2 ? `${orderDetails.shippingInfo.line2}<br>` : ''}
            {orderDetails.shippingInfo.city}, {orderDetails.shippingInfo.state} {orderDetails.shippingInfo.zip}
          </p>
        {/if}
      </div>
    {/if}

    <div class="notification-info">
      <p>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
        </svg>
        Our team has been notified of your order and will ship it soon.
      </p>
      <p>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
        </svg>
        A confirmation email has been sent.
      </p>
    </div>

    <p>Thank you for your business!</p>
    
    <a href="/" class="home-button">Return to Home</a>
  </div>
</div>

<style>
  
  p {
    margin-bottom: 10px;
    color: white;
  }
  
  .success-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 20px;
  }
  
  .success-card {
    background: #383838;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    padding: 40px;
    text-align: center;
    max-width: 600px;
    width: 100%;
    color: white;
  }
  
  .success-icon {
    background: #4CAF50;
    color: white;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    margin: 0 auto 20px;
  }
  
  h1 {
    color: #4CAF50;
    margin-bottom: 20px;
  }
  
  h2, h3 {
    color: white;
  }
  
  .order-details {
    background: #444444;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
    text-align: left;
    color: white;
  }
  
  .order-details p {
    color: white;
  }
  
  .home-button {
    display: inline-block;
    background: #4CAF50;
    color: white;
    padding: 12px 24px;
    border-radius: 4px;
    text-decoration: none;
    font-weight: bold;
    transition: background 0.3s;
    margin-top: 20px;
  }
  
  .home-button:hover {
    background: #45a049;
  }
  
  .notification-info {
    background: #444444;
    border-radius: 8px;
    padding: 15px;
    margin: 20px 0;
    text-align: left;
    color: white;
  }
  
  .notification-info p {
    color: white;
  }
  
  .notification-info svg {
    margin-right: 8px;
    vertical-align: middle;
  }
</style>