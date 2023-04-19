const request = require('supertest');
const app = require('../src/server/index');

describe('GET /', () => {
    it('should respond with index.html', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("<title>Sentiment Analysis</title>");
    });
});