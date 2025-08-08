<script>
  import "../styles.css";
  import { page } from '$app/stores';
  // import Footer from '$lib/components/Footer.svelte'; // Example: Adjust path if you have a Footer component

  let mobileMenuOpen = false;

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMenu() {
    mobileMenuOpen = false;
  }

  // SEO metadata that will be used across the site
  const siteName = "Book ReViews";
  const siteDescription = "Book ReViews is a non-profit used bookstore in Newton, Kansas supporting Harvey County charities through book sales, donations & volunteer opportunities."; 
  const siteKeywords = "book reviews, used books, newton kansas, harvey county, bookstore, non-profit, charity, donate books, volunteer, book reviews kansas, newton book reviews, book, reviews, books, literature, reviews";
</script>

<svelte:head>
  <!-- Global SEO metadata -->
  <meta name="keywords" content={siteKeywords}>
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content={$page.url.href}>
  <meta property="og:site_name" content={siteName}>
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content={$page.url.href}>
  
  <!-- Favicon declarations are primarily in app.html -->
</svelte:head>

<header class="site-header">
  <nav class="main-nav">
    <button class="hamburger-menu" on:click={toggleMobileMenu} aria-label="Toggle navigation menu" aria-expanded={mobileMenuOpen}>
      <span></span>
      <span></span>
      <span></span>
    </button>
    
    <div class="nav-logo">
      <a href="/">
        <img src="/logo-high-res.png" alt="Book ReViews Logo" class="logo-image" />
      </a>
    </div>
    
    <div class="desktop-nav-links btncont">
      <a href="/"><button class="nav-button">Home</button></a>
      <a href="/inventory"><button class="nav-button">Inventory</button></a>
      <a href="/#about"><button class="nav-button">About Us</button></a>
      <a href="/cart"><button class="nav-button">Cart</button></a>
      <a href="/checkout"><button class="nav-button">Checkout</button></a>
      <a href="/volunteer-sign-up"><button class="nav-button">Volunteer</button></a>
      <a href="/donations"><button class="nav-button">Donate</button></a>
      <a href="/policies"><button class="nav-button">Policies</button></a>
    </div>
    
    <div class="mobile-nav" class:open={mobileMenuOpen}>
      <div class="mobile-nav-links">
        <a href="/" on:click={closeMenu}><button class="nav-button mobile-nav-button">Home</button></a>
        <a href="/inventory" on:click={closeMenu}><button class="nav-button mobile-nav-button">Inventory</button></a>
        <a href="/#about" on:click={closeMenu}><button class="nav-button mobile-nav-button">About Us</button></a>
        <a href="/cart" on:click={closeMenu}><button class="nav-button mobile-nav-button">Cart</button></a>
        <a href="/checkout" on:click={closeMenu}><button class="nav-button mobile-nav-button">Checkout</button></a>
        <a href="/volunteer-sign-up" on:click={closeMenu}><button class="nav-button mobile-nav-button">Volunteer</button></a>
        <a href="/donations" on:click={closeMenu}><button class="nav-button mobile-nav-button">Donate</button></a>
        <a href="/policies" on:click={closeMenu}><button class="nav-button mobile-nav-button">Policies</button></a>
      </div>
    </div>
  </nav>
</header>

<main class="site-main">
  <slot />
</main>



<!-- <Footer />  Uncomment and use if you have a Footer.svelte component -->

<style>
    .main-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1em;
    position: relative; /* For hamburger menu positioning */
    background-color: rgb(148, 122, 82); /* From original inline style, can be in styles.css too */
  }

  .nav-logo {
    margin-right: auto; /* Pushes nav links to the right if hamburger is not first */
    margin-left: 1rem; /* Space from left or hamburger */
    z-index: 11; /* Ensure logo is clickable over mobile menu if overlapping */
  }

  .logo-image {
    height: 40px;
    width: auto;
    display: block; /* Prevents extra space below image */
  }

  .desktop-nav-links {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-left: auto; /* Pushes it to the right */
  }

  .nav-button {
    background-color: #FFFFFF;
    color: black;
    border: 1px solid #ccc; /* Added a subtle border */
    border-radius: 0.2em;
    transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;
    width: 8em;
    height: 2.5em;
    box-shadow: 2px 2px .8em rgba(0,0,0,0.1); /* Softer shadow */
    cursor: pointer;
    font-family: inherit;
    font-size: 1em;
  }

  .nav-button:hover {
    background-color: #e0e0e0; /* Lighter grey for hover */
    transform: translateY(-2px);
    box-shadow: 3px 3px 1em rgba(0,0,0,0.15);
  }
  
  .nav-button:focus-visible { /* Using focus-visible for better accessibility */
    outline: 2px solid blue;
    outline-offset: 2px;
  }

  .nav-button:active {
    background-color: #d0d0d0;
    transform: translateY(0);
    box-shadow: 1px 1px .5em rgba(0,0,0,0.1);
  }

  /* Mobile Navigation Styles */
  .mobile-nav {
    display: none; /* Hidden by default, shown by .open class or media query */
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(58, 54, 51, 0.95);
    z-index: 100; /* High z-index to be on top */
    padding-top: 5rem; /* Space for status bar and some breathing room */
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
  }

  .mobile-nav.open {
    transform: translateX(0);
    display: flex; /* Use flex to center content */
    flex-direction: column;
    align-items: center;
    /* justify-content: center; /* If you want links vertically centered too */
  }

  .mobile-nav-links {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem; /* Reduced gap for mobile */
    padding: 1rem;
    width: 100%;
  }

  .mobile-nav-button {
    width: 80%; /* Make buttons wider on mobile */
    max-width: 300px; /* Max width for very wide screens if needed */
    height: 3.5em; /* Slightly taller for easier tapping */
    margin: 0.5em 0;
    font-size: 1.1em;
  }

  /* Hamburger Menu - styles often in global styles.css but can be here too */
  .hamburger-menu {
    /* Basic styles are in styles.css, ensure it's displayed by media query */
    z-index: 101; /* Above mobile nav before it's fully open */
  }

  /* Media query for mobile - controls visibility of desktop vs mobile nav */
  @media (max-width: 1240px) { /* Adjust breakpoint as needed */
    .desktop-nav-links {
      display: none;
    }
    
    .hamburger-menu {
      display: flex; /* Ensure it's flex for span alignment */
      /* Position it if not already done in styles.css */
      /* position: absolute; */
      /* top: 1em; */
      /* left: 1em; */
    }
    
    /* .mobile-nav is controlled by class:open, not display:block here directly */
    
    .main-nav { /* Adjust padding for mobile if logo/hamburger feel cramped */
      padding: 0.75em 1em;
    }

    .nav-logo {
      /* Ensure logo is centered when hamburger is active */
      position: absolute; /* Take out of flow */
      left: 50%;
      transform: translateX(-50%);
      margin-left: 0; /* Override previous margin */
    }
  }

  .site-main {
    padding-top: 1rem; /* Add some space below the fixed/sticky header */
    /* Add other global main content styling if needed */
  }

  .site-footer-placeholder {
    background-color: #3a3633; /* From styles.css footer */
    color: white;
    padding: 20px;
    text-align: center;
    margin-top: 40px; /* Spacing above footer */
    border-top: 3px solid #8b7d6b; /* From styles.css footer */
  }

  .site-footer-placeholder p {
    margin: 0.5em 0;
    color: #c9b99c; /* From styles.css footer-bottom */
    font-family: sans-serif; /* Match body or define */
  }

</style>