import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

const ffmpegPath = ffmpegInstaller.path;
const videoPath = path.resolve('public/media/tunnel.mp4');
const tempDir = path.resolve('temp_frames');
const desktopDir = path.resolve('public/frames');
const mobileDir = path.resolve('public/frames/mobile');

console.log('=== EXTRACTING COALGUARD TUNNEL FRAMES ===');
console.log('Video:', videoPath);
console.log('FFmpeg:', ffmpegPath);

if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
if (!fs.existsSync(desktopDir)) fs.mkdirSync(desktopDir, { recursive: true });
if (!fs.existsSync(mobileDir)) fs.mkdirSync(mobileDir, { recursive: true });

console.log('\n[1/3] Extracting raw frames via ffmpeg...');
const res = spawnSync(ffmpegPath, [
  '-i', videoPath,
  '-q:v', '2',
  path.join(tempDir, 'frame_%04d.jpg')
], { stdio: 'inherit' });

if (res.error) {
  console.error('FFmpeg extraction failed:', res.error);
  process.exit(1);
}

const files = fs.readdirSync(tempDir).filter(f => f.endsWith('.jpg')).sort();
console.log(`\n[2/3] Converting ${files.length} frames to WebP (Desktop 1920px & Mobile 960px)...`);

let completed = 0;
const BATCH_SIZE = 12;

async function processFile(file) {
  const inputPath = path.join(tempDir, file);
  const baseName = file.replace('.jpg', '.webp');
  const desktopPath = path.join(desktopDir, baseName);
  const mobilePath = path.join(mobileDir, baseName);

  // Desktop WebP (1920px width, quality 80)
  await sharp(inputPath)
    .resize(1920, 1080, { fit: 'cover' })
    .webp({ quality: 80, effort: 4 })
    .toFile(desktopPath);

  // Mobile WebP (960px width, quality 75)
  await sharp(inputPath)
    .resize(960, 540, { fit: 'cover' })
    .webp({ quality: 75, effort: 4 })
    .toFile(mobilePath);

  completed++;
  if (completed % 30 === 0 || completed === files.length) {
    process.stdout.write(`  Processed ${completed}/${files.length} frames (${Math.round(completed/files.length * 100)}%)\r`);
  }
}

async function run() {
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(processFile));
  }

  console.log('\n[3/3] Cleaning up temporary JPG files...');
  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log('Done! 240 WebP frames generated at public/frames/ and public/frames/mobile/');
}

run().catch(err => {
  console.error('Frame conversion error:', err);
  process.exit(1);
});
