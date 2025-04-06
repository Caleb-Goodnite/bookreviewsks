<script>
  import { env } from '$env/dynamic/public';
  import { onMount } from 'svelte';
  let errorMessage = '';
  let successMessage = '';  
  let isProcessing = false;

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let total = 0;
  let payments;
  let card;

  // Add shipping information object
  let shippingInfo = {
    name: '',
    email: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  };

  // Update the calculateTotal function to account for quantities
  const calculateTotal = () => {
    total = cart.reduce((sum, book) => {
      const price = parseFloat(book.Price) || 0;
      const quantity = book.quantity || 1; // Default to 1 if quantity not specified
      return sum + (price * quantity);
    }, 0).toFixed(2);
  };

  let isCardFormLoading = true;

  // Add this function to handle tokenization
  async function tokenize(paymentMethod) {
    const tokenResult = await paymentMethod.tokenize();
    if (tokenResult.status === 'OK') {
      return tokenResult.token;
    } else {
      let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;
      if (tokenResult.errors) {
        errorMessage += ` and errors: ${JSON.stringify(tokenResult.errors)}`;
      }
      throw new Error(errorMessage);
    }
  }

  // Modified payment handler to include shipping info and validation
  async function handlePayment(event) {
    event.preventDefault();
    errorMessage = '';
    successMessage = '';
    
    // Check if cart is empty or total is zero
    if (parseFloat(total) <= 0) {
      errorMessage = 'Your cart is empty. Please add items before checkout.';
      return;
    }
    
    // Check if required shipping fields are filled
    if (!shippingInfo.name || !shippingInfo.email || !shippingInfo.line1 || 
        !shippingInfo.city || !shippingInfo.state || !shippingInfo.zip) {
      errorMessage = 'Please fill out all required shipping information fields.';
      return;
    }
    
    isProcessing = true;
  
    try {
      const token = await tokenize(card);
      console.log("Token generated:", token);
      
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token,
          amount: total,
          cart: cart,
          email: shippingInfo.email,
          shippingAddress: shippingInfo
        })
      });

      const data = await response.json();
      console.log("Payment response:", data);
      
      if (data.success) {
        // Send confirmation emails
        try {
          console.log("Sending email with cart:", cart);
          const emailResponse = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderDetails: {
                cart: cart,
                total: total,
                shippingInfo: shippingInfo
              },
              customerEmail: shippingInfo.email
            })
          });
          
          const emailData = await emailResponse.json();
          console.log("Email sending response:", emailData);
          
          if (!emailData.success) {
            console.error("Email sending failed:", emailData.error);
          }
        } catch (emailError) {
          console.error("Error sending emails:", emailError);
        }
        
        // Save payment info for success page
        localStorage.setItem('lastPayment', JSON.stringify({
          id: data.payment.id,
          amount: total,
          shippingAddress: shippingInfo,
          cart: cart
        }));
        
        successMessage = 'Payment processed successfully!';
        localStorage.setItem('cart', '[]');
        setTimeout(() => {
          window.location.href = '/payment-success';
        }, 2000);
      } else {
        errorMessage = data.error || 'Payment failed. Please try again.';
      }
    } catch (e) {
      errorMessage = 'Payment processing error: ' + e.message;
      console.error('Payment error:', e);
    } finally {
      isProcessing = false;
    }
  }

  onMount(() => {
    calculateTotal();
    
    const script = document.createElement('script');
    script.src = "https://sandbox.web.squarecdn.com/v1/square.js";
    script.onload = async () => {
      try {
        payments = Square.payments(env.PUBLIC_SQUARE_APP_ID);
        card = await payments.card();
        await card.attach('#card-container');
        isCardFormLoading = false;
      } catch (e) {
        console.error('Error loading Square:', e);
        errorMessage = 'Failed to load payment form. Please refresh the page.';
      }
    };
    document.body.appendChild(script);
  });

  // Array of states and their codes
  const states = [
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' },
    { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' },
    { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' },
    { code: 'HI', name: 'Hawaii' },
    { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' },
    { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' },
    { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' },
    { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' },
    { code: 'MN', name: 'Minnesota' },
    { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' },
    { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' },
    { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' },
    { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' },
    { code: 'OH', name: 'Ohio' },
    { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' },
    { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' },
    { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' },
    { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' },
    { code: 'WY', name: 'Wyoming' },
    { code: 'DC', name: 'District of Columbia' }
  ];
</script>

<nav id="navcont">
  <div class="btncont">
    <a href="/"><button id="navbutton">Home</button></a>
    <a href="/inventory"><button id="navbutton">Inventory</button></a>
    <a href="/#about"><button id="navbutton">About Us</button></a>
    <a href="/cart"><button id="navbutton">Cart</button></a>
    <a href="/checkout"><button id="navbutton">Checkout</button></a>
  </div>
</nav>

<div class="checkout">
  <h2 style="font-size: 3rem; padding: 0px;">Checkout</h2>
  
  <div class="checkout-container">
    <div class="checkout-left">
      <div class="order-summary">
        <!-- Order summary content -->
        <h3>Order Summary</h3>
        <div class="cart-items">
          {#each cart as item}
            <div class="cart-item">
              <span class="item-title">{item.title} ({item.quantity})</span>
              <span class="item-price"> ${(parseFloat(item.Price) * item.quantity).toFixed(2)}</span>
            </div>
          {/each}
        </div>
        <div class="total">
          <strong>Total: ${total}</strong>
        </div>
      </div>
    </div>
    
    <div class="checkout-right">
      <!-- Combined shipping and payment section -->
      <div class="checkout-section">
        <h3>Shipping Information</h3>
        <div class="form-group">
          <label for="name">Full Name</label>
          <input type="text" id="name" bind:value={shippingInfo.name} required />
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" bind:value={shippingInfo.email} required />
        </div>
        
        <div class="form-group">
          <label for="line1">Address Line 1</label>
          <input type="text" id="line1" bind:value={shippingInfo.line1} required />
        </div>
        
        <div class="form-group">
          <label for="line2">Address Line 2 (Optional)</label>
          <input type="text" id="line2" bind:value={shippingInfo.line2} />
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="city">City</label>
            <input type="text" id="city" bind:value={shippingInfo.city} required />
          </div>
          
          <div class="form-group">
            <label for="state">State</label>
            <select 
              id="state" 
              bind:value={shippingInfo.state} 
              required 
              class="form-control">
              <option value="" disabled selected>Select a state</option>
              {#each states as state}
                <option value={state.code}>{state.name}</option>
              {/each}
            </select>
          </div>
          
          <div class="form-group">
            <label for="zip">ZIP Code</label>
            <input type="text" id="zip" bind:value={shippingInfo.zip} required />
          </div>
        </div>
        
        <!-- Payment form integrated with shipping info -->
        {#if errorMessage}
          <div class="error-message">{errorMessage}</div>
        {/if}
        {#if successMessage}
          <div class="success-message">{successMessage}</div>
        {/if}
        
        <form on:submit|preventDefault={handlePayment}>
          {#if isCardFormLoading}
            <div class="loading-message">Loading payment form...</div>
          {/if}
          <div id="card-container"></div>
          <button 
            type="submit"
            class="pay-button" 
            disabled={isProcessing || isCardFormLoading}>
            {isProcessing ? 'Processing...' : `Pay $${total}`}
          </button>
        </form>
      </div>
    </div>
  </div>
</div>

<style>
  .checkout {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 1rem;
  }

  .checkout-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 20px;
    box-sizing: border-box;
  }

  .checkout-left {
    flex: 1;
    min-width: 280px;
    box-sizing: border-box;
  }

  .checkout-right {
    flex: 2;
    min-width: 320px; /* Further reduced */
    max-width: 620px;
    box-sizing: border-box;
  }

  .checkout-section, .order-summary {
    background-color: #383838;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    box-sizing: border-box;
    width: 100%;
    color: #ffffff;
  }

  .cart-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #555;
  }

  .total {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 2px solid #555;
    text-align: right;
    font-size: 1.2rem;
  }

  .checkout-section {
    background-color: #383838;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    color: #ffffff;
    box-sizing: border-box;
    width: 100%;
  }

  .order-summary {
    background-color: #383838;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    color: #ffffff;
    box-sizing: border-box;
    width: 100%;
  }

  h3 {
    margin-top: 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    color: #FFFFFF;
  }

  /* Remove duplicate form-row style and keep only this one */
  .form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px; /* Reduced gap */
    width: 100%;
    box-sizing: border-box;
    color: white;
  }
  
  .form-row .form-group {
    flex: 1;
    color: white;
    min-width: 90px; /* Reduced minimum width */
    box-sizing: border-box;
  }

  .form-group {
    margin-bottom: 15px;
    width: 100%;
    box-sizing: border-box;
  }
  
  .form-group input, .form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: rgb(150, 150, 150);
    font-size: 16px;
    box-sizing: border-box;
    color: rgb(0, 0, 0);
  }
  
  .form-row {
    display: flex;
    gap: 15px;
  }
  
  .form-row .form-group {
    flex: 1;
  }

  #card-container {
    min-height: 30px;
    padding: 10px 10px 10px 10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #383838;
    box-sizing: border-box;
    width: 100%;
  }
  
  /* Remove the unused selectors and use :global for Square's elements */
  :global(.sq-card-iframe),
  :global(#card-container iframe) {
    background: transparent !important;
    border: none !important;
  }

  .loading-message {
    text-align: center;
    padding: 1rem;
    color: #666;
  }

  .pay-button {
    width: 100%;
    padding: 12px;
    margin-top: 1rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .pay-button:hover {
    background-color: #45a049;
  }

  .error-message {
    color: #d32f2f;
    background-color: #ffebee;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 4px;
  }

  .success-message {
    color: #2e7d32;
    background-color: #e8f5e9;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 4px;
  }

  .pay-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .checkout-container {
      flex-direction: column;
    }
    
    .checkout-left, .checkout-right {
      width: 100%;
    }
    
    .form-row {
      flex-direction: column;
      gap: 0;
    }
  }
</style>
