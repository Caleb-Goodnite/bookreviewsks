<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  let amount = 0;
  
  onMount(() => {
    // Get the donation amount from URL parameters
    amount = $page.url.searchParams.get('amount') || 0;
  });
  
  function goHome() {
    goto('/');
  }
  
  // Format the amount as currency
  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }
</script>

<svelte:head>
  <title>Thank You for Your Donation | Book ReViews</title>
  <meta name="description" content="Thank you for supporting Book ReViews with your generous donation." />
</svelte:head>

<style>
  .thank-you-container {
    max-width: 800px;
    margin: 60px auto;
    padding: 40px;
    background-color: rgba(58, 54, 51, 0.7);
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    text-align: center;
  }
  
  .thank-you-icon {
    font-size: 60px;
    color: #8b7d6b;
    margin-bottom: 20px;
  }
  
  h1 {
    color: #e6dfd3;
    margin-bottom: 20px;
  }
  
  p {
    color: white;
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 20px;
  }
  
  .donation-amount {
    font-size: 2rem;
    font-weight: bold;
    color: #e6dfd3;
    margin: 30px 0;
  }
  
  .home-button {
    background-color: #8b7d6b;
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.1rem;
    transition: background-color 0.3s;
    margin-top: 20px;
  }
  
  .home-button:hover {
    background-color: #6d6253;
  }
  
  .impact-message {
    background-color: rgba(139, 125, 107, 0.3);
    padding: 20px;
    border-radius: 8px;
    margin: 30px 0;
  }
</style>

<div class="thank-you-container">
  <div class="thank-you-icon">✓</div>
  <h1>Thank You for Your Donation!</h1>
  
  <p>Your generous contribution helps us maintain our store and support local charitable organizations in Harvey County.</p>
  
  <div class="donation-amount">
    {formatCurrency(amount)}
  </div>
  
  <div class="impact-message">
    <p>Your donation will make a real difference in our community.</p>
  </div>
  
  <p>We appreciate your support of Book ReViews and our mission to give back to the community.</p>
  
  <button class="home-button" on:click={goHome}>
    Return to Homepage
  </button>
</div>