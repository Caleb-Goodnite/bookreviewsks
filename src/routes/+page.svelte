<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    
    let scrollPosition = 0;
    let isScrolling = false;
    let scrollSpeed = 0.5;
    let animationFrame;
    let imagesLoaded = false;
    let isVisible = false;
    let observerElements = [];
    
    // SEO metadata specific to homepage
    const pageTitle = "Book ReViews | Used Books in Newton, Kansas | Non-Profit Bookstore";
    const pageDescription = "Book ReViews is Newton, Kansas' premier used bookstore supporting Harvey County charities. Browse our inventory, donate books, or volunteer today!";
    const pageKeywords = "book reviews kansas, book reviews ks, used bookstore newton ks, harvey county books, book donations newton, volunteer newton kansas";
    
    // Intersection Observer for scroll animations
    function setupScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                } else {
                    entry.target.classList.remove('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements with animation classes
        const elementsToObserve = document.querySelectorAll('.fade-in-on-scroll, .slide-in-left, .slide-in-right, .scale-in-on-scroll');
        elementsToObserve.forEach(element => {
            observer.observe(element);
        });
        
        return observer;
    }
    
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
    
    // Parallax effect for background elements
    function handleScroll() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    // Add interactive hover effects
    function setupInteractiveEffects() {
        // Add magnetic effect to buttons
        const magneticButtons = document.querySelectorAll('.magnetic-button');
        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
        
        // Add tilt effect to cards
        const tiltCards = document.querySelectorAll('.tilt-card');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            });
        });
    }
    
    onMount(() => {
        // Add js-enabled class for progressive enhancement
        document.documentElement.classList.add('js-enabled');
        
        // Setup scroll animations
        const observer = setupScrollAnimations();
        
        // Preload images first
        preloadImages();
        
        // Setup interactive effects
        setupInteractiveEffects();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            scrollSpeed = getScrollSpeed();
        });
        
        // Add scroll listener for parallax
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Trigger initial animation
        setTimeout(() => {
            isVisible = true;
        }, 100);
        
        return () => {
            if (isScrolling) {
                cancelAnimationFrame(animationFrame);
            }
            window.removeEventListener('resize', () => {});
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    });
</script>

<svelte:head>
    <title>{pageTitle}</title>
    <meta name="description" content={pageDescription}>
    <meta name="keywords" content={pageKeywords}>
    
    <!-- Additional SEO tags for homepage -->
    <link rel="canonical" href={$page.url.href}>
    
    <!-- Open Graph / Facebook -->
    <meta property="og:title" content={pageTitle}>
    <meta property="og:description" content={pageDescription}>
    <meta property="og:image" content="https://bookreviewsks.netlify.app/images/storefront.jpg">
    
    <!-- Twitter -->
    <meta property="twitter:title" content={pageTitle}>
    <meta property="twitter:description" content={pageDescription}>
    <meta property="twitter:image" content="https://bookreviewsks.netlify.app/images/storefront.jpg">
    
    <!-- Structured Data / Schema.org for Local Business -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Book ReViews",
        "image": "https://bookreviewsks.netlify.app/images/storefront.jpg",
        "@id": "https://bookreviewsks.netlify.app",
        "url": "https://bookreviewsks.netlify.app",
        "telephone": "316-283-3442",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "707 N Main ST",
            "addressLocality": "Newton",
            "addressRegion": "KS",
            "postalCode": "67114",
            "addressCountry": "US"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 38.0464,
            "longitude": -97.3452
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:30",
                "closes": "17:30"
            },
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Saturday",
                "opens": "09:30",
                "closes": "17:00"
            }
        ],
        "description": "Book ReViews is a non-profit used bookstore in Newton, Kansas. All proceeds are donated to charitable organizations in Harvey County."
    }
    </script>
</svelte:head>

<div class="hero-section">
    <div class="hero-background parallax-element" data-speed="0.3"></div>
    <div class="hero-content">
        <h1 class="hero-title"><u>Book ReViews - Newton, Kansas</u></h1>
        <p class="pinfo hero-subtitle">A world of books can be found in our quaint Main Street shop in Newton, Kansas!<br> All proceeds from our used bookstore are donated to charitable organizations in Harvey County. <br> Our volunteer staff is ready to help you find that special book in our extensive inventory.</p>
        
        <div class="hero-cta fade-in-on-scroll">
            <a href="/inventory" class="btn btn-primary magnetic-button">Browse Our Inventory</a>
            <a href="/donations" class="btn btn-secondary magnetic-button">Make a Donation</a>
        </div>
    </div>
