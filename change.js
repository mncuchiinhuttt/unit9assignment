import fs from 'fs';
import sharp from 'sharp';

// PNG files to process
const pngFiles = [
  '32x32.png',
  '128x128.png',
  '128x128@2x.png',
  'icon.ico',
  'icon.icns'
];

// Convert each PNG file from RGB to RGBA
async function convertToRGBA() {
  for (const file of pngFiles) {
    try {
      const image = sharp(file);
      await image
        .ensureAlpha() // Add alpha channel if not present
        .toFormat('png')
        .toFile(`converted_${file}`);
      
      // Replace original with converted file
      fs.renameSync(`converted_${file}`, file);
      
      console.log(`Successfully converted ${file} to RGBA`);
    } catch (err) {
      console.error(`Error converting ${file}:`, err);
    }
  }
}

convertToRGBA();
