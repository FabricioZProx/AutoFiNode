const request = require('supertest');
const app = require('../app');

describe('Post Endpoints', () => {
    it('Should store a one line file', async () => {
        const res = await request(app)
            .post('/PROVTWO/uploadCsv')
            .attach('inputCsv', './tests/test.csv');
        expect(res.statusCode).toEqual(200);
        //expect(res.body).toHaveProperty('post');
    });

});