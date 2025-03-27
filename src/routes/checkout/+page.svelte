<script>
  import { onMount } from 'svelte';

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let total = 0;

  // Calculate the total price of the cart
  const calculateTotal = () => {
    total = cart.reduce((sum, book) => sum + (parseFloat(book.Price) || 0), 0).toFixed(2);
  };

  // Run onMount to calculate the total when the component is loaded
  onMount(() => {
    calculateTotal();
  });

  // Function to handle checkout
  const checkout = async () => {
    // Send the cart and total directly to the Square API (frontend integration)
    const res = await fetch('https://connect.squareup.com/v2/checkout/payment-links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.SQUARE_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        idempotency_key: 'unique-idempotency-key',
        order: {
          location_id: import.meta.env.SQUARE_LOCATION_ID, // Your Square location ID
          line_items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            base_price_money: {
              amount: item.Price * 100, // Square requires price in cents
              currency: 'USD',
            },
          })),
        },
      }),
    });

    if (!res.ok) {
      console.error('Error during checkout request:', await res.text());
      return;
    }

    const data = await res.json();

    if (data.payment_url) {
      window.location.href = data.payment_url; // Redirect to the Square hosted payment page
    } else {
      console.error('Error creating checkout session:', data);
    }
  };
</script>

<nav>
  <div class="btncont">
    <a href="/"><button>Home</button></a>
    <a href="/inventory"><button>Inventory</button></a>
    <a href="/#about"><button>About Us</button></a>
    <a href="/cart"><button>Cart</button></a>
    <a href="/checkout"><button>Checkout</button></a>
  </div>
</nav>

<hr>

<div class="checkout">
  <h2>Checkout</h2>
  <p><strong>Total: ${total}</strong></p>
  <button on:click={checkout} style="display: block; margin: auto; width: 80vw; height: 8vh; font-size: 2rem">
    Proceed with Payment
  </button>
</div>
