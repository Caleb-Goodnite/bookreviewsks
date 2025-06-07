<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { PUBLIC_SQUARE_APP_ID, PUBLIC_SQUARE_LOCATION_ID } from '$env/static/public';
  
  // import ReCaptcha from '../../components/ReCaptcha.svelte';
  // let recaptchaComponent;
  
  
  let selectedAmount = null;
  let customAmount = '';
  let loading = false;
  let card;
  let payments;
  let cardErrors = '';
  
  function selectAmount(amount) {
    console.log('Selected amount:', amount);
    selectedAmount = amount;
    customAmount = '';
    cardErrors = '';
  }
  
  function handleCustomAmount(e) {
    selectedAmount = null;
    customAmount = e.target.value;
    cardErrors = '';
  }
  
  onMount(async () => {
    // Load Square SDK if not already loaded
    if (!document.getElementById('square-script')) {
      const script = document.createElement('script');
      script.id = 'square-script';
      script.src = 'https://sandbox.web.squarecdn.com/v1/square.js';
      script.onload = initializeSquare;
      script.onerror = () => {
        cardErrors = 'Failed to load payment system. Please try again later.';
      };
      document.body.appendChild(script);
    } else {
      initializeSquare();
    }
  });
  
  async function initializeSquare() {
    try {
      console.log('Initializing Square...');
      payments = window.Square.payments(PUBLIC_SQUARE_APP_ID, PUBLIC_SQUARE_LOCATION_ID);
      card = await payments.card();
      await card.attach('#card-container');
      console.log('Square payment form loaded successfully');
    } catch (error) {
      console.error('Error initializing Square:', error);
      cardErrors = 'Failed to initialize payment system. Please try again later.';
    }
  }
  
  async function handleDonation() {
    const amount = selectedAmount || customAmount;
    if (!amount) {
      cardErrors = 'Please select or enter a donation amount';
      return;
    }
    
    // Validate amount is a positive number
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      cardErrors = 'Please enter a valid donation amount';
      return;
    }
    
    cardErrors = '';
    loading = true;
    
    try {
      // Execute reCAPTCHA - DISABLED
      // const recaptchaToken = await recaptchaComponent.executeReCaptcha();
      // if (!recaptchaToken) {
      //   throw new Error('reCAPTCHA verification failed. Please try again.');
      // }
      const recaptchaToken = 'dummy-token-recaptcha-disabled'; // Provide a dummy token or handle appropriately

      // Get a payment token from the card element
      const result = await card.tokenize();
      if (result.status === 'OK') {
        // Process the payment with our server
        const response = await fetch('/api/process-donation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: result.token,
            amount: numAmount,
            // recaptchaToken: recaptchaToken // Add reCAPTCHA token here - DISABLED
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Server error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Redirect to thank you page
          goto(`/donations/thank-you?amount=${numAmount}`);
        } else {
          throw new Error(data.error || 'Payment failed');
        }
      } else {
        cardErrors = result.errors[0].message;
        throw new Error(result.errors[0].message);
      }
    } catch (e) {
      console.error(e);
      cardErrors = e.message || 'Payment processing failed. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Support Book ReViews - Make a Donation</title>
  <meta name="description" content="Support Book ReViews with a monetary donation. Your contributions help us maintain our store and support local charitable organizations." />
</svelte:head>

<style>
  /* Donations Page Styles */
  .donations-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .donations-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .donations-header h1 {
    color: white;
    margin-bottom: 10px;
  }

  .donations-header p {
    font-size: 1.2rem;
    color: #e6dfd3;
    max-width: 800px;
    margin: 0 auto;
  }

  .donation-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-bottom: 40px;
  }

  .donation-card {
    background-color: rgba(58, 54, 51, 0.7);
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    margin-bottom: 30px;
  }

  .donation-card h2 {
    color: #e6dfd3;
    border-bottom: 2px solid #8b7d6b;
    padding-bottom: 10px;
    margin-bottom: 20px;
    text-align: left;
  }

  .donation-card p, .donation-card li {
    color: white;
    text-align: left;
    margin-bottom: 15px;
    line-height: 1.5;
  }

  .donation-card ul {
    padding-left: 20px;
    margin-bottom: 20px;
  }

  .donation-card li {
    margin-bottom: 10px;
  }

  .impact-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin: 30px 0;
  }

  .stat-card {
    background-color: rgba(139, 125, 107, 0.3);
    padding: 20px;
    border-radius: 8px;
    text-align: center;
  }

  .stat-number {
    font-size: 2.5rem;
    font-weight: bold;
    color: #e6dfd3;
    margin-bottom: 10px;
  }

  .stat-label {
    font-size: 0.9rem;
    color: white;
  }

  .testimonial {
    background-color: rgba(139, 125, 107, 0.2);
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #8b7d6b;
    margin: 30px 0;
  }

  .testimonial p {
    font-style: italic;
    color: white;
    text-align: left;
  }

  .testimonial cite {
    display: block;
    text-align: right;
    color: #e6dfd3;
    margin-top: 10px;
  }

  /* Square Donation Button Styles */
  .square-donation {
    background-color: rgba(58, 54, 51, 0.7);
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    max-width: 600px;
    margin: 40px auto;
    text-align: center;
  }

  .square-donation h2 {
    color: #e6dfd3;
    border-bottom: 2px solid #8b7d6b;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }

  .donation-options {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 15px;
    margin: 20px 0;
  }

  .donation-amount {
    background-color: #8b7d6b;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.1rem;
    transition: background-color 0.3s;
  }

  .donation-amount:hover, .donation-amount.selected {
    background-color: #6d6253;
  }

  .donation-amount.selected {
    box-shadow: 0 0 0 2px white;
  }

  .custom-amount {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }

  .custom-amount input {
    width: 150px;
    padding: 10px;
    border: 1px solid #8b7d6b;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.9);
    color: #333;
    font-size: 16px;
    text-align: center;
  }
  
  .custom-amount input::placeholder {
    color: #666;
    opacity: 0.8;
  }

  .donate-button {
    background-color: #8b7d6b;
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.2rem;
    width: 100%;
    max-width: 300px;
    margin: 20px auto 0;
    transition: background-color 0.3s;
    display: block;
  }

  .donate-button:hover {
    background-color: #6d6253;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .donation-cards {
      grid-template-columns: 1fr;
    }
    
    .impact-stats {
      grid-template-columns: 1fr;
    }
    
    .stat-card {
      padding: 15px;
    }
    
    .donation-options {
      flex-direction: column;
      align-items: center;
    }
    
    .donation-amount {
      width: 80%;
    }
  }
