import request from 'supertest';
import { createServer } from '../../app.js';

describe('appInstance (E2E)', () => {
  it('GET /', () => {
    return request(createServer())
      .get('/')
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({ message: expect.any(String) })
        );
      });
  });
});
