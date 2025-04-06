<script>
    import { onMount } from 'svelte';
    
    let formData = {
      name: '',
      email: '',
      phone: '',
      availability: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false
      },
      preferredShift: '',
      experience: '',
      interests: [],
      message: ''
    };
    
    let submitted = false;
    let error = null;
    let submitting = false;
    
    async function handleSubmit() {
      // Validate form
      if (!formData.name || !formData.email || !formData.phone) {
        error = "Please fill out all required fields";
        return;
      }
      
      submitting = true;
      
      try {
        // Send the form data to our API endpoint
        const response = await fetch('/api/volunteer-signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
          throw new Error('Failed to submit application');
        }
        
        // Reset form and show success message
        submitted = true;
        error = null;
      } catch (err) {
        console.error("Error submitting form:", err);
        error = "There was a problem submitting your application. Please try again.";
      } finally {
        submitting = false;
      }
    }
    
    function handleInterestChange(interest) {
      if (formData.interests.includes(interest)) {
        formData.interests = formData.interests.filter(i => i !== interest);
      } else {
        formData.interests = [...formData.interests, interest];
      }
    }
</script>

<title>Volunteer - Book ReViews</title>

<div class="volunteer-container">
  <div class="volunteer-header">
    <h1>Volunteer at Book ReViews</h1>
    <p>Join our team of dedicated volunteers and help support charitable organizations in Harvey County!</p>
  </div>
  
  <div class="volunteer-content">
    <div class="volunteer-info">
      <h2>Why Volunteer With Us?</h2>
      <ul>
        <li>Help raise funds for local charities</li>
        <li>Meet fellow book lovers</li>
        <li>Gain retail and customer service experience</li>
        <li>Access to special book events</li>
        <li>Flexible scheduling to fit your availability</li>
      </ul>
      
      <h2>Volunteer Opportunities</h2>
      <div class="volunteer-roles">
        <div class="role-card">
          <h3>Customer Service</h3>
          <p>Help customers find books, process sales, and provide information about our store and mission.</p>
        </div>
        <div class="role-card">
          <h3>Book Organization</h3>
          <p>Sort, categorize, and shelve books to maintain our organized and welcoming environment.</p>
        </div>
        <div class="role-card">
          <h3>Special Events</h3>
          <p>Assist with book sales, author visits, and community outreach events.</p>
        </div>
      </div>
    </div>
    
    <div class="volunteer-form">
      {#if submitted}
        <div class="success-message">
          <h2>Thank You!</h2>
          <p>Your volunteer application has been submitted. We'll contact you soon to discuss the next steps.</p>
          <button on:click={() => submitted = false}>Submit Another Application</button>
        </div>
      {:else}
        <h2>Volunteer Application</h2>
        {#if error}
          <div class="error-message">{error}</div>
        {/if}
        <form on:submit|preventDefault={handleSubmit}>
          <div class="form-group">
            <label for="name">Name *</label>
            <input type="text" id="name" bind:value={formData.name} required>
          </div>
          
          <div class="form-group">
            <label for="email">Email *</label>
            <input type="email" id="email" bind:value={formData.email} required>
          </div>
          
          <div class="form-group">
            <label for="phone">Phone *</label>
            <input type="tel" id="phone" bind:value={formData.phone} required>
          </div>
          
          <div class="form-group">
            <span id="availability-label">Availability (Check all that apply)</span>
            <div class="checkbox-group" role="group" aria-labelledby="availability-label">
              <label>
                <input type="checkbox" bind:checked={formData.availability.monday}>
                Monday
              </label>
              <label>
                <input type="checkbox" bind:checked={formData.availability.tuesday}>
                Tuesday
              </label>
              <label>
                <input type="checkbox" bind:checked={formData.availability.wednesday}>
                Wednesday
              </label>
              <label>
                <input type="checkbox" bind:checked={formData.availability.thursday}>
                Thursday
              </label>
              <label>
                <input type="checkbox" bind:checked={formData.availability.friday}>
                Friday
              </label>
              <label>
                <input type="checkbox" bind:checked={formData.availability.saturday}>
                Saturday
              </label>
            </div>
          </div>
          
          <div class="form-group">
            <label for="shift">Preferred Shift</label>
            <select id="shift" bind:value={formData.preferredShift}>
              <option value="">Select a shift</option>
              <option value="morning">Morning (9:30 AM - 1:30 PM)</option>
              <option value="afternoon">Afternoon (1:30 PM - 5:30 PM)</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
          
          <div class="form-group">
            <span id="interests-label">Areas of Interest (Check all that apply)</span>
            <div class="checkbox-group" role="group" aria-labelledby="interests-label">
              <label>
                <input type="checkbox" on:change={() => handleInterestChange('customer-service')}>
                Customer Service
              </label>
              <label>
                <input type="checkbox" on:change={() => handleInterestChange('book-organization')}>
                Book Organization
              </label>
              <label>
                <input type="checkbox" on:change={() => handleInterestChange('special-events')}>
                Special Events
              </label>
              <label>
                <input type="checkbox" on:change={() => handleInterestChange('inventory')}>
                Inventory Management
              </label>
            </div>
          </div>
          
          <div class="form-group">
            <label for="experience">Previous Volunteer Experience</label>
            <textarea id="experience" bind:value={formData.experience} rows="3"></textarea>
          </div>
          
          <div class="form-group">
            <label for="message">Additional Information</label>
            <textarea id="message" bind:value={formData.message} rows="3"></textarea>
          </div>
          
          <!-- Update the submit button to show loading state -->
          <button type="submit" class="submit-btn" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      {/if}
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
        <a href="tel:3162833442"><button>Call</button></a>
        <a href="mailto:newtonbkreviews@sbcglobal.net"><button>Email</button></a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2025 Book ReViews. All proceeds support Harvey County charities.</p>
  </div>
</footer>
  
<style>
  .volunteer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .volunteer-header {
    text-align: center;
    margin-bottom: 40px;
  }
  
  .volunteer-header h1 {
    color: white;
    margin-bottom: 10px;
  }
  
  .volunteer-header p {
    font-size: 1.2rem;
    color: #e6dfd3;
  }
  
  .volunteer-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
  
  .volunteer-info {
    background-color: rgba(58, 54, 51, 0.7);
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .volunteer-info h2 {
    color: #e6dfd3;
    border-bottom: 2px solid #8b7d6b;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
  
  .volunteer-info ul {
    padding-left: 20px;
    margin-bottom: 30px;
  }
  
  .volunteer-info li {
    margin-bottom: 10px;
    color: white;
  }
  
  .volunteer-roles {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
    margin-top: 20px;
  }
  
  .role-card {
    background-color: rgba(139, 125, 107, 0.3);
    padding: 15px;
    border-radius: 6px;
    border-left: 4px solid #8b7d6b;
  }
  
  .role-card h3 {
    color: #e6dfd3;
    margin-bottom: 10px;
  }
  
  .role-card p {
    color: white;
    font-size: 0.95rem;
    text-align: left;
  }
  
  .volunteer-form {
    background-color: rgba(58, 54, 51, 0.7);
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .volunteer-form h2 {
    color: #e6dfd3;
    border-bottom: 2px solid #8b7d6b;
    padding-bottom: 10px;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label, .form-group span {
    display: block;
    margin-bottom: 8px;
    color: white;
    font-weight: bold;
  }
  
  .form-group input[type="text"],
  .form-group input[type="email"],
  .form-group input[type="tel"],
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #8b7d6b;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.9);
    color: #333;
    font-size: 16px;
    box-sizing: border-box;
  }
  
  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #c9b99c;
    box-shadow: 0 0 0 2px rgba(201, 185, 156, 0.3);
  }
  
  .checkbox-group {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
  }
  
  .checkbox-group label {
    display: flex;
    align-items: center;
    font-weight: normal;
  }
  
  .checkbox-group input[type="checkbox"] {
    margin-right: 8px;
  }
  
  .submit-btn {
    background-color: #8b7d6b;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    width: 100%;
    transition: background-color 0.3s;
  }
  
  .submit-btn:hover {
    background-color: #6d6253;
  }
  
  .error-message {
    background-color: rgba(220, 53, 69, 0.2);
    color: #dc3545;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .success-message {
    background-color: rgba(40, 167, 69, 0.2);
    border: 1px solid rgba(40, 167, 69, 0.4);
    padding: 30px;
    border-radius: 8px;
    text-align: center;
  }
  
  .success-message h2 {
    color: #28a745;
    border-bottom: none;
  }
  
  .success-message p {
    margin: 20px 0;
    color: white;
  }
  
  .success-message button {
    background-color: #8b7d6b;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .success-message button:hover {
    background-color: #6d6253;
  }
  
  @media (max-width: 768px) {
    .volunteer-content {
      grid-template-columns: 1fr;
    }
    
    .volunteer-info {
      margin-bottom: 30px;
    }
    
    .checkbox-group {
      grid-template-columns: 1fr 1fr;
    }
  }
  
  @media (max-width: 480px) {
    .checkbox-group {
      grid-template-columns: 1fr;
    }
  }
</style>