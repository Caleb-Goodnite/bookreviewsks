<script>
  import "../styles.css";
  import { page } from '$app/stores';
  
  let mobileMenuOpen = false;
  
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
    console.log("Menu toggled:", mobileMenuOpen);
  }
  
  function closeMenu() {
    mobileMenuOpen = false;
    console.log("Menu closed");
  }
  
  // SEO metadata that will be used across the site
  const siteName = "Book ReViews";
  const siteDescription = "Book ReViews is a non-profit used bookstore in Newton, Kansas supporting Harvey County charities through book sales, donations & volunteer opportunities."; 
  const siteKeywords = "book reviews, used books, newton kansas, harvey county, bookstore, non-profit, charity, donate books, volunteer";
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
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" href="/favicon.png">
</svelte:head>

<nav style="display: flex; align-items: center; justify-content: space-between; padding: 1em; position: relative;">
  <button class="hamburger-menu" on:click={toggleMobileMenu} aria-label="Toggle navigation menu">
    <span></span>
    <span></span>
    <span></span>
  </button>
  
  <div class="nav-logo" style="margin-right: auto; margin-left: 1rem;">
    <a href="/">
      <img src="/logo-high-res.png" alt="Book ReViews Logo" style="height: 40px; width: auto;" />
    </a>
  </div>
  
  <div class="btncont" style="display: flex; justify-content: center; gap: 1.5rem; margin-left: auto;">
    <a href="/"><button style="background-color: #FFFFFF; color: black; border-radius: 0.2em; transition: 0.2s; width: 10em; height: 3em; box-shadow: 2px 2px .8em #FFFFFF;">Home</button></a>
    <a href="/inventory"><button style="background-color: #FFFFFF; color: black; border-radius: 0.2em; transition: 0.2s; width: 10em; height: 3em; box-shadow: 2px 2px .8em #FFFFFF;">Inventory</button></a>
    <a href="/#about"><button style="background-color: #FFFFFF; color: black; border-radius: 0.2em; transition: 0.2s; width: 10em; height: 3em; box-shadow: 2px 2px .8em #FFFFFF;">About Us</button></a>
    <a href="/cart"><button style="background-color: #FFFFFF; color: black; border-radius: 0.2em; transition: 0.2s; width: 10em; height: 3em; box-shadow: 2px 2px .8em #FFFFFF;">Cart</button></a>
    <a href="/checkout"><button style="background-color: #FFFFFF; color: black; border-radius: 0.2em; transition: 0.2s; width: 10em; height: 3em; box-shadow: 2px 2px .8em #FFFFFF;">Checkout</button></a>
    <a href="/volunteer-sign-up"><button style="background-color: #FFFFFF; color: black; border-radius: 0.2em; transition: 0.2s; width: 10em; height: 3em; box-shadow: 2px 2px .8em #FFFFFF;">Volunteer</button></a>
    <a href="/donations"><button style="background-color: #FFFFFF; color: black; border-radius: 0.2em; transition: 0.2s; width: 10em; height: 3em; box-shadow: 2px 2px .8em #FFFFFF;">Donate</button></a>
  </div>
  
  <div class="mobile-nav" class:open={mobileMenuOpen} style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(58, 54, 51, 0.95); z-index: 9; padding-top: 5rem; transform: translateX(-100%); transition: transform 0.3s ease-in-out;">
    <div class="mobile-nav-links" style="display: flex; flex-direction: column; align-items: center; gap: 1.5rem; padding: 1rem;">
      <a href="/" on:click={closeMenu}><button style="background-color: #FFFFFF; color: black; border-radius: 0.2em; transition: 0.2s; width: 80%; height: 3em; box-shadow: 2px 2px .8em #FFFFFF; margin: 0.5em 0;">Home</button></a>
      <a href="/inventory" on:click={closeMenu}><button style="background-color: #FFFFFF; color: black; border-radius: 0.2em; transition: 0.2s; width: 80%; height: 3em; box-shadow: 2px 2px .8em #FFFFFF; margin: 0.5em 0;">Inventory</button></a>
      <a href="/#about" on:click={closeMenu}><button style="background-color: #FFFFFF; color: black; border-radius: 0.2em; transition: 0.2s; width: 80%; height: 3em; box-shadow: 2px 2px .8em #FFFFFF; margin: 0.5em 0;">About Us</button></a>
      <a href="/cart" on:click={closeMenu}><button style="background-color: #FFFFFF; color: black; border-radius: 0.2em; transition: 0.2s; width: 80%; height: 3em; box-shadow: 2px 2px .8em #FFFFFF; margin: 0.5em 0;">Cart</button></a>
      <a href="/checkout" on:click={closeMenu}><button style="background-color: #FFFFFF; color: black; border-radius: 0.2em; transition: 0.2s; width: 80%; height: 3em; box-shadow: 2px 2px .8em #FFFFFF; margin: 0.5em 0;">Checkout</button></a>
      <a href="/volunteer-sign-up" on:click={closeMenu}><button style="background-color: #FFFFFF; color: black; border-radius: 0.2em; transition: 0.2s; width: 80%; height: 3em; box-shadow: 2px 2px .8em #FFFFFF; margin: 0.5em 0;">Volunteer</button></a>
      <a href="/donations" on:click={closeMenu}><button style="background-color: #FFFFFF; color: black; border-radius: 0.2em; transition: 0.2s; width: 80%; height: 3em; box-shadow: 2px 2px .8em #FFFFFF; margin: 0.5em 0;">Donate</button></a>
    </div>
  </div>
</nav>

<style>
  /* Mobile menu styles */
  .mobile-nav.open {
    transform: translateX(0) !important;
    display: block !important;
  }
  
  /* Media query for mobile */
  @media (max-width: 1240px) {
    .btncont {
      display: none !important;
    }
    
    .hamburger-menu {
      display: flex !important;
    }
    
    .mobile-nav {
      display: block !important;
    }
    
    nav {
      position: relative !important;
      padding: 1.5em 1em !important;
      min-height: 3.5rem !important;
    }
    
    .nav-logo {
      margin: 0 auto !important;
    }
  }
  
  /* Button hover effect */
  button:hover {
    background-color: grey !important;
    transform: translateY(-0.1em) !important;
  }
</style>

<slot />
  