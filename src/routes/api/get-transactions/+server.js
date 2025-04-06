import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function GET() {
  try {
    const response = await fetch('https://connect.squareupsandbox.com/v2/payments', {
      method: 'GET',
      headers: {
        'Square-Version': '2023-09-25',
        'Authorization': `Bearer ${env.SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('Transactions:', data);
    
    return json(data);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return json({ error: error.message }, { status: 500 });
  }
}