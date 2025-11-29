const { Worker } = require('bullmq');
const ffmpeg = require('fluent-ffmpeg');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

// Create a worker to process video transcoding jobs
const worker = new Worker('videoTranscoding', async job => {
  const { videoId, filePath } = job.data;
  
  console.log(`Processing video ${videoId}...`);
  
  try {
    // Update video status to processing
    await prisma.lesson.update({
      where: { id: videoId },
      data: { 
        videoUrl: 'processing'
      }
    });
    
    // Define output directory (use shared volume path if provided)
    const baseStorage = process.env.STORAGE_PATH || path.join(__dirname, 'storage');
    const outputDir = path.join(baseStorage, videoId);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const segmentsDir = path.join(outputDir, 'segments');
    if (!fs.existsSync(segmentsDir)) {
      fs.mkdirSync(segmentsDir, { recursive: true });
    }
    
    // Generate encryption key
    const encryptionKey = require('crypto').randomBytes(16);
    const keyFilePath = path.join(outputDir, 'enc.key');
    fs.writeFileSync(keyFilePath, encryptionKey);
    
    // Create key info file for FFmpeg
    const keyInfoPath = path.join(outputDir, 'key_info.txt');
    const keyInfoContent = `https://api.windevexpert.online/api/videos/key/${videoId}\n${keyFilePath}`;
    fs.writeFileSync(keyInfoPath, keyInfoContent);
    
    // Define output paths
    const masterPlaylistPath = path.join(outputDir, 'master.m3u8');
    
    // Process video with FFmpeg
    await new Promise((resolve, reject) => {
      ffmpeg(filePath)
        .outputOptions([
          '-f', 'hls',
          '-hls_time', '10',
          '-hls_playlist_type', 'event',
          '-hls_key_info_file', keyInfoPath,
          '-hls_segment_filename', path.join(segmentsDir, 'segment_%03d.ts'),
          '-master_pl_name', 'master.m3u8',
          '-hls_base_url', `segments/`
        ])
        .output(masterPlaylistPath)
        .on('end', () => {
          console.log(`Video ${videoId} processed successfully`);
          resolve();
        })
        .on('error', (err) => {
          console.error(`Error processing video ${videoId}:`, err);
          reject(err);
        })
        .run();
    });
    
    // Save encryption key to database
    const keyBase64 = encryptionKey.toString('base64');
    
    // Create or update VideoKey record
    await prisma.videoKey.upsert({
      where: { lessonId: videoId },
      update: { key: keyBase64 },
      create: {
        lessonId: videoId,
        key: keyBase64
      }
    });
    
    // Update lesson with video URL
    await prisma.lesson.update({
      where: { id: videoId },
      data: {
        videoUrl: `/storage/${videoId}/master.m3u8`
      }
    });
    
    console.log(`Video ${videoId} processing completed`);
    return { status: 'completed', videoId };
  } catch (error) {
    console.error(`Failed to process video ${videoId}:`, error);
    
    // Update video status to failed
    await prisma.lesson.update({
      where: { id: videoId },
      data: { 
        videoUrl: 'failed'
      }
    });
    
    throw error;
  }
}, {
  connection: (() => {
    try {
      const url = new URL(process.env.REDIS_URL || 'redis://localhost:6379');
      return { host: url.hostname, port: Number(url.port) || 6379 };
    } catch {
      return { host: process.env.REDIS_HOST || 'localhost', port: Number(process.env.REDIS_PORT) || 6379 };
    }
  })()
});

console.log('Video transcoding worker started...');

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down worker...');
  await worker.close();
  await prisma.$disconnect();
  process.exit(0);
});
