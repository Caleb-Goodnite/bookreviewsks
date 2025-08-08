import { json } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import { EMAIL_USER, EMAIL_PASSWORD, EMAIL_OWNER } from '$env/static/private';

export async function POST({ request }) {
  try {
    const formData = await request.json();
    
    // Format availability days
    const availabilityDays = Object.entries(formData.availability)
      .filter(([_, isAvailable]) => isAvailable)
      .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1))
      .join(', ');
    
    // Format preferred shift
    let preferredShift = formData.preferredShift;
    if (preferredShift === 'morning') {
      preferredShift = 'Morning (9:30 AM - 1:30 PM)';
    } else if (preferredShift === 'afternoon') {
      preferredShift = 'Afternoon (1:30 PM - 5:30 PM)';
    } else if (preferredShift === 'flexible') {
      preferredShift = 'Flexible';
    } else {
      preferredShift = 'Not specified';
    }
    
    // Format interests
    const interestLabels = {
      'customer-service': 'Customer Service',
      'book-organization': 'Book Organization',
      'special-events': 'Special Events',
      'inventory': 'Inventory Management'
    };
    
    const formattedInterests = formData.interests
      .map(interest => interestLabels[interest] || interest)
      .join(', ');
    
    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
      }
    });
    
    // Format the email content
    const emailContent = `
      <h2>New Volunteer Application</h2>
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Phone:</strong> ${formData.phone}</p>
      
      <h3>Availability</h3>
      <p><strong>Days:</strong> ${availabilityDays || 'None selected'}</p>
      <p><strong>Preferred Shift:</strong> ${preferredShift}</p>
      
      <h3>Areas of Interest</h3>
      <p>${formattedInterests || 'None selected'}</p>
      
      <h3>Previous Volunteer Experience</h3>
      <p>${formData.experience || 'None specified'}</p>
      
      <h3>Additional Information</h3>
      <p>${formData.message || 'None provided'}</p>
    `;
    
    // Send the email
    await transporter.sendMail({
      from: EMAIL_USER,
      to: EMAIL_OWNER,
      subject: 'New Book ReViews Volunteer Application',
      html: emailContent
    });
    
    return json({ success: true });
  } catch (error) {
    console.error('Error sending volunteer application email:', error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
}