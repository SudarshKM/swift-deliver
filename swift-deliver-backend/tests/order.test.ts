import request from 'supertest';
import mongoose from "mongoose";
import app from '../src/server';

jest.setTimeout(30000);

describe("Create order", () => {
    let restaurantId: string;
    let productId: string;
    let accessToken: string;
    const testEmail = `order_test_${Date.now()}@example.com`;

    beforeAll(async () => {
       // 1. Register a dedicated test customer
       await request(app).post("/v1/auth/register").send({
           name: "Test Customer",
           email: testEmail,
           password: "password123",
           role: "customer"
       });

       // 2. Login to get the access token
       const response = await request(app).post("/v1/auth/login").send({
           email: testEmail,
           password: "password123",
       });
       accessToken = response.body.accessToken;

       // 3. Fetch an existing restaurant
       const restaurantRes = await request(app).get("/v1/restaurants").send();
       restaurantId = restaurantRes.body[0]._id;

       // 4. Fetch a product from that restaurant's menu
       const productRes = await request(app).get(`/v1/restaurants/${restaurantId}/menu`).send();
       productId = productRes.body[0]._id;
    });

    it("Should create order for a customer", async () => {
        const res = await request(app)
            .post("/v1/orders/create-order")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                restaurant: restaurantId,
                items: [
                    {
                        product: productId,
                        quantity: 1,
                        price: 100
                    }
                ],
                totalAmount: 100,
                status: "pending",
                deliveryAddress: "123 Test St"
            });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Order created");
        expect(res.body.order.totalAmount).toBe(100);
    });
});

describe("Update order status", () => {
    let customer1Token: string;
    let customer2Token: string;
    let restaurantToken: string;
    let deliveryToken: string;
    let restaurantId: string;
    let productId: string;
    let orderId: string;

    beforeAll(async () => {
        const timestamp = Date.now();
        
        // Register & login Customer 1
        const c1Email = `c1_${timestamp}@example.com`;
        await request(app).post("/v1/auth/register").send({
            name: "Customer One",
            email: c1Email,
            password: "password123",
            role: "customer"
        });
        const c1Login = await request(app).post("/v1/auth/login").send({
            email: c1Email,
            password: "password123"
        });
        customer1Token = c1Login.body.accessToken;

        // Register & login Customer 2
        const c2Email = `c2_${timestamp}@example.com`;
        await request(app).post("/v1/auth/register").send({
            name: "Customer Two",
            email: c2Email,
            password: "password123",
            role: "customer"
        });
        const c2Login = await request(app).post("/v1/auth/login").send({
            email: c2Email,
            password: "password123"
        });
        customer2Token = c2Login.body.accessToken;

        // Register & login Restaurant Owner
        const rEmail = `restaurant_${timestamp}@example.com`;
        await request(app).post("/v1/auth/register").send({
            name: "Restaurant Owner",
            email: rEmail,
            password: "password123",
            role: "restaurant"
        });
        const rLogin = await request(app).post("/v1/auth/login").send({
            email: rEmail,
            password: "password123"
        });
        restaurantToken = rLogin.body.accessToken;

        // Register & login Delivery Agent
        const dEmail = `delivery_${timestamp}@example.com`;
        await request(app).post("/v1/auth/register").send({
            name: "Delivery Agent",
            email: dEmail,
            password: "password123",
            role: "delivery"
        });
        const dLogin = await request(app).post("/v1/auth/login").send({
            email: dEmail,
            password: "password123"
        });
        deliveryToken = dLogin.body.accessToken;

        // Create a restaurant owned by Restaurant Owner
        const restCreate = await request(app)
            .post("/v1/restaurants")
            .set("Authorization", `Bearer ${restaurantToken}`)
            .send({
                name: "Status Test Restaurant",
                address: "123 Main St",
                cuisine: ["Fast Food"]
            });
        restaurantId = restCreate.body.restaurant._id;

        // Create a product for this restaurant
        const prodCreate = await request(app)
            .post("/v1/products/add-product")
            .set("Authorization", `Bearer ${restaurantToken}`)
            .send({
                name: "Test Burger",
                price: 15,
                restaurant: restaurantId,
                category: "Burgers"
            });
        productId = prodCreate.body.product._id;

        // Customer 1 creates an order
        const orderCreate = await request(app)
            .post("/v1/orders/create-order")
            .set("Authorization", `Bearer ${customer1Token}`)
            .send({
                restaurant: restaurantId,
                items: [{ product: productId, quantity: 2, price: 15 }],
                totalAmount: 30,
                status: "pending",
                deliveryAddress: "456 Customer Ave"
            });
        orderId = orderCreate.body.order._id;
    });

    it("should allow restaurant owner to update status to confirmed", async () => {
        const res = await request(app)
            .patch(`/v1/orders/${orderId}/status`)
            .set("Authorization", `Bearer ${restaurantToken}`)
            .send({ status: "confirmed" });

        expect(res.status).toBe(200);
        expect(res.body.order.status).toBe("confirmed");
    });

    it("should NOT allow delivery agent to update status to confirmed", async () => {
        const res = await request(app)
            .patch(`/v1/orders/${orderId}/status`)
            .set("Authorization", `Bearer ${deliveryToken}`)
            .send({ status: "confirmed" });

        expect(res.status).toBe(400);
    });

    it("should allow delivery agent to update status to picked_up", async () => {
        const res = await request(app)
            .patch(`/v1/orders/${orderId}/status`)
            .set("Authorization", `Bearer ${deliveryToken}`)
            .send({ status: "picked_up" });

        expect(res.status).toBe(200);
        expect(res.body.order.status).toBe("picked_up");
    });

    it("should NOT allow customer to update status to delivered", async () => {
        const res = await request(app)
            .patch(`/v1/orders/${orderId}/status`)
            .set("Authorization", `Bearer ${customer1Token}`)
            .send({ status: "delivered" });

        expect(res.status).toBe(403);
    });

    it("should NOT allow customer 2 to update/cancel customer 1's order", async () => {
        const res = await request(app)
            .patch(`/v1/orders/${orderId}/status`)
            .set("Authorization", `Bearer ${customer2Token}`)
            .send({ status: "cancelled" });

        expect(res.status).toBe(403);
    });

    it("should allow customer 1 to cancel a new pending order", async () => {
        const newOrderRes = await request(app)
            .post("/v1/orders/create-order")
            .set("Authorization", `Bearer ${customer1Token}`)
            .send({
                restaurant: restaurantId,
                items: [{ product: productId, quantity: 1, price: 15 }],
                totalAmount: 15,
                status: "pending",
                deliveryAddress: "456 Customer Ave"
            });
        const newOrderId = newOrderRes.body.order._id;

        const res = await request(app)
            .patch(`/v1/orders/${newOrderId}/status`)
            .set("Authorization", `Bearer ${customer1Token}`)
            .send({ status: "cancelled" });

        expect(res.status).toBe(200);
        expect(res.body.order.status).toBe("cancelled");
    });
});

afterAll(async () => {
    // Ensure connection is fully closed
    await mongoose.connection.close();
});