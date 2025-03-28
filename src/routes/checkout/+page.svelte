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
  <p><strong>Total: ${total}</strong></p>
  <button style="display: block; margin: auto; width: 80vw; height: 8vh; font-size: 2rem">
    Proceed with Payment
  </button>
</div>
