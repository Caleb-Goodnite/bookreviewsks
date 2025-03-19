<script>
    import { onMount } from "svelte";

    let cart = [];

    // Use onMount to ensure this code runs on the client-side only
    onMount(() => {
        // Get cart from localStorage
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    });

    // Remove an item from the cart
    function removeFromCart(bookId) {
        cart = cart.filter(item => item.id !== bookId);
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Update the quantity of a book in the cart
    function updateQuantity(bookId, quantity) {
        const bookInCart = cart.find(item => item.id === bookId);
        if (bookInCart) {
            bookInCart.quantity = quantity;
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }

    // Calculate total cart value (just for demonstration)
    function getTotal() {
        return cart.reduce((total, item) => total + (item.Price * item.quantity), 0).toFixed(2);
    }
</script>

<title>Cart - Book ReViews</title>

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

<h1>Your Cart</h1>

{#if cart.length === 0}
    <p>Your cart is empty.</p>
{:else}
    <div class="book-grid">
        {#each cart as book}
            <div class="book">
                <h3 style="text-align: center;">{book.title}</h3>
                <p>Author: {book.author}</p>
                <p>Price: ${book.Price}</p>
                <p>
                    Quantity: 
                    <input type="number" min="1" bind:value={book.quantity} on:input={() => updateQuantity(book.id, book.quantity)} />
                </p>
                <button class="delete-btn" on:click={() => removeFromCart(book.id)}>Remove</button>
            </div>
        {/each}
    </div>

    <div class="cart-summary">
        <p class="pinfo">Total: ${getTotal()}</p>
        <button class="checkout-btn">Checkout</button>
    </div>
{/if}

<style>
    .book-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        padding: 20px;
    }
    .book {
        border: 1px solid #ccc;
        padding: 15px;
        border-radius: 8px;
        background: #383838;
        color: white;
        font-family: monospace;
    }
    .delete-btn {
        display: block;
        background-color: red;
        border: none;
        padding: 5px 10px;
        border-radius: 5px;
        color: white;
        cursor: pointer;
        margin-left: auto;
        margin-right: auto;
    }
    .delete-btn:hover {
        background-color: darkred;
    }
    .checkout-btn {
        display: block;
        background-color: #f5a623;
        border: none;
        padding: 10px;
        border-radius: 5px;
        color: white;
        cursor: pointer;
        margin-left: auto;
        margin-right: auto;
        width: 12rem;
        height: 3rem;
        font-size: 2rem;
        padding: .2rem ;
    }
    .checkout-btn:hover {
        background-color: #f58f20;
    }
</style>