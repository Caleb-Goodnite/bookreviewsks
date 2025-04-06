<script>
  import "../styles.css"; // Change to match your filename
  
  let mobileMenuOpen = false;
  
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
</script>

<nav>
  <div class="btncont">
    <a href="/"><button id="navbutton">Home</button></a>
    <a href="/inventory"><button id="navbutton">Inventory</button></a>
    <a href="/#about"><button id="navbutton">About Us</button></a>
    <a href="/cart"><button id="navbutton">Cart</button></a>
    <a href="/checkout"><button id="navbutton">Checkout</button></a>
    <a href="/volunteer-sign-up"><button id="navbutton">Volunteer</button></a>
    <a href="/donations"><button id="navbutton">Donate</button></a>
  </div>
  
  <button class="hamburger-menu" on:click={toggleMobileMenu}>
    <span></span>
    <span></span>
    <span></span>
  </button>
  
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
  