</div>

<div id="storefrontcont" class="scale-in-on-scroll">
    <div class="storefront-wrapper tilt-card">
        <img src="/images/storefront.jpg" alt="Book ReViews Store from front" id="storefront">
        <div class="storefront-overlay">
            <div class="storefront-info">
                <h3>Visit Our Store</h3>
                <p>707 N Main Street<br>Newton, KS 67114</p>
                <p class="hours">Mon-Fri: 9:30 AM - 5:30 PM<br>Sat: 9:30 AM - 5:00 PM</p>
            </div>
        </div>
    </div>
</div>

<div class="imgcont fade-in-on-scroll">
    <img src="/images/brlogo.jpg" alt="Book ReViews Logo" class="brlogoimg floating-logo">
    <img src="/images/brlogo.jpg" alt="Book ReViews Logo" class="brlogoimg floating-logo">
    <img src="/images/brlogo.jpg" alt="Book ReViews Logo" class="brlogoimg floating-logo">
    <img src="/images/brlogo.jpg" alt="Book ReViews Logo" class="brlogoimg floating-logo">
    <img src="/images/brlogo.jpg" alt="Book ReViews Logo" class="brlogoimg floating-logo">
    <img src="/images/brlogo.jpg" alt="Book ReViews Logo" class="brlogoimg floating-logo">
</div>

