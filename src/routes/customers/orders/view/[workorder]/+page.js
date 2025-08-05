// In +page.js of the view route
export async function load({ params, fetch }) {
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
