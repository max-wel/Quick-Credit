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
