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
});