</style>

<div class="donations-container">
  <div class="donations-header">
    <h1>Support Our Mission</h1>
    <p>Your donations help us continue supporting charitable organizations in Harvey County</p>
  </div>
  
  <div class="donation-cards">
    <div class="donation-card">
      <h2>How Your Donations Help</h2>
      <p>Book ReViews is a non-profit organization that donates all proceeds to local Harvey County charities. Your donations help us:</p>
      <ul>
        <li>Maintain our store and operations</li>
        <li>Expand our inventory of quality books</li>
        <li>Support local charitable organizations</li>
        <li>Create community programs and events</li>
      </ul>
    </div>
    
    <div class="donation-card">
      <h2>Your Impact</h2>
      <p>In the past year, with the help of generous donors like you, we've been able to:</p>
      
      <div class="impact-stats">
        <div class="stat-card">
          <div class="stat-number">$25,000+</div>
          <div class="stat-label">Donated to local charities</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-number">15,000+</div>
          <div class="stat-label">Books recycled and resold</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-number">500+</div>
          <div class="stat-label">Volunteer hours contributed</div>
        </div>
      </div>
      
      <div class="testimonial">
        <p>"Book ReViews has been an incredible partner for our organization. Their donations have helped us provide essential services to families in need throughout Harvey County."</p>
        <cite>— Local Charity Director</cite>
      </div>
    </div>
  </div>
  
  <div class="donation-card">
    <h2>Book Donations</h2>
    <p>We accept gently used books of all genres in good condition at our store.</p>
    <p><strong>Drop-off Hours:</strong> Monday-Saturday, 9:30 AM - 5:30 PM</p>
    <p><strong>Location:</strong> 707 N Main ST, Newton, Kansas 67114</p>
  </div>
  
  <div class="square-donation">
    <h2>Make a Financial Contribution</h2>
    <p>Make a tax-deductible monetary donation to support our operations and charitable giving.</p>
    
    <div class="donation-options">
      <button 
        type="button"
        class="donation-amount" 
        class:selected={selectedAmount === 10} 
        on:click={() => selectAmount(10)}
      >$10</button>
      <button 
        type="button"
        class="donation-amount" 
        class:selected={selectedAmount === 25} 
        on:click={() => selectAmount(25)}
      >$25</button>
      <button 
        type="button"
        class="donation-amount" 
        class:selected={selectedAmount === 50} 
        on:click={() => selectAmount(50)}
      >$50</button>
      <button 
        type="button"
        class="donation-amount" 
        class:selected={selectedAmount === 100} 
        on:click={() => selectAmount(100)}
      >$100</button>
    </div>
        
    <div class="custom-amount">
        <input 
          type="number" 
          placeholder="Custom Amount" 
          min="1" 
          bind:value={customAmount} 
          on:input={handleCustomAmount}
        />
      </div>
    
    <!-- Add the card container back -->
    <!-- Add error display -->
    <div id="card-container" style="min-height: 90px; margin: 20px 0; padding: 10px; background-color: rgba(255, 255, 255, 0.1); border-radius: 4px;"></div>
    
    {#if cardErrors}
      <div class="card-errors" style="color: #ff6b6b; margin-bottom: 15px; font-size: 0.9rem;">
        {cardErrors}
      </div>
    {/if}

    <button 
      class="donate-button" 
      on:click={handleDonation} 
      disabled={loading}
    >
      {loading ? 'Processing...' : 'Donate Now'}
    </button>
  </div>
</div>


<!-- <ReCaptcha bind:this={recaptchaComponent} /> -->
<!-- Remove the redundant button below -->