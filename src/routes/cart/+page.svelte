<script>
    import { onMount } from "svelte";
    import PocketBase from 'https://cdn.jsdelivr.net/npm/pocketbase@0.25.2/+esm';

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
                // Show immediate alert to user
                alert(`Sorry, only ${availableStock} copies of "${bookInCart.title}" are in stock.`);
                
                // Reset the quantity to available stock
                bookInCart.quantity = availableStock;
                
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

<nav id="navcont">
    <div class="btncont">
    <a href="/"><button id="navbutton">Home</button></a>
    <a href="/inventory"><button id="navbutton">Inventory</button></a>
    <a href="/#about"><button id="navbutton">About Us</button></a>
    <a href="/cart"><button id="navbutton">Cart</button></a>
    <a href="/checkout"><button id="navbutton">Checkout</button></a>
    <a href="/volunteer-sign-up"><button id="navbutton">Volunteer</button></a>
    </div>
</nav>

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
    .stock-error {
        background-color: #ff6b6b;
        color: white;
        padding: 15px;
        border-radius: 5px;
        margin: 15px 0;
        font-family: monospace;
    }
    .stock-error h3 {
        margin-top: 0;
    }
</style>