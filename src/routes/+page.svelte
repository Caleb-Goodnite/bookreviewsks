<title>Book ReViews - Used books in Newton, Kansas</title>

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
<h1><u>Book ReViews</u></h1>
<p class="pinfo">A world of books can be found in our quaint Main Street shop! All proceeds are donated to charitable organizations in Harvey County. Our volunteer staff is ready to help you find that special book.</p>

<div class="imgcont">
    <img src="src\images\brlogo.jpg" alt="Book ReViews Logo" class="brlogoimg">
    <img src="src\images\brlogo.jpg" alt="Book ReViews Logo" class="brlogoimg">
    <img src="src\images\brlogo.jpg" alt="Book ReViews Logo" class="brlogoimg">
    <img src="src\images\brlogo.jpg" alt="Book ReViews Logo" class="brlogoimg">
</div>

<div id="about">
    <h2>About Us</h2>
    <p>We sell used and vintage books to support charitable organization in Harevey County.</p>
</div>

<div class="imgcont">
    <img src="src\images\salvatationdonation.jpg" alt="Book ReViews manager Cheryl Major donating to the Salvation Army in Newton, Kansas" class="donateimg">
    <img src="src\images\responderdonation.jpg" alt="Book ReViews donating to Harvey County First Responders for Food Baskets" class="donateimg">
</div>
    <!-- svelte-ignore a11y_figcaption_parent -->
<figcaption>Book ReViews Donating to different charitable organizations in Harvey County.</figcaption>

<footer>
    <p class="pcontact">Contact Us:</p>
    <div class="btncont">
        <a href="tel:3162833442"><button>Call</button></a>
        <a href="mailto:newtonbkreviews@sbcglobal.net"><button>Email</button></a>
    </div>
    <p class="pcontact">707 N Main ST, Newton, Kansas 671114</p>
</footer>

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