<script>
    import { onMount } from "svelte";

    let cart = [];

    // Use onMount to ensure this code runs on the client-side only
    onMount(() => {
        // Get cart from localStorage
        cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Ensure all items in cart have a quantity, defaulting to 1
        cart.forEach(item => {
            if (!item.quantity) {
                item.quantity = 1;
            }
        });
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
            bookInCart.quantity = parseInt(quantity); // Ensure quantity is an integer
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }

    // Calculate total cart value
    function getTotal() {
        return cart.reduce((total, item) => total + (item.Price * item.quantity), 0).toFixed(2);
    }

    // Proceed to checkout
    function checkout() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        // Assuming your checkout logic is handled elsewhere
        window.location.href = '/checkout'; // Redirect to checkout page
    }
</script>

<title>Cart - Book ReViews</title>

<nav id="navcont">
    <div class="btncont">
    <a href="/"><button id="navbutton">Home</button></a>
    <a href="/inventory"><button id="navbutton">Inventory</button></a>
    <a href="/#about"><button id="navbutton">About Us</button></a>
    <a href="/cart"><button id="navbutton">Cart</button></a>
    <a href="/checkout"><button id="navbutton">Checkout</button></a>
    </div>
</nav>

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
        <a href="/checkout"><button class="checkout-btn">Checkout</button></a>
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