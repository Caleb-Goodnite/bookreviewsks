<script>
    import { onMount } from "svelte";
    import PocketBase from 'pocketbase';
    let books = [];
    let filteredBooks = [];
    let searchQuery = "";
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let loading = true;

    // Fetch books from PocketBase
    onMount(async () => {
        const pb = new PocketBase("https://book-reviews.pockethost.io");

        try {
            // Fetch all books for search functionality
            const allBooksResponse = await pb.collection("books").getFullList({
                sort: '-created'
            });
            books = allBooksResponse;

            // Set filtered books to show only the 9 most recent
            filteredBooks = books.slice(0, 9);
            console.log("Fetched books:", books);
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            loading = false;
        }
    });

    // Handle search input
    function handleSearch(event) {
        searchQuery = event.target.value.toLowerCase();
        const searchResults = books.filter(book =>
            book.title.toLowerCase().includes(searchQuery) ||
            book.author.toLowerCase().includes(searchQuery) ||
            book.Isbn.toLowerCase().includes(searchQuery)
        );
        
        // If there's no search query, show only the 9 most recent books
        filteredBooks = searchQuery === "" ? books.slice(0, 9) : searchResults;
    }

    // Add a book to the cart
    function addToCart(book) {
        // Check if book is already in the cart
        const bookInCart = cart.find(item => item.id === book.id);
        const currentStock = parseInt(book.stock) || 0;

        if (bookInCart) {
            // Check if adding one more would exceed stock
            if (bookInCart.quantity + 1 > currentStock) {
                alert(`Sorry, only ${currentStock} of "${book.title}" in stock.`);
                return;
            }
            // If the book is already in the cart, increment the quantity
            bookInCart.quantity += 1;
        } else {
            // Check if we have stock before adding
            if (currentStock < 1) {
                alert(`Sorry, "${book.title}" is out of stock.`);
                return;
            }
            // Otherwise, add the book to the cart with quantity = 1
            // Make sure to include all necessary book properties
            cart.push({
                id: book.id,
                title: book.title,
                author: book.author,
                Price: book.Price,
                stock: book.stock,
                Isbn: book.Isbn,
                condition: book.condition,
                quantity: 1
            });
        }

        // Persist cart in localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`Added ${book.title} to your cart!`);
    }
</script>

<title>Book ReViews - Inventory</title>

<h1>Inventory</h1>
<div class="search-container">
    <input class="search" id="search" type="text" placeholder="Search entire inventory..." on:input={handleSearch}>
</div>

<p><u>Books displayed are the 9 most recent additions to our inventory.</u></p>

{#if loading}
    <p>Loading inventory...</p>
{:else if filteredBooks.length === 0}
    <p>No books found.</p>
{:else}
    <div class="book-grid">
        {#each filteredBooks as book}
            <div class="book">
                <h3>{book.title}</h3>
                <p>Author: {book.author}</p>
                <p>ISBN: {book.Isbn}</p>
                <p>Stock: {book.stock}</p>
                <p>Price: ${book.Price}</p>
                <p>Condition: {book.condition}</p>
                <div style="display: flex;">
                    <button class="cartbtn" on:click={() => addToCart(book)}>Add to Cart</button>
                </div>
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

    .book {
        border: 1px solid #ccc;
        padding: 15px;
        border-radius: 8px;
        background: #383838;
        color: white;
        font-family: monospace;
    }
    .cartbtn {
        background-color: rgb(182, 161, 121);
        border: none;
        padding: 10px;
        border-radius: 5px;
        color: white;
        cursor: pointer;
        margin: auto;
    }
    .cartbtn:hover {
        background-color: #fff2ab;
    }
</style>