<script>
  import "../styles.css";
  
  let mobileMenuOpen = false;
  
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
    console.log("Menu toggled:", mobileMenuOpen);
  }
</script>

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
    <a href="/"><button id="navbutton">Home</button></a>
    <a href="/inventory"><button id="navbutton">Inventory</button></a>
    <a href="/#about"><button id="navbutton">About Us</button></a>
    <a href="/cart"><button id="navbutton">Cart</button></a>
    <a href="/checkout"><button id="navbutton">Checkout</button></a>
    <a href="/volunteer-sign-up"><button id="navbutton">Volunteer</button></a>
    <a href="/donations"><button id="navbutton">Donate</button></a>
  </div>
  
  <div class="mobile-nav" class:open={mobileMenuOpen}>
    <div class="mobile-nav-links">
      <a href="/"><button id="navbutton">Home</button></a>
      <a href="/inventory"><button id="navbutton">Inventory</button></a>
      <a href="/#about"><button id="navbutton">About Us</button></a>
      <a href="/cart"><button id="navbutton">Cart</button></a>
      <a href="/checkout"><button id="navbutton">Checkout</button></a>
      <a href="/volunteer-sign-up"><button id="navbutton">Volunteer</button></a>
      <a href="/donations"><button id="navbutton">Donate</button></a>
    </div>
  </div>
</nav>

<slot />
  