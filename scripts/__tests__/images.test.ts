import { createBlur, getImageUrls } from '../image';

describe('Image Blur Handler', () => {
  it('should get the public folder', async () => {
    const test = await createBlur();

    console.log('test', test);
  });
});
