<div class="error-container">
  <h1 class="error-title">404: Page Not Found</h1>
  <h2 class="error-subtitle">Oops, you turned to a non-existent page!</h2>
  
  <div class="book-animation">
    <div class="book">
      <div class="book-page"></div>
      <div class="book-page"></div>
      <div class="book-page"></div>
    </div>
  </div>
  
  <p class="error-message">It seems this chapter doesn't exist in our collection.</p>
  <p class="return-link">Ready to continue your literary journey? <a href="/">Return to our bookshelf</a></p>
  
  <div class="imgcont">
    <img src="images/brlogo.jpg" alt="Book ReViews Logo" class="error-logo">
  </div>
</div>

<style>
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    text-align: center;
    min-height: 70vh;
  }
  
  .error-title {
    font-family: Georgia, serif;
    font-size: 3.5rem;
    color: #8b7d6b;
    margin-bottom: 0.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .error-subtitle {
    font-family: monospace;
    font-size: 1.8rem;
    margin-bottom: 2rem;
    color: #e6dfd3;
  }
  
  .error-message {
    font-size: 1.2rem;
    margin: 1.5rem 0;
    font-style: italic;
    color: #e6dfd3;
  }
  
  .return-link {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }
  
  .return-link a {
    color: #c9b99c;
    text-decoration: none;
    font-weight: bold;
    transition: all 0.3s ease;
    border-bottom: 2px solid transparent;
    padding-bottom: 2px;
  }
  
  .return-link a:hover {
    color: white;
    border-bottom: 2px solid white;
  }
  
  .error-logo {
    width: 10em;
    height: 10em;
    border-radius: 50%;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease;
  }
  
  .error-logo:hover {
    transform: scale(1.05);
  }
  
  /* Book animation */
  .book-animation {
    margin: 2rem 0;
    perspective: 1000px;
  }
  
  .book {
    position: relative;
    width: 100px;
    height: 150px;
    transform-style: preserve-3d;
    animation: book-flip 5s infinite ease-in-out;
  }
  
  .book-page {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #e6dfd3;
    border: 1px solid #8b7d6b;
    transform-origin: left center;
    transform-style: preserve-3d;
  }
  
  .book-page:nth-child(1) {
    animation: page-flip 5s infinite ease-in-out;
  }
  
  .book-page:nth-child(2) {
    animation: page-flip 5s infinite ease-in-out 0.5s;
  }
  
  .book-page:nth-child(3) {
    animation: page-flip 5s infinite ease-in-out 1s;
  }
  
  @keyframes book-flip {
    0%, 100% { transform: rotateY(0deg); }
    50% { transform: rotateY(15deg); }
  }
  
  @keyframes page-flip {
    0%, 100% { transform: rotateY(0deg); }
    50% { transform: rotateY(170deg); }
  }
  
  @media (max-width: 768px) {
    .error-title {
      font-size: 2.5rem;
    }
    
    .error-subtitle {
      font-size: 1.4rem;
    }
  }
</style>