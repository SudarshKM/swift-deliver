import request from "supertest";
import app from "../src/server";

describe("Auth" , () => {
    it ("Should register a user", async ()=> {
        const res = await request(app).post("/v1/user/register").send({
            name: "Test User from jest",
            email: "testfromjest@example.com",
            password: "password",
            role: "customer"
        });
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("User registered");
    });
});