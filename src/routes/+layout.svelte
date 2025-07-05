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
    <button class="hamburger-menu" class:active={mobileMenuOpen} on:click={toggleMobileMenu} aria-label="Toggle navigation menu" aria-expanded={mobileMenuOpen}>
      <span></span>
      <span></span>
      <span></span>
    </button>
    
    <div class="nav-logo">
      <a href="/">
        <img src="/logo-high-res.png" alt="Book ReViews Logo" class="logo-image" />
      </a>
    </div>
    
    <nav class="glassmorphism-nav">
      <a href="/" class="nav-pill {$page.url.pathname === '/' ? 'active' : ''}">Home</a>
      <a href="/inventory" class="nav-pill {$page.url.pathname === '/inventory' ? 'active' : ''}">Inventory</a>
      <a href="/#about" class="nav-pill {$page.url.pathname === '/#about' ? 'active' : ''}">About</a>
      <a href="/cart" class="nav-pill {$page.url.pathname === '/cart' ? 'active' : ''}">Cart</a>
      <a href="/checkout" class="nav-pill {$page.url.pathname === '/checkout' ? 'active' : ''}">Checkout</a>
      <a href="/volunteer-sign-up" class="nav-pill {$page.url.pathname === '/volunteer-sign-up' ? 'active' : ''}">Volunteer</a>
      <a href="/donations" class="nav-pill {$page.url.pathname === '/donations' ? 'active' : ''}">Donate</a>
      <a href="/policies" class="nav-pill {$page.url.pathname === '/policies' ? 'active' : ''}">Policies</a>
    </nav>
    
    <div class="mobile-nav" class:open={mobileMenuOpen}>
      <div class="mobile-nav-links">
        <a href="/" on:click={closeMenu} class="mobile-nav-pill {$page.url.pathname === '/' ? 'active' : ''}">Home</a>
        <a href="/inventory" on:click={closeMenu} class="mobile-nav-pill {$page.url.pathname === '/inventory' ? 'active' : ''}">Inventory</a>
        <a href="/#about" on:click={closeMenu} class="mobile-nav-pill {$page.url.pathname === '/#about' ? 'active' : ''}">About</a>
        <a href="/cart" on:click={closeMenu} class="mobile-nav-pill {$page.url.pathname === '/cart' ? 'active' : ''}">Cart</a>
        <a href="/checkout" on:click={closeMenu} class="mobile-nav-pill {$page.url.pathname === '/checkout' ? 'active' : ''}">Checkout</a>
        <a href="/volunteer-sign-up" on:click={closeMenu} class="mobile-nav-pill {$page.url.pathname === '/volunteer-sign-up' ? 'active' : ''}">Volunteer</a>
        <a href="/donations" on:click={closeMenu} class="mobile-nav-pill {$page.url.pathname === '/donations' ? 'active' : ''}">Donate</a>
        <a href="/policies" on:click={closeMenu} class="mobile-nav-pill {$page.url.pathname === '/policies' ? 'active' : ''}">Policies</a>
      </div>
    </div>
  </nav>
</header>

<main class="site-main" id="main-content">
  <slot />
</main>

<footer>
  <div class="footer-content">
    <div class="footer-section">
      <h3>Contact Us</h3>
      <p class="pcontact">Phone: 316-283-3442</p>
      <p class="pcontact">Email: newtonbkreviews@sbcglobal.net</p>
      <p class="pcontact">707 N Main ST, Newton, Kansas 67114</p>
    </div>
    
    <div class="footer-section">
      <h3>Quick Links</h3>
      <div class="footer-links">
        <a href="/">Home</a>
        <a href="/inventory">Inventory</a>
        <a href="/#about">About Us</a>
        <a href="/volunteer-sign-up">Volunteer</a>
        <a href="/policies">Policies</a>
      </div>
    </div>
    
    <div class="footer-section">
      <h3>Connect With Us</h3>
      <div class="footer-buttons">
        <a href="tel:3162833442" class="btn btn-secondary">Call</a>
        <a href="mailto:newtonbkreviews@sbcglobal.net" class="btn btn-secondary">Email</a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2025 Book ReViews. All proceeds support Harvey County charities.</p>
  </div>
</footer>

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

  /* Glassmorphism Navigation */
  .glassmorphism-nav {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50px;
    padding: 4px;
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);
    gap: 2px;
    margin-left: auto;
  }

  .nav-pill {
    padding: 12px 16px;
    border-radius: 50px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    letter-spacing: -0.025em;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    border: none;
    background: transparent;
    color: rgba(245, 245, 245, 0.7);
    position: relative;
    overflow: hidden;
  }

  .nav-pill:hover {
    transform: scale(1.05);
    background: rgba(255, 255, 255, 0.1);
    color: rgba(245, 245, 245, 0.9);
  }

  .nav-pill:active {
    transform: scale(0.95);
  }

  .nav-pill.active {
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    color: var(--text-light);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    font-weight: 500;
  }

  .nav-pill:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 2px;
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

  .mobile-nav-pill {
    width: 80%;
    max-width: 300px;
    padding: 16px 24px;
    margin: 0.5em 0;
    border-radius: 50px;
    font-size: 16px;
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    letter-spacing: -0.025em;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgba(245, 245, 245, 0.8);
    text-align: center;
    display: block;
  }

  .mobile-nav-pill:hover {
    transform: scale(1.05);
    background: rgba(255, 255, 255, 0.15);
    color: rgba(245, 245, 245, 1);
  }

  .mobile-nav-pill:active {
    transform: scale(0.95);
  }

  .mobile-nav-pill.active {
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    color: var(--text-light);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    font-weight: 500;
  }

  /* Hamburger Menu - styles often in global styles.css but can be here too */
  .hamburger-menu {
    /* Basic styles are in styles.css, ensure it's displayed by media query */
    z-index: 101; /* Above mobile nav before it's fully open */
  }

  /* Media query for mobile - controls visibility of desktop vs mobile nav */
  @media (max-width: 1240px) { /* Adjust breakpoint as needed */
    .glassmorphism-nav {
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