<script>
  import { onMount } from 'svelte';
  let errorMessage = '';
  let successMessage = '';  
  let isProcessing = false;

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let total = 0;
  let payments;
  let card;

  const calculateTotal = () => {
    total = cart.reduce((sum, book) => sum + (parseFloat(book.Price) || 0), 0).toFixed(2);
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

  // Modified payment handler based on Square docs
  async function handlePayment(event) {
    event.preventDefault();
    errorMessage = '';
    successMessage = '';
    isProcessing = true;
  
    try {
      const token = await tokenize(card);
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token,
          amount: total
        })
      });

      const data = await response.json();
      
      if (data.success) {
        successMessage = 'Payment processed successfully!';
        localStorage.setItem('cart', '[]');
        setTimeout(() => {
          window.location.href = '/payment-success';
        }, 2000);
      } else {
        errorMessage = 'Payment failed. Please try again.';
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
        payments = Square.payments('sandbox-sq0idb-0fTH4vYi_b7zuMYbYDuQaA');
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
  <h2>Checkout</h2>
  <div class="order-summary">
    <h3>Order Summary</h3>
    <div class="cart-items">
      {#each cart as item}
        <div class="cart-item">
          <span>{item.Title}</span>
          <span>${item.Price}</span>
        </div>
      {/each}
    </div>
    <div class="total">
      <strong>Total: ${total}</strong>
    </div>
  </div>
  
  <div class="payment-section">
    <h3>Payment Details</h3>
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

<style>
  .checkout {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem;
  }

  .order-summary {
    margin: 2rem 0;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .cart-items {
    margin: 1rem 0;
  }

  .cart-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
  }

  .total {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 2px solid #ddd;
    text-align: right;
    font-size: 1.2rem;
  }

  .payment-section {
    margin-top: 2rem;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  #card-container {
    min-height: 100px;
    margin: 1rem 0;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
  }

  .sq-input {
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .sq-input--focus {
    border-color: #4CAF50;
  }

  .sq-input--error {
    border-color: #d32f2f;
  }

  .loading-message {
    text-align: center;
    padding: 1rem;
    color: #666;
  }

  .pay-button {
    width: 100%;
    padding: 1rem;
    margin-top: 1rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1.1rem;
    cursor: pointer;
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
</style>
