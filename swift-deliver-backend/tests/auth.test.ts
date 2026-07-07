import request from "supertest";
import app from "../src/server";

describe("Auth" , () => {

    it('should return register open status', async () => {
      const res = await request(app).get('/register');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('registerOpen');
    });

    // it("Should register a user", async () => {
    //   const res = await request(app).post("/v1/auth/register").send({
    //     name: "Test User from jest",
    //     email: "testfromjest@example.com",
    //         password: "password",
    //         role: "customer"
    //     });
    //     expect(res.status).toBe(201);
    //     expect(res.body.message).toBe("User registered");
    // });

        it ("Should login a user", async ()=> {
        const res = await request(app).post("/v1/auth/login").send({
            email: "testfromjest@example.com",
            password: "password",
        });
        expect(res.status).toBe(201);
        expect(res.body.accessToken).toBeDefined();
        // expect(res.headers['set-cookie']).toContain('refreshToken=');
        // expect(res.headers['set-cookie']).toContain('httpOnly');
        // expect(res.headers['set-cookie']).toContain('secure');
        // expect(res.headers['set-cookie']).toContain('sameSite=strict');
    });
});