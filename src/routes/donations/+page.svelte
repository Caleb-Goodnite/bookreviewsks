<script>
  let mobileMenuOpen = false;
  
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
</script>

<title>Donate - Book ReViews</title>

<div class="donation-container">
  <div class="donation-header">
    <h1>Support Book ReViews</h1>
    <p>Your donations help us continue supporting charitable organizations in Harvey County</p>
  </div>
  
  <div class="donation-content">
    <div class="donation-info">
      <h2>How Your Donations Help</h2>
      <p>Book ReViews is a non-profit organization that donates all proceeds to local Harvey County charities. Your donations help us:</p>
      
      <ul>
        <li>Maintain our store and operations</li>
        <li>Expand our inventory of quality books</li>
        <li>Support local charitable organizations</li>
        <li>Create community programs and events</li>
      </ul>
      
      <h2>Ways to Donate</h2>
      
      <div class="donation-methods">
        <div class="donation-card">
          <h3>Book Donations</h3>
          <p>Donate your gently used books to our store. We accept books of all genres in good condition.</p>
          <p><strong>Drop-off Hours:</strong> Monday-Saturday, 9:30 AM - 5:30 PM</p>
          <p><strong>Location:</strong> 707 N Main ST, Newton, Kansas 67114</p>
        </div>
        
        <div class="donation-card">
          <h3>Financial Contributions</h3>
          <p>Make a tax-deductible monetary donation to support our operations and charitable giving.</p>
          <button class="donate-button">Donate Now</button>
        </div>
        
        <div class="donation-card">
          <h3>Volunteer Your Time</h3>
          <p>Your time is valuable! Consider volunteering at our store.</p>
          <a href="/volunteer-sign-up"><button>Volunteer Sign-up</button></a>
        </div>
      </div>
    </div>
    
    <div class="donation-impact">
      <h2>Your Impact</h2>
      <p>In the past year, with the help of generous donors like you, we've been able to:</p>
      
      <div class="impact-stats">
        <div class="stat-card">
          <div class="stat-number">$25,000+</div>
          <div class="stat-description">Donated to local charities</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-number">15,000+</div>
          <div class="stat-description">Books recycled and resold</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-number">500+</div>
          <div class="stat-description">Volunteer hours contributed</div>
        </div>
      </div>
      
      <div class="testimonial">
        <blockquote>
          "Book ReViews has been an incredible partner for our organization. Their donations have helped us provide essential services to families in need throughout Harvey County."
        </blockquote>
        <cite>— Local Charity Director</cite>
      </div>
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
        <a href="/donations">Donate</a>
      </div>
    </div>
    
    <div class="footer-section">
      <h3>Connect With Us</h3>
      <div class="footer-buttons vertical">
        <a href="tel:3162833442"><button>Call</button></a>
        <a href="mailto:newtonbkreviews@sbcglobal.net"><button>Email</button></a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2023 Book ReViews. All proceeds support Harvey County charities.</p>
  </div>
</footer>

<style>
  .donation-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .donation-header {
    text-align: center;
    margin-bottom: 40px;
  }
  
  .donation-header h1 {
    color: white;
    margin-bottom: 10px;
  }
  
  .donation-header p {
    font-size: 1.2rem;
    color: #e6dfd3;
  }
  
  .donation-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
  
  .donation-info, .donation-impact {
    background-color: rgba(58, 54, 51, 0.7);
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .donation-info h2, .donation-impact h2 {
    color: #e6dfd3;
    border-bottom: 2px solid #8b7d6b;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
  
  .donation-info ul {
    padding-left: 20px;
    margin-bottom: 30px;
  }
  
  .donation-info li {
    margin-bottom: 10px;
    color: white;
  }
  
  .donation-methods {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    margin-top: 20px;
  }
  
  .donation-card {
    background-color: rgba(139, 125, 107, 0.3);
    padding: 20px;
    border-radius: 6px;
    border-left: 4px solid #8b7d6b;
  }
  
  .donation-card h3 {
    color: #e6dfd3;
    margin-bottom: 10px;
  }
  
  .donation-card p {
    color: white;
    font-size: 0.95rem;
    text-align: left;
    margin-bottom: 10px;
  }
  
  .donate-button {
    background-color: #8b7d6b;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    width: 100%;
    transition: background-color 0.3s;
    margin-top: 10px;
  }
  
  .donate-button:hover {
    background-color: #6d6253;
  }
  
  .impact-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin: 30px 0;
  }
  
  .stat-card {
    background-color: rgba(139, 125, 107, 0.3);
    padding: 20px;
    border-radius: 6px;
    text-align: center;
  }
  
  .stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: #e6dfd3;
    margin-bottom: 10px;
  }
  
  .stat-description {
    color: white;
    font-size: 0.9rem;
  }
  
  .testimonial {
    background-color: rgba(139, 125, 107, 0.2);
    padding: 20px;
    border-radius: 6px;
    margin-top: 30px;
    position: relative;
  }
  
  .testimonial blockquote {
    color: white;
    font-style: italic;
    margin: 0 0 15px 0;
    padding-left: 20px;
    border-left: 3px solid #8b7d6b;
  }
  
  .testimonial cite {
    color: #e6dfd3;
    display: block;
    text-align: right;
    font-style: normal;
  }
  
  @media (max-width: 768px) {
    .donation-content {
      grid-template-columns: 1fr;
    }
    
    .donation-info {
      margin-bottom: 30px;
    }
    
    .impact-stats {
      grid-template-columns: 1fr;
    }
  }
</style>