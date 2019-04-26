import { expect } from 'chai';
import request from 'supertest';
import app from '../app';

const user = {
  email: 'memphis@gmail.com',
  password: 'Lyonnais',
};
const admin = {
  email: 'sneaky@gmail.com',
  password: 'admin',
};

describe('Loan Tests', () => {
  // login and get valid token. Make sure users.spec is called first to create user
  let userToken;
  let adminToken;
  before((done) => {
    request(app)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        userToken = res.body.data.token;
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('data');

        request(app)
          .post('/api/v1/auth/signin')
          .send(admin)
          .end((adminErr, adminRes) => {
            adminToken = adminRes.body.data.token;
            expect(adminRes.status).to.equal(200);
            expect(adminRes.body).to.have.property('data');
            done();
          });
      });
  });

  describe('Invalid token test', () => {
    it('should return an error when no token is supplied', (done) => {
      request(app)
        .get('/api/v1/loans')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });
    it('should return an error when an invalid token is supplied', (done) => {
      request(app)
        .get('/api/v1/loans')
        .set('x-access-token', 'jdkjalkdld.dkjakdkfa')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('POST create loan application', () => {
    it('should return a new loan application', (done) => {
      request(app)
        .post('/api/v1/loans')
        .set('x-access-token', userToken)
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
        .set('x-access-token', userToken)
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
        .set('x-access-token', userToken)
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
        .set('x-access-token', userToken)
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
        .set('x-access-token', userToken)
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
        .set('x-access-token', userToken)
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

  describe('Admin GET all loans', () => {
    it('should return all loans', (done) => {
      request(app)
        .get('/api/v1/loans')
        .set('x-access-token', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('data');
          done();
        });
    });
    it('should return an error when non-admin tries to get all loans', (done) => {
      request(app)
        .get('/api/v1/loans')
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('Admin GET all current loans', () => {
    it('should return all current loans', (done) => {
      request(app)
        .get('/api/v1/loans/?status=approved&repaid=false')
        .set('x-access-token', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('data');
          done();
        });
    });
  });
  describe('Admin GET all repaid loans', () => {
    it('should return all repaid loans', (done) => {
      request(app)
        .get('/api/v1/loans/?status=approved&repaid=true')
        .set('x-access-token', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('data');
          done();
        });
    });
  });
});
