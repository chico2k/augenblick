import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const getImageUrls = async (): Promise<string[]> => {
  const imageUrls: string[] = [];
  const publicDir = path.join(__dirname, '../', 'public');

  const data = await fs.promises.readdir(publicDir, 'utf8');

  data.map((file) => {
    const filePath = publicDir + '/' + file;

    const isDirecotry =
      fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory();

    if (!isDirecotry) imageUrls.push(filePath);
  });

  return imageUrls;
};

export const createBlur = async () => {
  const imageUrls = await getImageUrls();
  const imagePath = imageUrls[1];

  const sharpImg = sharp(imagePath);
  const meta = await sharpImg.metadata();
  const placeholderImgWidth = 20;

  const imgAspectRatio = meta.width! / meta.height!;

  const placeholderImgHeight = Math.round(placeholderImgWidth / imgAspectRatio);

  const imgBase64 = await sharpImg
    .resize(placeholderImgWidth, placeholderImgHeight)
    .toBuffer()
    .then(
      (buffer) =>
        `data:image/${meta.format};base64,${buffer.toString('base64')}`
    );

  console.log('imgBase64', imgBase64);

  return {
    fileName: path.basename(imagePath),
    // Strip public prefix, /public is / in Nextjs runtime environment
    relativePath: path
      .relative(process.cwd(), imagePath)
      .substring('public'.length),
    width: meta.width,
    height: meta.height,
    imgBase64,
  };
};