<div id="about" class="about-section">
    <div class="container">
        <h2 class="slide-in-left">About Us</h2>
        <p class="about-description slide-in-right">We sell used and vintage books to support charitable organizations in Harvey County.</p>
        
        <!-- Image Carousel -->
        <div class="carousel-container fade-in-on-scroll">
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
                <div class="carousel-slide">
                    <img src="/images/corner.jpg" alt="Book ReViews corner section with vintage books" class="carousel-img">
                    <p class="caption">Our cozy corner section with vintage finds</p>
                </div>
                <div class="carousel-slide">
                    <img src="/images/kidssection.jpg" alt="Book ReViews children's section" class="carousel-img">
                    <p class="caption">Children's section with books for all ages</p>
                </div>
                <div class="carousel-slide">
                    <img src="/images/charch.jpg" alt="Book ReViews charitable donations" class="carousel-img">
                    <p class="caption">Supporting our community through charitable giving</p>
                </div>
            </div>
        </div>
        
        <!-- Store Interior Gallery -->
        <div id="store-interior" class="store-interior-section slide-in-left">
            <h2>Inside Our Store</h2>
            <div class="interior-gallery">
                <div class="interior-image tilt-card">
                    <img src="/images/corner.jpg" alt="Cozy reading corner with vintage books" class="store-img">
                    <div class="img-caption">Cozy reading corner</div>
                </div>
                <div class="interior-image tilt-card">
                    <img src="/images/kidssection.jpg" alt="Children's book section" class="store-img">
                    <div class="img-caption">Children's section</div>
                </div>
                <div class="interior-image tilt-card">
                    <img src="/images/charch.jpg" alt="Main book displays" class="store-img">
                    <div class="img-caption">Main book displays</div>
                </div>
            </div>
        </div>
        
        <!-- Community Impact Section -->
        <div class="impact-section fade-in-on-scroll">
            <h2 class="impact-title">Our Community Impact</h2>
            <div class="impact-grid">
                <div class="impact-card magnetic-button" role="article">
                    <div class="impact-icon-wrapper">
                        <span class="impact-icon" role="img" aria-label="Books">📚</span>
                    </div>
                    <div class="impact-content">
                        <h3 class="impact-number">10,000+</h3>
                        <p class="impact-description">Books sold annually</p>
                    </div>
                </div>
                <div class="impact-card magnetic-button" role="article">
                    <div class="impact-icon-wrapper">
                        <span class="impact-icon" role="img" aria-label="Heart">💝</span>
                    </div>
                    <div class="impact-content">
                        <h3 class="impact-number">$50,000+</h3>
                        <p class="impact-description">Donated to Harvey County charities</p>
                    </div>
                </div>
                <div class="impact-card magnetic-button" role="article">
                    <div class="impact-icon-wrapper">
                        <span class="impact-icon" role="img" aria-label="Handshake">🤝</span>
                    </div>
                    <div class="impact-content">
                        <h3 class="impact-number">25+</h3>
                        <p class="impact-description">Active volunteers</p>
                    </div>
                </div>
                <div class="impact-card magnetic-button" role="article">
                    <div class="impact-icon-wrapper">
                        <span class="impact-icon" role="img" aria-label="Trophy">🏆</span>
                    </div>
                    <div class="impact-content">
                        <h3 class="impact-number">15+</h3>
                        <p class="impact-description">Years serving Newton</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    /* Hero Section */
    .hero-section {
        position: relative;
        min-height: 60vh;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
    }
    
    .hero-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 120%;
        background: url('/images/storefront.jpg') center/cover;
        opacity: 0.1;
        z-index: -1;
    }
    
    .hero-content {
        text-align: center;
        padding: var(--spacing-xl);
        max-width: 1000px;
        margin: 0 auto;
    }
    
    .hero-title {
        font-size: clamp(2rem, 5vw, 4rem);
        margin-bottom: var(--spacing-lg);
        opacity: 0;
        animation: fadeInUp 1s ease 0.2s forwards;
    }
    
    .hero-subtitle {
        font-size: clamp(1rem, 2.5vw, 1.5rem);
        margin-bottom: var(--spacing-xl);
        opacity: 0;
        animation: fadeInUp 1s ease 0.4s forwards;
    }
    
    .hero-cta {
        display: flex;
        gap: var(--spacing-lg);
        justify-content: center;
        flex-wrap: wrap;
        opacity: 0;
        animation: fadeInUp 1s ease 0.6s forwards;
    }
    
    /* Storefront Section */
    .storefront-wrapper {
        position: relative;
        overflow: hidden;
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-xl);
        transition: var(--transition-normal);
    }
    
    .storefront-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            45deg,
            rgba(0, 0, 0, 0.8) 0%,
            transparent 50%,
            transparent 100%
        );
        opacity: 0;
        transition: var(--transition-normal);
        display: flex;
        align-items: flex-end;
        padding: var(--spacing-lg);
    }
    
    .storefront-wrapper:hover .storefront-overlay {
        opacity: 1;
    }
    
    .storefront-info {
        color: var(--text-light);
        transform: translateY(20px);
        transition: var(--transition-normal);
    }
    
    .storefront-wrapper:hover .storefront-info {
        transform: translateY(0);
    }
    
    .storefront-info h3 {
        margin-bottom: var(--spacing-sm);
        font-size: var(--font-size-xl);
    }
    
    .storefront-info p {
        margin-bottom: var(--spacing-xs);
        font-size: var(--font-size-sm);
    }
    
    .hours {
        font-style: italic;
        color: var(--secondary-color);
    }
    
    /* Floating logos */
    .floating-logo {
        transition: var(--transition-normal);
    }
    
    .floating-logo:hover {
        transform: scale(1.2) rotate(10deg);
    }
    
    /* About Section */
    .about-section {
        padding: var(--spacing-xxl) 0;
        min-height: 50vh;
        display: block;
        visibility: visible;
    }
    
    .about-description {
        font-size: var(--font-size-xl);
        max-width: 800px;
        margin: 0 auto var(--spacing-xl);
        text-align: center;
    }
    
    /* Store Interior */
    .store-interior-section {
        margin: var(--spacing-xxl) 0;
        display: block;
        visibility: visible;
    }
    
    .interior-gallery {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--spacing-lg);
        margin-top: var(--spacing-xl);
    }
    
    .interior-image {
        position: relative;
        border-radius: var(--radius-lg);
        overflow: hidden;
        box-shadow: var(--shadow-md);
        transition: var(--transition-normal);
        cursor: pointer;
    }
    
    .interior-image:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-xl);
    }
    
    .store-img {
        width: 100%;
        height: 250px;
        object-fit: cover;
        display: block;
        transition: var(--transition-normal);
    }
    
    .interior-image:hover .store-img {
        transform: scale(1.05);
    }
    
    .img-caption {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
        color: var(--text-light);
        padding: var(--spacing-lg) var(--spacing-md) var(--spacing-md);
        font-size: var(--font-size-sm);
        transform: translateY(100%);
        transition: var(--transition-normal);
    }
    
    .interior-image:hover .img-caption {
        transform: translateY(0);
    }
    
    /* Impact Section Styles */
    .impact-section {
        padding: var(--spacing-xxl) var(--spacing-lg);
        margin: var(--spacing-xxl) auto;
        max-width: 1400px;
    }

    .impact-title {
        font-size: var(--font-size-4xl);
        color: var(--text-light);
        text-align: center;
        margin-bottom: var(--spacing-xl);
        font-weight: 700;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }

    .impact-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--spacing-xl);
        padding: var(--spacing-lg);
    }

    .impact-card {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: var(--radius-xl);
        padding: var(--spacing-xl) var(--spacing-lg);
        text-align: center;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        position: relative;
        overflow: hidden;
    }

    .impact-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%);
        opacity: 0;
        transition: opacity 0.4s ease;
    }

    .impact-card:hover {
        transform: translateY(-8px);
        border-color: rgba(255, 255, 255, 0.5);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }

    .impact-card:hover::before {
        opacity: 1;
    }

    .impact-icon-wrapper {
        margin-bottom: var(--spacing-md);
        position: relative;
        z-index: 1;
    }

    .impact-icon {
        font-size: 3.5rem;
        display: inline-block;
        filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .impact-card:hover .impact-icon {
        transform: scale(1.1) rotate(5deg);
    }

    .impact-content {
        position: relative;
        z-index: 1;
    }

    .impact-number {
        font-size: var(--font-size-3xl);
        font-weight: 700;
        color: var(--text-light);
        margin-bottom: var(--spacing-sm);
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        font-family: var(--font-family-primary);
    }

    .impact-description {
        font-size: var(--font-size-lg);
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.6;
        margin: 0;
        font-weight: 500;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 768px) {
        .impact-grid {
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: var(--spacing-lg);
            padding: var(--spacing-md);
        }

        .impact-card {
            padding: var(--spacing-lg);
        }

        .impact-icon {
            font-size: 3rem;
        }

        .impact-number {
            font-size: var(--font-size-2xl);
        }

        .impact-description {
            font-size: var(--font-size-base);
        }
    }
    
    /* Scroll Animation Classes - Progressive Enhancement */
    .fade-in-on-scroll {
        opacity: 1;
        transform: translateY(0);
        transition: all 0.8s ease;
    }
    
    :global(.js-enabled .fade-in-on-scroll) {
        opacity: 0;
        transform: translateY(30px);
    }
    
    :global(.js-enabled .fade-in-on-scroll.animate-in) {
        opacity: 1;
        transform: translateY(0);
    }
    
    .slide-in-left {
        opacity: 1;
        transform: translateX(0);
        transition: all 0.8s ease;
    }
    
    :global(.js-enabled .slide-in-left) {
        opacity: 0;
        transform: translateX(-50px);
    }
    
    :global(.js-enabled .slide-in-left.animate-in) {
        opacity: 1;
        transform: translateX(0);
    }
    
    .slide-in-right {
        opacity: 1;
        transform: translateX(0);
        transition: all 0.8s ease;
    }
    
    :global(.js-enabled .slide-in-right) {
        opacity: 0;
        transform: translateX(50px);
    }
    
    :global(.js-enabled .slide-in-right.animate-in) {
        opacity: 1;
        transform: translateX(0);
    }
    
    .scale-in-on-scroll {
        opacity: 1;
        transform: scale(1);
        transition: all 0.8s ease;
    }
    
    :global(.js-enabled .scale-in-on-scroll) {
        opacity: 0;
        transform: scale(0.8);
    }
    
    :global(.js-enabled .scale-in-on-scroll.animate-in) {
        opacity: 1;
        transform: scale(1);
    }
    
    /* Magnetic Button Effect */
    .magnetic-button {
        transition: var(--transition-normal);
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
        .hero-cta {
            flex-direction: column;
            align-items: center;
        }
        
        .hero-cta .btn {
            width: 100%;
            max-width: 300px;
        }
        
        .impact-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: var(--spacing-md);
        }
        
        .impact-card {
            padding: var(--spacing-lg);
        }
        
        .interior-gallery {
            grid-template-columns: 1fr;
        }
    }
    
    /* Fallback: Ensure content is visible if JavaScript fails or animations are disabled */
    :global(.no-js .fade-in-on-scroll),
    :global(.no-js .slide-in-left),
    :global(.no-js .slide-in-right),
    :global(.no-js .scale-in-on-scroll) {
        opacity: 1 !important;
        transform: none !important;
    }
    
    @media (prefers-reduced-motion: reduce) {
        .fade-in-on-scroll,
        .slide-in-left,
        .slide-in-right,
        .scale-in-on-scroll {
            opacity: 1 !important;
            transform: none !important;
        }
    }
</style>