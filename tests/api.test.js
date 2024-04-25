const request = require('supertest');
const app = require('../backend/server');
let server;

beforeAll((done) => {
    server = app.listen(5000, () => {
        console.log('Test server running on port 5000');
        done();
    });
});

afterAll((done) => {
    server.close(() => {
        console.log('Test server closed');
        done();
    });
});

describe('API Tests', () => {
    it('GET /contacts - should return all contacts', async () => {
            const response = await request(server).get('/contacts');
            expect(response.statusCode).toBe(200 || 201 || undefined);
            expect(response.body).toBeInstanceOf(Array);
            response.body.forEach(contact => {
                expect(contact).toHaveProperty('name');
                expect(contact).toHaveProperty('email');
                expect(contact).toHaveProperty('phone');
            });
    });

    it('POST /contacts - should create a new contact', async () => {
        const newContact = {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890'
        };

        const response = await request(server).post('/contacts').send(newContact);
        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject(newContact);
    });

    it('POST a contact with a missing name - should return an error message', async () => {
        const newContact = {
            name: '',
            email: 'john@example.com',
            phone: '1234567890'
        };

        const response = await request(server).post('/contacts').send(newContact);
        expect(response.statusCode).toBe(400);

        const errorMessage = {
            "message": "All fields are required"
        }
        expect(response.body).toMatchObject(errorMessage);
    });

    it('POST a contact with a missing email - should return an error message', async () => {
        const newContact = {
            name: 'John Doe',
            email: '',
            phone: '1234567890'
        };

        const response = await request(server).post('/contacts').send(newContact);
        expect(response.statusCode).toBe(400);

        const errorMessage = {
            "message": "All fields are required"
        }
        expect(response.body).toMatchObject(errorMessage);
    });

    it('POST a contact with a missing phone number - should return an error message', async () => {
        const newContact = {
            name: 'John Doe',
            email: 'john@example.com',
            phone: ''
        };

        const response = await request(server).post('/contacts').send(newContact);
        expect(response.statusCode).toBe(400);

        const errorMessage = {
            "message": "All fields are required"
        }
        expect(response.body).toMatchObject(errorMessage);
    });
});