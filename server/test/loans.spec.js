import { expect } from 'chai';
import request from 'supertest';
import app from '../app';

describe('Welcome test', () => {
  it('should return a welcome message', (done) => {
    request(app)
      .get('/api/v1')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Welcome to quick-credit api');
        done();
      });
  });
});

describe('Invalid routes test', () => {
  it('should return a 404 error for non-existing routes', (done) => {
    request(app)
      .get('/api/v1/andela')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('Resource not found');
        done();
      });
  });
});

describe('POST create loan application', () => {
  it('should return a new loan application', (done) => {
    request(app)
      .post('/api/v1/loans')
      .send({
        user: 'santorini@gmail.com',
        tenor: '5',
        amount: '1500.00',
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('data');
        done();
      });
  });
  it('should return an error if user tries to request for more than one loan', (done) => {
    request(app)
      .post('/api/v1/loans')
      .send({
        user: 'santorini@gmail.com',
        tenor: '5',
        amount: '1500.00',
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('should return an error if user field is empty', (done) => {
    request(app)
      .post('/api/v1/loans')
      .send({
        user: '  ',
        tenor: '5',
        amount: '1500.00',
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return an error when passed empty tenor', (done) => {
    request(app)
      .post('/api/v1/loans')
      .send({
        user: 'max@gmail.com',
        tenor: '',
        amount: '1500.00',
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return an error when passed invalid tenor', (done) => {
    request(app)
      .post('/api/v1/loans')
      .send({
        user: 'max@gmail.com',
        tenor: '13',
        amount: '1500.00',
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return an error when passed empty amount', (done) => {
    request(app)
      .post('/api/v1/loans')
      .send({
        user: 'max@gmail.com',
        tenor: '3',
        amount: '',
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
});
