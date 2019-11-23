const { request } = require('../common');

describe('Application start', () => {
  it('application should start and respond on with status 200', async () => {
    await request.get('/api').expect(200);
  });
  it('application should respond with 404 on wrong routes', async () => {
    await request.get('/blahblah').expect(404);
  });
});
