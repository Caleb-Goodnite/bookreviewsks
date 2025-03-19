<script>
    import { onMount } from 'svelte';
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    // Calculate total price
    const calculateTotal = () => {
        total = cart.reduce((sum, book) => {
            const price = parseFloat(book.Price) || 0;  // Ensure price is a valid number
            return sum + price;
        }, 0).toFixed(2);
    };

    onMount(() => {
        calculateTotal();
    });

    const checkout = async () => {
        const stripe = Stripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); // Stripe key from .env
        const res = await fetch('/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart })
        });

        const session = await res.json();
        const result = await stripe.redirectToCheckout({ sessionId: session.id });

        if (result.error) {
            console.error(result.error.message);
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

<!-- Display cart and checkout button -->
<div class="checkout">
    <h2>Checkout</h2>
    <p><strong>Total: ${total}</strong></p>
    <button on:click={checkout} style="display: block; margin: auto; width: 80vw; height:8vh; font-size: 2rem">Proceed with Payment</button>
</div>
