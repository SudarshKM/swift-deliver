import request from 'supertest';
import mongoose from "mongoose";
import app from '../src/server';

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

    afterAll(async () => {
        // Ensure connection is fully closed
        await mongoose.connection.close();
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