import request from 'supertest';
import app from '../src/server';
import mongoose from 'mongoose';

describe("Products", () => {
    let restaurantId: string;
    let accessToken: string;
    const testEmail = `product_test_${Date.now()}@example.com`;

    beforeAll(async () => {
        // 1. Register a user with the 'restaurant' role
        await request(app).post("/v1/auth/register").send({
            name: "Product Test Owner",
            email: testEmail,
            password: "password123",
            role: "restaurant"
        });

        // 2. Login to get the access token
        const loginResponse = await request(app).post("/v1/auth/login").send({
            email: testEmail,
            password: "password123",
        });
        accessToken = loginResponse.body.accessToken;

        // 3. Get an existing restaurant's ID to use for the product
        const restaurant = await request(app).get("/v1/restaurants");
        restaurantId = restaurant.body[0]._id;
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it("Should add a product", async () => {
        const res = await request(app)
            .post("/v1/products/add-product")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "Test Product",
                description: "Test Description",
                price: 10,
                restaurant: restaurantId,
                category: "test",
                isAvailable: true
            });
        
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Product added");
    });
});