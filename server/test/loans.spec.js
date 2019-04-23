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
