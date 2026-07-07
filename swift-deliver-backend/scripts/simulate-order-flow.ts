const API_URL = "http://localhost:5005/v1";

async function simulate() {
  console.log("Starting simulation...");
  const timestamp = Date.now();

  // 1. Register customer
  const custEmail = `cust_${timestamp}@example.com`;
  console.log(`Registering customer: ${custEmail}`);
  const r1 = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Simulated Customer",
      email: custEmail,
      password: "password123",
      role: "customer"
    })
  });
  const r1Json = await r1.json() as any;

  // 2. Login customer
  const l1 = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: custEmail, password: "password123" })
  });
  const l1Json = await l1.json() as any;
  const customerToken = l1Json.accessToken;

  // 3. Register restaurant owner
  const restEmail = `rest_${timestamp}@example.com`;
  console.log(`Registering restaurant owner: ${restEmail}`);
  await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Simulated Owner",
      email: restEmail,
      password: "password123",
      role: "restaurant"
    })
  });

  // 4. Login restaurant owner
  const l2 = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: restEmail, password: "password123" })
  });
  const l2Json = await l2.json() as any;
  const restaurantToken = l2Json.accessToken;

  // 5. Create restaurant
  console.log("Creating restaurant...");
  const restCreate = await fetch(`${API_URL}/restaurants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${restaurantToken}`
    },
    body: JSON.stringify({
      name: "Simulation Diner",
      address: "789 Simulator St",
      cuisine: ["Fast Food"]
    })
  });
  const restCreateJson = await restCreate.json() as any;
  const restaurantId = restCreateJson.restaurant._id;

  // 6. Create product
  const prodCreate = await fetch(`${API_URL}/products/add-product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${restaurantToken}`
    },
    body: JSON.stringify({
      name: "Simulated Pizza",
      price: 12,
      restaurant: restaurantId,
      category: "Pizzas"
    })
  });
  const prodCreateJson = await prodCreate.json() as any;
  const productId = prodCreateJson.product._id;

  // 7. Create order (by customer)
  console.log("Placing order...");
  const orderCreate = await fetch(`${API_URL}/orders/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${customerToken}`
    },
    body: JSON.stringify({
      restaurant: restaurantId,
      items: [{ product: productId, quantity: 1, price: 12 }],
      totalAmount: 12,
      status: "pending",
      deliveryAddress: "123 Main St",
      customerEmail: custEmail
    })
  });
  const orderCreateJson = await orderCreate.json() as any;
  const orderId = orderCreateJson.order._id;

  console.log("\n==============================================");
  console.log(`ORDER CREATED SUCCESSFULLY!`);
  console.log(`Order ID: ${orderId}`);
  console.log(`---> Copy and paste this Order ID in the browser to track: ${orderId}`);
  console.log("==============================================\n");

  console.log("Waiting 15 seconds for you to paste the Order ID in the browser and start tracking...");
  await new Promise((resolve) => setTimeout(resolve, 15000));

  // 8. Start status simulation transitions
  const transitions = ["confirmed", "preparing", "ready", "picked_up", "delivered"];
  
  // Register & login delivery agent for delivery steps
  const delivEmail = `deliv_${timestamp}@example.com`;
  await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Simulated Driver",
      email: delivEmail,
      password: "password123",
      role: "delivery"
    })
  });
  const l3 = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: delivEmail, password: "password123" })
  });
  const l3Json = await l3.json() as any;
  const deliveryToken = l3Json.accessToken;

  for (const status of transitions) {
    console.log(`Transitioning status to: ${status}...`);
    let token = restaurantToken;
    if (["picked_up", "delivered"].includes(status)) {
      token = deliveryToken;
    }

    const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    const resJson = await res.json() as any;
    console.log(`Server responded: ${res.status} -`, resJson.message || resJson);

    await new Promise((resolve) => setTimeout(resolve, 4000));
  }

  console.log("Simulation complete!");
}

simulate().catch(console.error);
