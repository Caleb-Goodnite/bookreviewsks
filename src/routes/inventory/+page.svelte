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
                <p>Price: ${book.Price}</p>
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

<style>
    html {
    scroll-behavior: smooth;
}

.pinfo{
    font-size: 1.5rem;
    color: white;
    text-decoration: underline;
}

body {
    background-color: rgb(92, 145, 158);
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    color: white;
    height: 100vh;
}

h1 {
    text-align: center;
    font-size: 4rem;
}

h2, p {
    text-align: center;
    font-family: monospace;
}

.btncont {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin: .2vh 0;
}

button {
    background-color: #FFFFFF;
    color: black;
    border-radius: 0.2em;
    transition: 0.2s;
    width: 7em;
    height: 3em;
    box-shadow: 2px 2px #FFFFFF;
}

button:hover {
    background-color: grey;
    transform: translateY(-0.1em);
}

/* Search Bar */
.search-container {
    display: flex;
    justify-content: center;
    padding: 20px;
}

.searchinput {
    width: 70%;
    max-width: 500px;
    height: 2.5rem;
    border-radius: 0.2em;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
}

.searchinput:focus {
    border-color: #0066cc;
    outline: none;
}

/* Books List */
.book-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    padding: 20px;
}

.book-card {
    background-color: #1c1c1c;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.book-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.book-card h3 {
    font-size: 1.5em;
    margin-bottom: 10px;
}

.book-card p {
    margin: 5px 0;
    font-size: 1rem;
}

.cartbtn {
    align-items: center;
}

/* Footer */
footer {
    background-color: rgb(34, 34, 34);
    padding: 1rem;
    text-align: center;
}

/* Image Styles */
img {
    width: 5em;
    height: 5em;
}

.imgcont {
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding-bottom: 1rem;
}

.brlogoimg {
    width: 8em;
    height: 8em;
}

.donateimg {
    width: 10em;
    height: 10em;
}

figcaption {
    color: white;
    font-size: .8rem;
    text-align: center;
    font-family: monospace;
}

.checkoutbtn{
    width: max-content;
    text-align: center;
    width: 90%;
}

.cartcont {
    gap: 2rem;
    background-color: teal;
}

.search{
    border-radius: .2rem;
    background: rgb(28, 28, 28);
    border-color: white;
    width: 12rem;
    height: 3rem;
}

::placeholder{
    color: white;
    font-family: monospace;
}
</style>