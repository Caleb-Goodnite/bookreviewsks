// place files you want to import through the `$lib` alias in this folder.
export { sendOrderConfirmation } from './email.js';

// You can also add other utility functions here
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// Add a function to store order details for the success page
export function saveOrderDetails(orderDetails) {
  try {
    localStorage.setItem('lastPayment', JSON.stringify(orderDetails));
    return true;
  } catch (error) {
    console.error('Failed to save order details:', error);
    return false;
  }
}