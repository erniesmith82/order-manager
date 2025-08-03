
export async function POST({ request }) {
  try {
    const data = await request.json();

    // You can log or process it here
    console.log("Received order:", data);

    // For now, we’ll just pretend we saved it somewhere
    return new Response(JSON.stringify({ message: 'Order received' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
