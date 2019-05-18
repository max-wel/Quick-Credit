import { expect } from 'chai';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import Users from '../models/users';
import app from '../app';

const validUser1 = {
  email: 'rigatoni@gmail.com',
  firstName: 'Memphis',
  lastName: 'Depay',
  password: 'Lyonnais',
  address: '21, Bode Thomas street, Amsterdam',
};
const validUser2 = {
  email: 'pasta@gmail.com',
  firstName: 'Chandler',
  lastName: 'Ross',
  password: 'blurryface',
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
      .send(validUser1)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('data');

        request(app)
          .post('/api/v1/auth/signup')
          .send(validUser2)
          .end((err1, res1) => {
            expect(res1.status).to.equal(201);
            expect(res1.body).to.have.property('data');
            done();
          });
      });
  });
  it('should return an error when user tries to signup with an existing email', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send(validUser1)
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
      .send(validUser1)
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
        email: 'invalidUser1@gmail.com',
        password: 'Lyonnais',
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Invalid login credentials');
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
        expect(res.body.error).to.equal('Invalid login credentials');
        done();
      });
  });
  it('should return an error when user tries to signin with an empty email', (done) => {
    request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: '',
        password: 'Lyonnais',
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Email is required');
        done();
      });
  });
  it('should return an error when user tries to signin with an empty password', (done) => {
    request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'memphis@gmail.com',
        password: '',
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Password is required');
        done();
      });
  });
});

describe('User forgot password test', () => {
  it('should send a password reset mail', (done) => {
    request(app)
      .post('/api/v1/auth/forgot_password')
      .send({
        email: 'maximusekeh@gmail.com',
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data.message).to.equal('Password reset mail sent');
        done();
      });
  });
  it('should return an error if email does not exist', (done) => {
    request(app)
      .post('/api/v1/auth/forgot_password')
      .send({
        email: 'non-existent@gmail.com',
      })
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('Email does not exist');
        done();
      });
  });
});

describe('User reset password test', () => {
  const user = Users[0];
  const validUser1ResetToken = jwt.sign({ email: user.email }, user.password, { expiresIn: '1h' });
  const invalidUser1ResetToken = jwt.sign({ email: 'non@gmail.com' }, user.password, { expiresIn: '1h' });
  const invalidToken = jwt.sign({ email: user.email }, 'fake-secret', { expiresIn: '1h' });

  it('should return an error when passed non-existing user', (done) => {
    request(app)
      .post(`/api/v1/auth/reset_password/${invalidUser1ResetToken}`)
      .send({
        password: 'new-pass',
        confirmPassword: 'new-pass',
      })
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('User not found');
        done();
      });
  });
  it('should return an error when passed invalid token', (done) => {
    request(app)
      .post(`/api/v1/auth/reset_password/${invalidToken}`)
      .send({
        password: 'new-pass',
        confirmPassword: 'new-pass',
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Expired reset link');
        done();
      });
  });
  it('should return an error when password is empty', (done) => {
    request(app)
      .post(`/api/v1/auth/reset_password/${validUser1ResetToken}`)
      .send({
        password: '',
        confirmPassword: 'new-pass',
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Password is required');
        done();
      });
  });
  it('should return an error when password is not equal to confirm-password', (done) => {
    request(app)
      .post(`/api/v1/auth/reset_password/${validUser1ResetToken}`)
      .send({
        password: 'new-pass',
        confirmPassword: 'not-new-pass',
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Password does not match');
        done();
      });
  });
  it('should reset user password', (done) => {
    request(app)
      .post(`/api/v1/auth/reset_password/${validUser1ResetToken}`)
      .send({
        password: 'new-pass',
        confirmPassword: 'new-pass',
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data.message).to.equal('Password reset successful');
        done();
      });
  });
  it('should return an error when valid token is used more than once', (done) => {
    request(app)
      .post(`/api/v1/auth/reset_password/${validUser1ResetToken}`)
      .send({
        password: 'new-pass',
        confirmPassword: 'new-pass',
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Expired reset link');
        done();
      });
  });
});
