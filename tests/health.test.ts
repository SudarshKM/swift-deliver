import request from 'supertest';
import app from '../src/server'; // adjust import if needed

describe('Health Check', () => {
  it('should return healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  it('should return register open status', async () => {
    const res = await request(app).get('/register');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('registerOpen');
  });
  
  it('should register a new user', async() => {
    const res = await request(app).post('/v1/user/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      role: 'customer'
    });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User registered');
  });

  it('should user login', async() => {
    const res = await request(app).post('/v1/user/login').send({
      email: 'test@example.com',
      password: 'password'
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User logged in');
  });
});