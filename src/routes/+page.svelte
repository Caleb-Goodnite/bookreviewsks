<script>
    import { onMount } from 'svelte';
    
    let scrollPosition = 0;
    let isScrolling = false;
    let scrollSpeed = 0.5;
    let animationFrame;
    let imagesLoaded = false;
    
    // Preload images to prevent stuttering
    function preloadImages() {
      const images = document.querySelectorAll('.carousel-img');
      let loadedCount = 0;
      
      images.forEach(img => {
        if (img.complete) {
          loadedCount++;
        } else {
          img.onload = () => {
            loadedCount++;
            if (loadedCount === images.length) {
              imagesLoaded = true;
              startScrolling();
            }
          };
        }
      });
      
      // If all images are already cached and loaded
      if (loadedCount === images.length) {
        imagesLoaded = true;
        startScrolling();
      }
    }
    
    // Adjust scroll speed based on screen width
    function getScrollSpeed() {
      return window.innerWidth <= 768 ? 0.3 : 0.5;
    }
    
    function startScrolling() {
      if (!isScrolling && imagesLoaded) {
        scrollSpeed = getScrollSpeed();
        isScrolling = true;
        scrollCarousel();
      }
    }
    
    function scrollCarousel() {
      const container = document.querySelector('.carousel-container');
      const slides = document.querySelector('.carousel-slides');
      
      if (!slides || !container) return;
      
      // Move the carousel
      scrollPosition += scrollSpeed;
      
      // If we've scrolled past the first image width, reset position
      const firstSlide = slides.firstElementChild;
      if (firstSlide && scrollPosition >= firstSlide.offsetWidth + parseInt(getComputedStyle(firstSlide).marginRight)) {
        // Clone the first slide before removing it
        const clone = firstSlide.cloneNode(true);
        
        // Ensure the image in the clone is loaded
        const cloneImg = clone.querySelector('img');
        if (cloneImg) {
          const tempImg = new Image();
          tempImg.src = cloneImg.src;
        }
        
        slides.appendChild(clone);
        slides.removeChild(firstSlide);
        scrollPosition = 0;
      }
      
      // Apply the transform with a small buffer to ensure smooth transitions
      slides.style.transform = `translateX(-${scrollPosition}px)`;
      
      // Continue animation
      animationFrame = requestAnimationFrame(scrollCarousel);
    }
    
    onMount(() => {
      // Preload images first
      preloadImages();
      
      // Handle window resize
      window.addEventListener('resize', () => {
        scrollSpeed = getScrollSpeed();
      });
      
      return () => {
        if (isScrolling) {
          cancelAnimationFrame(animationFrame);
        }
        window.removeEventListener('resize', () => {});
      };
    });
</script>
  

<title>Book ReViews | Used books in Newton, Kansas</title>

<h1><u>Book ReViews</u></h1>
<p class="pinfo" style="text-decoration: none;">A world of books can be found in our quaint Main Street shop! All proceeds are donated to charitable organizations in Harvey County. <br> Our volunteer staff is ready to help you find that special book.</p>

<div id="storefrontcont">
    <img src="/images/storefront.jpg" alt="Book ReViews Store from front" id="storefront">
</div>

<div class="imgcont" id="brlogoimgcont">
    <img src="/images/brlogo.jpg" alt="Book ReViews Logo" class="brlogoimg">
    <img src="/images/brlogo.jpg" alt="Book ReViews Logo" class="brlogoimg">
    <img src="/images/brlogo.jpg" alt="Book ReViews Logo" class="brlogoimg">
    <img src="/images/brlogo.jpg" alt="Book ReViews Logo" class="brlogoimg">
    <img src="/images/brlogo.jpg" alt="Book ReViews Logo" class="brlogoimg">
    <img src="/images/brlogo.jpg" alt="Book ReViews Logo" class="brlogoimg">
</div>

<div id="about">
    <h2>About Us</h2>
    <p style="font-size: 1.5em">We sell used and vintage books to support charitable organizations in Harvey County.</p>
    
    <!-- Image Carousel -->
    <div class="carousel-container">
        <div class="carousel-slides">
            <div class="carousel-slide">
                <img src="/images/salvationdonation.jpg" alt="Book ReViews manager Cheryl Major donating to the Salvation Army in Newton, Kansas" class="carousel-img">
                <p class="caption">Donation to the Salvation Army in Newton</p>
            </div>
            <div class="carousel-slide">
                <img src="/images/responderdonation.jpg" alt="Book ReViews donating to Harvey County First Responders for Food Baskets" class="carousel-img">
                <p class="caption">Supporting Harvey County First Responders</p>
            </div>
            <div class="carousel-slide">
                <img src="/images/mm.jpeg" alt="Cheryl Major and Joe Major, Book ReViews Managers." class="carousel-img">
                <p class="caption">Cheryl Major and Joe Major, Book ReViews Managers</p>
            </div>
            <div class="carousel-slide">
                <img src="/images/BoD.jpeg" alt="Book ReViews Board of Directors" class="carousel-img">
                <p class="caption">Book ReViews Board of Directors</p>
            </div>
        </div>
    </div>
    
    <h2>Business Hours:</h2>
    <p>Monday - Friday: 9:30 - 5:30</p>
    <p>Saturday: 9:30 - 5:00</p>
    <p>Sunday: Closed</p>
</div>

<!-- Store Interior Section -->
<div id="store-interior">
    <h2>Inside Our Store</h2>
    <p style="font-size: 1.2em">Browse our extensive collection of books in our welcoming space.</p>
    
    <div class="interior-gallery">
        <div class="interior-image">
            <img src="/images/corner.jpg" alt="Book ReViews store interior showing bookshelves" class="store-img">
            <p class="img-caption">Our well-organized bookshelves</p>
        </div>
        <div class="interior-image">
            <img src="/images/kidssection.jpg" alt="Book ReViews Kids Section" class="store-img">
            <p class="img-caption">Our Kids Section</p>
        </div>
        <div class="interior-image">
            <img src="/images/charch.jpg" alt="Chair next to books in a corner at Book ReViews" class="store-img">
            <p class="img-caption">Reading corner</p>
        </div>
    </div>
</div>



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
            </div>
        </div>
        
        <div class="footer-section">
            <h3>Connect With Us</h3>
            <div class="footer-buttons vertical">
                <a href="tel:3162833442"><button class="vertical">Call</button></a>
                <a href="mailto:newtonbkreviews@sbcglobal.net"><button class="vertical">Email</button></a>
              </div>
        </div>
    </div>
    <div class="footer-bottom">
        <p>&copy; 2023 Book ReViews. All proceeds support Harvey County charities.</p>
    </div>
</footer>