import { fetchReview } from '..';

describe('Google Review API Unit Test', () => {
  it('should fetch the reviews', async () => {
    await fetchReview();
  });
});
