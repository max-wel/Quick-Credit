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
          tenor: '5',
          amount: '1500.00',
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
        .set('x-access-token', userToken)
        .send({
          tenor: '',
          amount: '1500.00',
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
        .set('x-access-token', userToken)
        .send({
          tenor: '13',
          amount: '1500.00',
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Invalid tenor');
          done();
        });
    });
    it('should return an error when passed empty amount', (done) => {
      request(app)
        .post('/api/v1/loans')
        .set('x-access-token', userToken)
        .send({
          tenor: '3',
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
        .set('x-access-token', userToken)
        .send({
          tenor: '3',
          amount: '150A.00',
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Invalid amount');
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

  describe('Admin GET specific loan', () => {
    it('should return a specific loan', (done) => {
      request(app)
        .get('/api/v1/loans/1')
        .set('x-access-token', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('data');
          done();
        });
    });
    it('should return an error when passed invalid loan-id', (done) => {
      request(app)
        .get('/api/v1/loans/20')
        .set('x-access-token', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('Admin approve/reject loan application', () => {
    it('should approve a loan application', (done) => {
      request(app)
        .patch('/api/v1/loans/1')
        .set('x-access-token', adminToken)
        .send({ status: 'approved' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data.status).to.equal('approved');
          done();
        });
    });
    it('should reject a loan application', (done) => {
      request(app)
        .patch('/api/v1/loans/1')
        .set('x-access-token', adminToken)
        .send({ status: 'rejected' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data.status).to.equal('rejected');
          done();
        });
    });
    it('should return an error when passed invalid loan-id parameter', (done) => {
      request(app)
        .patch('/api/v1/loans/90')
        .set('x-access-token', adminToken)
        .send({ status: 'approved' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });
    it('should return an error when status is neither approved/rejected', (done) => {
      request(app)
        .patch('/api/v1/loans/1')
        .set('x-access-token', adminToken)
        .send({ status: 'something-else' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('Admin POST loan repayment', () => {
    it('should create a loan repayment', (done) => {
      request(app)
        .post('/api/v1/loans/2/repayment')
        .set('x-access-token', adminToken)
        .send({ paidAmount: '400.00' })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('data');
          done();
        });
    });
    it('should return an error when passed invalid loan-id parameter', (done) => {
      request(app)
        .post('/api/v1/loans/90/repayment')
        .set('x-access-token', adminToken)
        .send({ paidAmount: '400.00' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Invalid id parameter');
          done();
        });
    });
    it('should return an error if loan is not approved', (done) => {
      request(app)
        .post('/api/v1/loans/1/repayment')
        .set('x-access-token', adminToken)
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
        .post('/api/v1/loans/5/repayment')
        .set('x-access-token', adminToken)
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
        .set('x-access-token', adminToken)
        .send({ paidAmount: '400A.00' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Invalid amount');
          done();
        });
    });
  });

  describe('User GET loan repayment history', () => {
    it('should return loan repayment history', (done) => {
      request(app)
        .get('/api/v1/loans/2/repayments')
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('data');
          done();
        });
    });
  });

  describe('Admin verify client', () => {
    it('should return a verified client', (done) => {
      request(app)
        .patch('/api/v1/users/memphis@gmail.com/verify')
        .set('x-access-token', adminToken)
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
        .set('x-access-token', adminToken)
        .send({ status: 'verified' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('error');
          done();
        });
    });
    it('should return an error when passed invalid status', (done) => {
      request(app)
        .patch('/api/v1/users/memphis@gmail.com/verify')
        .set('x-access-token', adminToken)
        .send({ status: 'qweerty' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });
});
