<script>
    // import ReCaptcha from '../../components/ReCaptcha.svelte';
  // let verifiedRecaptchaToken = null; // reCAPTCHA disabled
  import { env } from '$env/dynamic/public';

  // function handleRecaptchaVerified(event) { // reCAPTCHA disabled
  //   verifiedRecaptchaToken = event.detail.token;
  //   errorMessage = ''; 
  // }

  // function handleRecaptchaExpired() { // reCAPTCHA disabled
  //   verifiedRecaptchaToken = null;
  //   errorMessage = 'reCAPTCHA expired. Please try again.';
  // }

  // function handleRecaptchaError(event) { // reCAPTCHA disabled
  //   verifiedRecaptchaToken = null;
  //   errorMessage = event.detail?.message || 'reCAPTCHA error. Please try again.';
  //   console.error('reCAPTCHA component error:', event.detail);
  // }
  import { onMount } from 'svelte';
  
  let errorMessage = '';
  let successMessage = '';  
  let isProcessing = false;

  let cart = []; // Initialize cart as an empty array
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
    console.log('Current cart:', cart); // Debug log
    total = cart.reduce((sum, book) => {
      // Handle both Price and price properties for backward compatibility
      const priceValue = book.Price !== undefined ? book.Price : (book.price || 0);
      const price = parseFloat(priceValue) || 0;
      const quantity = book.quantity || 1; // Default to 1 if quantity not specified
      const itemTotal = price * quantity;
      console.log(`Item: ${book.title}, Price: ${price}, Quantity: ${quantity}, Subtotal: ${itemTotal}`);
      return sum + itemTotal;
    }, 0).toFixed(2);
    console.log('Calculated total:', total); // Debug log
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
    // if (!verifiedRecaptchaToken) { // reCAPTCHA disabled
    //   errorMessage = 'Please complete the reCAPTCHA verification before proceeding.';
    //   isProcessing = false;
    //   return;
    // }
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
      const cardToken = await tokenize(card);
      const requestBody = {
        token: cardToken,
        clientAmount: total,  // Changed from 'amount' to 'clientAmount'
        cart: cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
          title: item.title,
          price: item.price || item.Price  // Handle both cases
        })),
        customerEmail: shippingInfo.email,  // Changed from 'email' to 'customerEmail'
        shippingInfo: shippingInfo  // Changed from 'shippingAddress' to 'shippingInfo'
      };
      
      console.log('Sending payment request...');
      
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json().catch(async (parseError) => {
        // If JSON parsing fails, try to get the response as text
        const errorText = await response.text();
        console.error('Failed to parse JSON response:', errorText);
        return { 
          success: false, 
          error: `Payment failed (${response.status}): ${errorText || 'Unknown error'}`
        };
      });

      console.log('Payment response:', data);
      
      if (!response.ok) {
        const errorMessage = data.error || data.message || 'Payment failed. Please try again.';
        console.error('Server error:', errorMessage, data);
        throw new Error(errorMessage);
      }
      if (data.success) {
        // Send confirmation emails
        try {
          const emailResponse = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderDetails: {
                id: data.payment.id, // Square order/payment ID
                cart: cart,
                total: total,
                shippingInfo: shippingInfo
              },
              customerEmail: shippingInfo.email
            })
          });
          
          const emailData = await emailResponse.json();
          if (!emailData.success) {
            // Handle email sending failure silently
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
      console.error('Payment error:', e);
      errorMessage = 'Payment processing error: ' + (e.message || 'Unknown error occurred');
      // Log payment error silently
    } finally {
      isProcessing = false;
    }
  }

  onMount(() => {
    errorMessage = ''; // Clear any stale error messages on load
    // Initialize cart from localStorage only on the client side
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      cart = JSON.parse(savedCart);
    }
    calculateTotal(); // Recalculate total after cart is loaded
    
    const script = document.createElement('script');
    script.src = "https://sandbox.web.squarecdn.com/v1/square.js";
    script.onload = async () => {
      try {
        payments = Square.payments(env.PUBLIC_SQUARE_APP_ID);
        card = await payments.card();
        await card.attach('#card-container');
        isCardFormLoading = false;
      } catch (e) {
        // Log Square loading error silently
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

<title>Check Out - Book ReViews</title>

<div class="checkout">
  <h1>Checkout</h1>
  
  <div class="checkout-container">
    <div class="checkout-left">
      <div class="order-summary">
        <!-- Order summary content -->
        <h3>Order Summary</h3>
        <div class="cart-items">
          {#each cart as item}
            <div class="cart-item">
              <span class="item-title">{item.title} ({item.quantity})</span>
              <span class="item-price"> ${((parseFloat(item.Price || item.price || 0)) * item.quantity).toFixed(2)}</span>
            </div>
          {/each}
        </div>
        <div class="total">
          <strong>Total: ${total}</strong>
        </div>
      </div>
      
      <!-- Add these new sections to fill the empty space -->
      <div class="checkout-info-card">
        <div class="info-icon">📚</div>
        <h4>Supporting Local Charities</h4>
        <p>All proceeds from your purchase directly support Harvey County charitable organizations.</p>
      </div>
      
      <div class="checkout-info-card">
        <div class="info-icon">🚚</div>
        <h4>Shipping Information</h4>
        <p>Books will be prepared for shipping within 3-5 business days after your order is confirmed.</p>
      </div>
      
      <div class="checkout-info-card">
        <div class="info-icon">💳</div>
        <h4>Secure Payment</h4>
        <p>Your payment information is securely processed through Square's protected payment system.</p>
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
          <h3>Payment Information</h3>
          {#if isCardFormLoading}
            <div class="loading-message">Loading payment form...</div>
          {/if}
          <div id="card-container"></div>
          
          <!-- 
          reCAPTCHA Component Disabled

          <div class="recaptcha-container" style="margin-bottom: 1rem; display: flex; justify-content: center;">
            <ReCaptcha 
              on:verified={handleRecaptchaVerified} 
              on:expired={handleRecaptchaExpired}
              on:error={handleRecaptchaError} />
          </div>
          -->

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

<footer>
  <div class="footer-content">
    <div class="footer-section">
      <h3>Contact Us</h3>
      <p class="pcontact">Phone: 316-283-3442</p>
      <p class="pcontact">Email: newtonbkreviews@sbcglobal.net</p>
      <p class="pcontact">707 N Main ST, Newton, Kansas 67114</p>
    </div>
    
    <div class="footer-section">
      <h3>Quick Links</h3>
      <div class="footer-links">
        <a href="/">Home</a>
        <a href="/inventory">Inventory</a>
        <a href="/#about">About Us</a>
        <a href="/volunteer-sign-up">Volunteer</a>
        <a href="/policies">Policies</a>
      </div>
    </div>

  </div>
  <div class="footer-bottom">
    <p>&copy; 2025 Book ReViews. All proceeds support Harvey County charities.</p>
  </div>
</footer>

<style>
  .checkout {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 1rem;
  }

  .checkout h1 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: white;
  }

  .checkout-container {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    margin-top: 20px;
    box-sizing: border-box;
  }

  .checkout-left {
    flex: 1;
    min-width: 300px;
    box-sizing: border-box;
  }

  .checkout-right {
    flex: 2;
    min-width: 320px;
    max-width: 700px;
    box-sizing: border-box;
  }

  /* New styles for the info cards */
  .checkout-info-card {
    background-color: rgba(58, 54, 51, 0.7);
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    border: 1px solid #8b7d6b;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    text-align: center;
  }
  
  .checkout-info-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.3);
  }
  
  .info-icon {
    font-size: 2rem;
    margin-bottom: 10px;
  }
  
  .checkout-info-card h4 {
    color: #e6dfd3;
    margin: 10px 0;
    font-size: 1.2rem;
  }
  
  .checkout-info-card p {
    color: white;
    font-size: 0.95rem;
    margin: 0;
  }
  
  /* Enhance existing styles */
  .checkout-section, .order-summary {
    background-color: rgba(58, 54, 51, 0.8);
    border-radius: 8px;
    padding: 25px;
    margin-bottom: 20px;
    box-shadow: 0 6px 12px rgba(0,0,0,0.3);
    box-sizing: border-box;
    width: 100%;
    color: #e6dfd3;
    border: 1px solid #8b7d6b;
    transition: box-shadow 0.3s ease;
  }
  
  .checkout-section:hover, .order-summary:hover {
    box-shadow: 0 8px 16px rgba(0,0,0,0.4);
  }
  
  .cart-item {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #8b7d6b;
    transition: background-color 0.3s ease;
  }
  
  .cart-item:hover {
    background-color: rgba(139, 125, 107, 0.2);
    padding-left: 8px;
    padding-right: 8px;
    margin-left: -8px;
    margin-right: -8px;
    border-radius: 4px;
  }
  
  /* Add a subtle pattern background to the page */
  .checkout {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 1rem;
    position: relative;
  }
  

  
  /* Make the payment button more prominent */
  .pay-button {
    width: 100%;
    padding: 16px;
    margin-top: 1.5rem;
    background-color: #8b7d6b;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: bold;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0,0,0,0.2);
  }
  
  .pay-button:hover {
    background-color: #6d6253;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.3);
  }
  
  .pay-button:after {
    content: "";
    position: absolute;
    top: -50%;
    left: -60%;
    width: 20%;
    height: 200%;
    background: rgba(255,255,255,0.2);
    transform: rotate(30deg);
    transition: all 0.6s ease;
  }
  
  .pay-button:hover:after {
    left: 120%;
  }
  
  /* Responsive adjustments */
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
    
    .checkout-info-card {
      padding: 15px;
    }
  }
</style>


<!-- <ReCaptcha bind:this={recaptchaComponent} /> -->
<!-- <button on:click={handleSubmit}>Complete Checkout</button> -->
