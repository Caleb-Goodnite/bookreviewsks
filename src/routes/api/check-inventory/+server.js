import { json } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
  try {
    const { cart } = await request.json();

    if (!env.POCKETBASE_URL) {
      console.error('POCKETBASE_URL is not set in environment variables.');
      return json({ valid: false, error: 'Server configuration error for inventory check.' }, { status: 500 });
    }
    const pb = new PocketBase(env.POCKETBASE_URL);

    const validationResults = [];
    let overallIsValid = true;

    for (const cartItem of cart) {
      if (!cartItem.id) {
        validationResults.push({
          id: cartItem.id, // or a placeholder if ID is truly missing
          title: cartItem.title || 'Unknown Item',
          valid: false,
          message: 'Item ID missing in cart data.'
        });
        overallIsValid = false;
        continue;
      }

      const requestedQty = parseInt(cartItem.quantity) || 1;
      if (requestedQty <= 0) {
        validationResults.push({
          id: cartItem.id,
          title: cartItem.title || 'Unknown Item',
          valid: false,
          message: 'Invalid quantity requested.'
        });
        overallIsValid = false;
        continue;
      }

      try {
        // Assuming your books collection is named 'books' and quantity field is 'stock'
        // Adjust 'books' and 'stock' if your collection/field names are different
        const inventoryItem = await pb.collection('books').getOne(cartItem.id);
        const inStock = parseInt(inventoryItem.stock) || 0;

        if (requestedQty > inStock) {
          validationResults.push({
            id: cartItem.id,
            title: inventoryItem.title || cartItem.title,
            valid: false,
            message: `Only ${inStock} in stock, but ${requestedQty} requested. Please reduce quantity or remove.`,
            inStock,
            requestedQty
          });
          overallIsValid = false;
        } else {
          validationResults.push({
            id: cartItem.id,
            title: inventoryItem.title || cartItem.title,
            valid: true,
            inStock,
            requestedQty
          });
        }
      } catch (err) {
        // Handle cases where item is not found in PocketBase or other DB errors
        if (err.status === 404) {
          validationResults.push({
            id: cartItem.id,
            title: cartItem.title || 'Unknown Item',
            valid: false,
            message: 'Item not found in our records. It may have been removed.',
            requestedQty
          });
        } else {
          console.error(`Error fetching inventory for item ${cartItem.id}:`, err);
          validationResults.push({
            id: cartItem.id,
            title: cartItem.title || 'Unknown Item',
            valid: false,
            message: 'Could not verify stock for this item due to a server issue.',
            requestedQty
          });
        }
        overallIsValid = false;
      }
    }

    return json({
      valid: overallIsValid,
      items: validationResults
    });

  } catch (error) {
    console.error('Overall inventory check error:', error);
    // Differentiate between request parsing errors and other errors
    if (error instanceof SyntaxError) { // From await request.json()
        return json({ valid: false, error: 'Invalid request format.' }, { status: 400 });
    }
    return json({
      valid: false,
      error: 'An unexpected error occurred during inventory check.'
    }, { status: 500 });
  }
}