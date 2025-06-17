<script>
  import { onMount } from 'svelte';
  // Import public environment variables
  import { PUBLIC_SQUARE_APP_ID, PUBLIC_SQUARE_LOCATION_ID } from '$env/static/public';
  
  let payments;
  let card;
  
  onMount(async () => {
    // Use the imported environment variables
    payments = await window.Square.payments(PUBLIC_SQUARE_APP_ID, PUBLIC_SQUARE_LOCATION_ID);
    card = await payments.card();
    await card.attach('#card-container');
  });

  async function handlePayment() {
    try {
      const result = await card.tokenize();
      if (result.status === 'OK') {
        // Send tokenizedPaymentMethod.token to your server
        console.log('Payment token:', result.token);
      }
    } catch (e) {
      console.error(e);
    }
  }
</script>

<div id="card-container"></div>
<button on:click={handlePayment}>Pay Now</button>

<style>
  #card-container {
    min-width: 300px;
    min-height: 100px;
    padding: 1em;
    background-color: white;
    border-radius: 8px;
    margin: 1em auto;
  }
</style>