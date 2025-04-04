<script>
  import { onMount } from 'svelte';
  
  let payments;
  let card;
  
  onMount(async () => {
    payments = await window.Square.payments('sandbox-sq0idb-0fTH4vYi_b7zuMYbYDuQaA', 'LZFEXWF6T8KPM');
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