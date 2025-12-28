/**
 * Generate PWA icons from the existing logo.
 * Creates 192x192 and 512x512 PNG icons for PWA installation.
 */
const sharp = require('sharp');
const path = require('path');

async function generateIcons() {
  const logoPath = path.join(__dirname, '../public/logo.png');
  const outputDir = path.join(__dirname, '../public');

  console.log('Generating PWA icons...');

  try {
    // Generate 192x192 icon
    await sharp(logoPath)
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(outputDir, 'icon-192x192.png'));
    console.log('✓ Created icon-192x192.png');

    // Generate 512x512 icon
    await sharp(logoPath)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(outputDir, 'icon-512x512.png'));
    console.log('✓ Created icon-512x512.png');

    console.log('\nPWA icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
