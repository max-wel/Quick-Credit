import { expect } from 'chai';
import request from 'supertest';
import app from '../app';

const validUser = {
  email: 'memphis@gmail.com',
  firstName: 'Memphis',
  lastName: 'Depay',
  password: 'Lyonnais',
  address: '21, Bode Thomas street, Amsterdam',
};

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

describe('POST user signup', () => {
  it('should create a new user', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send(validUser)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('data');
        done();
      });
  });
  it('should return an error when user tries to signup with an existing email', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send(validUser)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return an error when user tries to signup with an empty email', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: '',
        firstName: 'Memphis',
        lastName: 'Depay',
        password: 'Lyonnais',
        address: '21, Bode Thomas street, Amsterdam',
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return an error when user tries to signup with an empty first name', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'sadio@gmail.com',
        firstName: '',
        lastName: 'Depay',
        password: 'Lyonnais',
        address: '21, Bode Thomas street, Amsterdam',
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return an error when user tries to signup with an empty last name', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'sadio@gmail.com',
        firstName: 'Memphis',
        lastName: '',
        password: 'Lyonnais',
        address: '21, Bode Thomas street, Amsterdam',
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return an error when user tries to signup with an empty password', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'sadio@gmail.com',
        firstName: 'Memphis',
        lastName: 'Depay',
        password: '',
        address: '21, Bode Thomas street, Amsterdam',
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return an error when user tries to signup with an empty address', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'sadio@gmail.com',
        firstName: 'Memphis',
        lastName: 'Depay',
        password: 'Lyonnais',
        address: '',
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
});

describe('POST user signin', () => {
  it('should signin user', (done) => {
    request(app)
      .post('/api/v1/auth/signin')
      .send(validUser)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('data');
        done();
      });
  });
  it('should return an error when user tries to signin with an invalid email', (done) => {
    request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'invaliduser@gmail.com',
        password: 'Lyonnais',
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return an error when user tries to signin with an invalid password', (done) => {
    request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'memphis@gmail.com',
        password: 'Lyonnais123',
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
});
