import { expect } from 'chai';
import request from 'supertest';
import app from '../app';
import pool from '../db/config';

const user1 = {
  email: 'rigatoni@gmail.com',
  password: 'new-pass',
};
const user2 = {
  email: 'pasta@gmail.com',
  password: 'blurryface',
};
const admin = {
  email: 'sneaky@gmail.com',
  password: 'admin',
};

describe('Loan Tests', () => {
  // login and get valid token. Make sure user1s.spec is called first to create user1
  let userToken1;
  let userToken2;
  let adminToken;
  before((done) => {
    request(app)
      .post('/api/v1/auth/signin')
      .send(user1)
      .end((err1, res1) => {
        userToken1 = `Bearer ${res1.body.data.token}`;
        expect(res1.status).to.equal(200);
        expect(res1.body).to.have.property('data');

        request(app)
          .post('/api/v1/auth/signin')
          .send(user2)
          .end((err2, res2) => {
            userToken2 = `Bearer ${res2.body.data.token}`;
            expect(res2.status).to.equal(200);
            expect(res2.body).to.have.property('data');

            request(app)
              .post('/api/v1/auth/signin')
              .send(admin)
              .end((adminErr, adminRes) => {
                adminToken = `Bearer ${adminRes.body.data.token}`;
                expect(adminRes.status).to.equal(200);
                expect(adminRes.body).to.have.property('data');
                done();
              });
          });
      });
  });

  after((done) => {
    pool.query('TRUNCATE users RESTART IDENTITY CASCADE', (err, res) => {
      console.log(err, res);
      done();
    });
  });

  describe('Invalid token test', () => {
    it('should return an error when no token is supplied', (done) => {
      request(app)
        .get('/api/v1/loans')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('No token found');
          done();
        });
    });
    it('should return an error when an invalid token is supplied', (done) => {
      request(app)
        .get('/api/v1/loans')
        .set('Authorization', 'jdkjalkdld.dkjakdkfa')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Invalid token');
          done();
        });
    });
  });

  describe('POST create loan application', () => {
    it('should return a new loan application', (done) => {
      request(app)
        .post('/api/v1/loans')
        .set('Authorization', userToken1)
        .send({
          tenor: 5,
          amount: 1500.00,
        })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('data');

          request(app)
            .post('/api/v1/loans')
            .set('Authorization', userToken2)
            .send({
              tenor: 5,
              amount: 1500.00,
            })
            .end((err1, res1) => {
              expect(res1.status).to.equal(201);
              expect(res1.body).to.have.property('data');
              done();
            });
        });
    });
    it('should return an error if user1 tries to request for more than one loan', (done) => {
      request(app)
        .post('/api/v1/loans')
        .set('Authorization', userToken1)
        .send({
          tenor: 5,
          amount: 1500.00,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('You have an unsettled loan');
          done();
        });
    });
    it('should return an error when passed empty tenor', (done) => {
      request(app)
        .post('/api/v1/loans')
        .set('Authorization', userToken1)
        .send({
          tenor: '',
          amount: 1500.00,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Tenor is required');
          done();
        });
    });
    it('should return an error when passed invalid tenor', (done) => {
      request(app)
        .post('/api/v1/loans')
        .set('Authorization', userToken1)
        .send({
          tenor: 13,
          amount: 1500.00,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Tenor should be between 1 to 12 months');
          done();
        });
    });
    it('should return an error when passed empty amount', (done) => {
      request(app)
        .post('/api/v1/loans')
        .set('Authorization', userToken1)
        .send({
          tenor: 3,
          amount: '',
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Amount is required');
          done();
        });
    });
    it('should return an error when passed invalid amount', (done) => {
      request(app)
        .post('/api/v1/loans')
        .set('Authorization', userToken1)
        .send({
          tenor: 3,
          amount: '150A.00',
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Invalid amount format');
          done();
        });
    });
  });

  describe('Admin GET all loans', () => {
    it('should return all loans', (done) => {
      request(app)
        .get('/api/v1/loans')
        .set('Authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('data');
          done();
        });
    });
    it('should return an error when non-admin tries to get all loans', (done) => {
      request(app)
        .get('/api/v1/loans')
        .set('Authorization', userToken1)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('You do not have access to this resource');
          done();
        });
    });
  });

  describe('Admin GET all current loans', () => {
    it('should return all current loans', (done) => {
      request(app)
        .get('/api/v1/loans/?status=approved&repaid=false')
        .set('Authorization', adminToken)
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
        .set('Authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('data');
          done();
        });
    });
  });

  describe('Admin GET specific loan', () => {
    it('should return a specific loan', (done) => {
      request(app)
        .get('/api/v1/loans/1')
        .set('Authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('data');
          done();
        });
    });
    it('should return an error when passed invalid loan-id', (done) => {
      request(app)
        .get('/api/v1/loans/20')
        .set('Authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('No loan found');
          done();
        });
    });
  });

  describe('Admin verify client', () => {
    it('should return a verified client', (done) => {
      request(app)
        .patch('/api/v1/users/rigatoni@gmail.com/verify')
        .set('Authorization', adminToken)
        .send({ status: 'verified' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('data');
          done();
        });
    });
    it('should return an error when passed invalid email', (done) => {
      request(app)
        .patch('/api/v1/users/qwerty@gmail.com/verify')
        .set('Authorization', adminToken)
        .send({ status: 'verified' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Client does not exist');
          done();
        });
    });
    it('should return an error when passed invalid status', (done) => {
      request(app)
        .patch('/api/v1/users/rigatoni@gmail.com/verify')
        .set('Authorization', adminToken)
        .send({ status: 'qweerty' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Invalid status');
          done();
        });
    });
  });

  describe('Admin approve/reject loan application', () => {
    it('should reject a loan application', (done) => {
      request(app)
        .patch('/api/v1/loans/1')
        .set('Authorization', adminToken)
        .send({ status: 'rejected' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data.status).to.equal('rejected');
          done();
        });
    });
    it('should approve a loan application', (done) => {
      request(app)
        .patch('/api/v1/loans/1')
        .set('Authorization', adminToken)
        .send({ status: 'approved' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data.status).to.equal('approved');
          done();
        });
    });
    it('should return an error when passed invalid loan-id parameter', (done) => {
      request(app)
        .patch('/api/v1/loans/90')
        .set('Authorization', adminToken)
        .send({ status: 'approved' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Loan does not exist');
          done();
        });
    });
    it('should return an error when status is neither approved/rejected', (done) => {
      request(app)
        .patch('/api/v1/loans/1')
        .set('Authorization', adminToken)
        .send({ status: 'something-else' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Invalid status');
          done();
        });
    });
  });

  describe('Admin POST loan repayment', () => {
    it('should create a loan repayment', (done) => {
      request(app)
        .post('/api/v1/loans/1/repayment')
        .set('Authorization', adminToken)
        .send({ paidAmount: 1575.00 })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('data');
          done();
        });
    });
    it('should return an error when passed invalid loan-id parameter', (done) => {
      request(app)
        .post('/api/v1/loans/90/repayment')
        .set('Authorization', adminToken)
        .send({ paidAmount: 400.00 })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Loan does not exist');
          done();
        });
    });
    it('should return an error if loan is not approved', (done) => {
      request(app)
        .post('/api/v1/loans/2/repayment')
        .set('Authorization', adminToken)
        .send({ paidAmount: '400.00' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Loan is not approved');
          done();
        });
    });
    it('should return an error if loan has been repaid', (done) => {
      request(app)
        .post('/api/v1/loans/1/repayment')
        .set('Authorization', adminToken)
        .send({ paidAmount: '400.00' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Loan already repaid');
          done();
        });
    });
    it('should return an error when passed an invalid repay amount', (done) => {
      request(app)
        .post('/api/v1/loans/2/repayment')
        .set('Authorization', adminToken)
        .send({ paidAmount: '400A.00' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Invalid amount format');
          done();
        });
    });
  });

  describe('user GET loan repayment history', () => {
    it('should return loan repayment history', (done) => {
      request(app)
        .get('/api/v1/loans/1/repayments')
        .set('Authorization', userToken1)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('data');
          done();
        });
    });
    it('should return an error when passed invalid loan id', (done) => {
      request(app)
        .get('/api/v1/loans/70/repayments')
        .set('Authorization', userToken1)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Loan does not exist');
          done();
        });
    });
    it('should return an error if loan does not belong to user1', (done) => {
      request(app)
        .get('/api/v1/loans/1/repayments')
        .set('Authorization', userToken2)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Loan does not belong to you');
          done();
        });
    });
  });

  describe('Admin get all users', () => {
    it('should return all users', (done) => {
      request(app)
        .get('/api/v1/users')
        .set('Authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('data');
          done();
        });
    });
    it('should return an error when non-admin tries to get all users', (done) => {
      request(app)
        .get('/api/v1/users')
        .set('Authorization', userToken1)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('You do not have access to this resource');
          done();
        });
    });
  });

  describe('User get loan', () => {
    it('should return all user loans', (done) => {
      request(app)
        .get('/api/v1/user/loans')
        .set('Authorization', userToken1)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('data');
          done();
        });
    });
  });
});
