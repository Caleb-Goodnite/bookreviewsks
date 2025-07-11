<script>
    import { onMount } from "svelte";
    import PocketBase from 'pocketbase';

    let cart = [];
    let stockErrors = [];

    // Use onMount to ensure this code runs on the client-side only
    onMount(async () => {
        // Get cart from localStorage
        cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Ensure all items in cart have a quantity, defaulting to 1
        cart.forEach(item => {
            if (!item.quantity) {
                item.quantity = 1;
            }
        });
        
        // Check stock levels when page loads
        await checkStockLevels();
    });

    // Check if any items exceed available stock
    async function checkStockLevels() {
        stockErrors = [];
        const pb = new PocketBase("https://book-reviews.pockethost.io");
        
        for (const item of cart) {
            try {
                // Get the latest stock information
                const book = await pb.collection("books").getOne(item.id);
                const availableStock = parseInt(book.stock) || 0;
                
                // Check if requested quantity exceeds available stock
                if (item.quantity > availableStock) {
                    stockErrors.push({
                        id: item.id,
                        title: item.title,
                        requested: item.quantity,
                        available: availableStock
                    });
                    
                    // Update the quantity to match available stock
                    item.quantity = availableStock;
                }
            } catch (error) {
                console.error(`Error checking stock for ${item.title}:`, error);
            }
        }
        
        // Update cart in localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Remove an item from the cart
    function removeFromCart(bookId) {
        cart = cart.filter(item => item.id !== bookId);
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Update the quantity of a book in the cart
    function updateQuantity(bookId, quantity) {
        const bookInCart = cart.find(item => item.id === bookId);
        if (bookInCart) {
            const newQuantity = parseInt(quantity);
            const availableStock = parseInt(bookInCart.stock) || 0;
            
            // Ensure quantity doesn't exceed stock
            if (newQuantity > availableStock) {
                // Auto-correct to max available (or 1 if none)
                bookInCart.quantity = availableStock > 0 ? availableStock : 1;
                // Add to stock errors if not already there
                if (!stockErrors.some(error => error.id === bookId)) {
                    stockErrors.push({
                        id: bookId,
                        title: bookInCart.title,
                        requested: newQuantity,
                        available: availableStock
                    });
                }
            } else {
                bookInCart.quantity = newQuantity;
                // Remove from stock errors if it was there
                stockErrors = stockErrors.filter(error => error.id !== bookId);
            }
            
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

<h1>Your Cart</h1>

{#if stockErrors.length > 0}
    <div class="stock-error">
        <h3>Stock Availability Notice</h3>
        {#each stockErrors as error}
            <p>Sorry, requested amount of {error.title} is more than in stock ({error.available})</p>
        {/each}
        <p>Your cart has been adjusted to match available stock.</p>
    </div>
{/if}

{#if cart.length === 0}
    <p>Your cart is empty.</p>
{:else}
    <div class="book-grid">
        {#each cart as book}
            <div class="book">
                <h3>{book.title}</h3>
                <p>Author: {book.author}</p>
                <p>Price: <span class="cart-price">${book.Price}</span></p>
                <div class="cart-quantity-row">
                    <label for="qty-{book.id}">Quantity:</label>
                    <input id="qty-{book.id}" type="number" min="1" max={book.stock} bind:value={book.quantity} on:input={() => updateQuantity(book.id, book.quantity)} class="cart-qty-input" />
                </div>
                <button class="cart-remove-btn" on:click={() => removeFromCart(book.id)}>Remove</button>
            </div>
        {/each}
    </div>

    <div class="cart-summary">
        <p class="pinfo">Total: ${getTotal()}</p>
        <a href="/checkout"><button class="checkout-btn">Checkout</button></a>
    </div>
{/if}

<style>
    /* --- Card Grid (matches inventory) --- */
    .book-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr); /* Force 3 columns */
        gap: 20px;
        padding: 20px;
        max-width: 1200px; /* Set a max width */
        margin: 0 auto; /* Centers the grid */
    }
    @media (max-width: 900px) {
        .book-grid {
            grid-template-columns: repeat(2, 1fr); /* 2 columns on medium screens */
        }
    }
    @media (max-width: 600px) {
        .book-grid {
            grid-template-columns: 1fr; /* 1 column on small screens */
        }
    }
    @media (max-width: 900px) {
        .book-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    @media (max-width: 600px) {
        .book-grid {
            grid-template-columns: 1fr;
        }
    }

    /* --- Card Style (matches inventory) --- */
    .book {
        border: 1px solid #ccc;
        padding: 15px;
        border-radius: 8px;
        background: #383838;
        color: white;
        font-family: monospace;
    }

    /* --- Cart-specific controls --- */
    .cart-quantity-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin: 8px 0 18px 0;
        font-family: monospace;
        font-size: 1rem;
        color: #fff;
    }
    .cart-quantity-row label {
        color: #fff;
        font-size: 1rem;
        font-weight: 500;
        margin-right: 4px;
        font-family: monospace;
    }
    .cart-qty-input {
        width: 60px;
        padding: 6px 10px;
        border: 1px solid #8b7d6b;
        border-radius: 4px;
        background: #222;
        color: #fff;
        font-size: 1rem;
        text-align: center;
        font-family: monospace;
        margin: 0 auto;
        display: block;
    }
    .cart-remove-btn {
        background-color: #dc3545;
        color: white;
        border: none;
        padding: 8px 18px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        margin-top: 14px;
        font-family: monospace;
        display: block;
        margin-left: auto;
        margin-right: auto;
        transition: background 0.2s;
    }
    .cart-remove-btn:hover {
        background-color: #b02a37;
    }

    /* --- Cart price and summary --- */
    .cart-price {
        color: #fff;
        font-weight: bold;
    }
    .cart-summary {
        background: rgba(58, 54, 51, 0.8);
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.18);
        margin: 32px auto 0 auto;
        padding: 24px 16px;
        max-width: 420px;
        text-align: center;
        border: 1px solid #8b7d6b;
        color: #fff;
    }
    .pinfo {
        font-size: 1.3rem;
        color: #fff;
        margin-bottom: 20px;
        text-align: center;
        text-decoration: underline;
    }
    .checkout-btn {
        background-color: #6d6253;
        border: none;
        color: #e6dfd3;
        border-radius: 5px;
        cursor: pointer;
        width: 100%;
        height: 2.6rem;
        font-size: 1.1rem;
        padding: 0.2rem;
        margin-top: 10px;
        transition: background 0.2s;
        box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }
    .checkout-btn:hover {
        background-color: #8b7d6b;
    }
    .stock-error {
        background-color: rgba(220, 53, 69, 0.14);
        color: #fff;
        padding: 15px;
        border-radius: 7px;
        margin: 18px 0 0 0;
        font-family: monospace;
        border: 1px solid #dc3545;
        text-align: center;
    }
    .stock-error h3 {
        margin-top: 0;
        color: #fff;
    }
    @media (max-width: 700px) {
        .book-grid {
            grid-template-columns: 1fr;
            padding: 0;
        }
        .cart-summary {
            max-width: 98vw;
        }
    }
</style>