<script>
  import { onMount } from 'svelte';
  import { PUBLIC_SQUARE_APP_ID, PUBLIC_SQUARE_LOCATION_ID } from '$env/static/public';
  
  let payments;
  let card;
  let isLoading = true;
  let isProcessing = false;
  let error = '';
  let isInitialized = false;
  
  onMount(async () => {
    try {
      // Validate environment variables
      if (!PUBLIC_SQUARE_APP_ID || !PUBLIC_SQUARE_LOCATION_ID) {
        throw new Error('Square configuration missing');
      }
      
      // Check if Square SDK is loaded
      if (!window.Square) {
        throw new Error('Square SDK not loaded');
      }
      
      // Wait for container to be available
      const container = document.getElementById('card-container');
      if (!container) {
        throw new Error('Card container not found');
      }
      
      payments = await window.Square.payments(PUBLIC_SQUARE_APP_ID, PUBLIC_SQUARE_LOCATION_ID);
      card = await payments.card();
      await card.attach('#card-container');
      
      isInitialized = true;
      isLoading = false;
    } catch (e) {
      console.error('Payment initialization failed:', e);
      error = 'Failed to initialize payment system';
      isLoading = false;
    }
  });
  
  async function handlePayment() {
    if (!isInitialized || isProcessing) return;
    
    isProcessing = true;
    error = '';
    
    try {
      const result = await card.tokenize();
      
      if (result.status === 'OK') {
        // TODO: Send result.token to your server endpoint
        // Example: await fetch('/api/process-payment', { method: 'POST', body: JSON.stringify({ token: result.token }) });
        console.log('Payment tokenized successfully');
        // Replace console.log with actual server call
      } else {
        throw new Error(result.errors?.[0]?.detail || 'Payment tokenization failed');
      }
    } catch (e) {
      console.error('Payment processing failed:', e);
      error = e.message || 'Payment failed. Please try again.';
    } finally {
      isProcessing = false;
    }
  }
</script>

{#if isLoading}
  <div class="loading" role="status" aria-label="Loading payment form">
    Loading payment form...
  </div>
{:else if error}
  <div class="error" role="alert" aria-live="polite">
    {error}
  </div>
{/if}

<div id="card-container" class:hidden={isLoading || error}></div>

<button 
  on:click={handlePayment} 
  disabled={!isInitialized || isProcessing || isLoading || error}
  aria-label="Process payment"
  class:processing={isProcessing}
>
  {#if isProcessing}
    Processing...
  {:else}
    Pay Now
  {/if}
</button>

<style>
  #card-container {
    min-width: 300px;
    min-height: 100px;
    padding: 1em;
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin: 1em auto;
    transition: opacity 0.2s ease;
  }
  
  .hidden {
    display: none;
  }
  
  button {
    background-color: #007cba;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 120px;
  }
  
  button:hover:not(:disabled) {
    background-color: #005a87;
  }
  
  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .processing {
    background-color: #646464;
  }
  
  .loading {
    text-align: center;
    padding: 2em;
    color: #646464;
  }
  
  .error {
    background-color: #fee;
    color: #c33;
    padding: 1em;
    border-radius: 4px;
    border: 1px solid #fcc;
    margin: 1em 0;
    text-align: center;
  }
</style>