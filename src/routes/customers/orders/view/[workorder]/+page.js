// src/routes/customers/orders/view/[workorder]/+page.js
export async function load({ params, fetch }) {
  // fix fetch path
const res = await fetch(`/api/get-orders/${params.workorder}`);


  if (res.ok) {
    const { order } = await res.json();
    return { order };
  }

  return {
    status: 404,
    error: new Error('Order not found')
  };
}
