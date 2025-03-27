<script>
    import { onMount } from "svelte";
    import PocketBase from 'https://cdn.jsdelivr.net/npm/pocketbase@0.25.2/+esm';
    let books = [];
    let filteredBooks = [];
    let searchQuery = "";
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Fetch books from PocketBase
    onMount(async () => {
        const pb = new PocketBase("https://book-reviews.pockethost.io");

        try {
            const response = await pb.collection("books").getList(1, 9, {
                sort: "-created"
            });

            books = response.items;
            filteredBooks = books; // Show all books initially
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    });

    // Handle search input
    function handleSearch(event) {
        searchQuery = event.target.value.toLowerCase();
        filteredBooks = books.filter(book =>
            book.title.toLowerCase().includes(searchQuery) ||
            book.author.toLowerCase().includes(searchQuery) ||
            book.Isbn.toLowerCase().includes(searchQuery)
        );
    }

    // Add a book to the cart
    function addToCart(book) {
        // Check if book is already in the cart
        const bookInCart = cart.find(item => item.id === book.id);

        if (bookInCart) {
            // If the book is already in the cart, increment the quantity
            bookInCart.quantity += 1;
        } else {
            // Otherwise, add the book to the cart with quantity = 1
            cart.push({...book, quantity: 1});
        }

        // Persist cart in localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`Added ${book.title} to your cart!`);
    }

</script>

<title>Book ReViews - Inventory</title>

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

<h1>Inventory</h1>
<input class="search" id="search" type="text" placeholder="Search entire inventory..." on:input={handleSearch}>

<p><u>Books displayed are the 9 most recent additions to our inventory.</u></p>

{#if filteredBooks.length === 0}
    <p>No books found.</p>
{:else}
    <div class="book-grid">
        {#each filteredBooks as book}
            <div class="book">
                <h3>{book.title}</h3>
                <p>Author: {book.author}</p>
                <p>ISBN: {book.Isbn}</p>
                <p>Stock: {book.stock}</p>
                <p>Price: {book.Price}</p>
                <p>Condition: {book.condition}
                <button class="cartbtn" on:click={() => addToCart(book)}>Add to Cart</button>
            </div>
        {/each}
    </div>
{/if}

<style>
    h3 {
        text-align: center;
    }
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
    .cartbtn {
        background-color: #f5a623;
        border: none;
        padding: 10px;
        border-radius: 5px;
        color: white;
        cursor: pointer;
    }
    .cartbtn:hover {
        background-color: #f58f20;
    }
</style>