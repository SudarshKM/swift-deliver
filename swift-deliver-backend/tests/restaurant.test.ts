import request from "supertest";
import app from "../src/server";
import mongoose from "mongoose";
import { UserRole } from "../src/types/types";

describe("Restaurant API", () => {
    let accessToken: string;
    const testEmail = `restaurant_test_${Date.now()}@example.com`;
    
    beforeAll(async () => {
        // 1. Register a user with the 'restaurant' role
        await request(app).post("/v1/auth/register").send({
            name: "Test Owner",
            email: testEmail,
            password: "password123",
            role: UserRole.RESTAURANT,
        });

        // 2. Login to get the access token
        const response = await request(app).post("/v1/auth/login").send({
            email: testEmail,
            password: "password123"
        });
        accessToken = response.body.accessToken;
    });

    afterAll(async () => {
        // Close the database connection to prevent Jest from hanging
        await mongoose.connection.close();
    });

    it("should create a restaurant successfully", async () => {
        const response = await request(app)
            .post("/v1/restaurants")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "Test Pizza Place",
                description: "Best pizza in town",
                address: "123 Test Ave",
                cuisine: ["Pizza", "Italian"]
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Restaurant created");
    });
});