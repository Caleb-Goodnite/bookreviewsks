import { json } from '@sveltejs/kit';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function POST({ request }) {
  try {
    const { cart } = await request.json();
    
    // Load inventory data from JSON file
    // This would typically come from a database
    const inventoryPath = join(process.cwd(), 'src', 'lib', 'books.json');
    const inventoryData = JSON.parse(readFileSync(inventoryPath, 'utf-8'));
    
    const validationResults = [];
    let isValid = true;
    
    // Check each item in the cart against inventory
    for (const cartItem of cart) {
      const inventoryItem = inventoryData.find(item => item.id === cartItem.id);
      
      if (!inventoryItem) {
        validationResults.push({
          id: cartItem.id,
          title: cartItem.title,
          valid: false,
          message: "Item not found in inventory"
        });
        isValid = false;
        continue;
      }
      
      const inStock = parseInt(inventoryItem.Quantity) || 0;
      const requestedQty = cartItem.quantity || 1;
      
      if (requestedQty > inStock) {
        validationResults.push({
          id: cartItem.id,
          title: cartItem.title,
          valid: false,
          message: `Only ${inStock} in stock, but ${requestedQty} requested`,
          inStock
        });
        isValid = false;
      } else {
        validationResults.push({
          id: cartItem.id,
          title: cartItem.title,
          valid: true,
          inStock
        });
      }
    }
    
    return json({
      valid: isValid,
      items: validationResults
    });
  } catch (error) {
    console.error('Inventory check error:', error);
    return json({ 
      valid: false, 
      error: error.message 
    });
  }
}