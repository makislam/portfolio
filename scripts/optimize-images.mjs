#!/usr/bin/env node
/**
 * Image Optimization Script
 * 
 * Compresses images, generates WebP versions, and creates thumbnails
 * for faster portfolio loading.
 * 
 * Usage: node scripts/optimize-images.mjs
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Configuration
const CONFIG = {
    // Max dimensions for full-size images
    fullMaxWidth: 1920,
    fullMaxHeight: 1440,
    // Thumbnail dimensions (for card/grid views)
    thumbMaxWidth: 600,
    thumbMaxHeight: 450,
    // Quality settings
    jpegQuality: 82,
    webpQuality: 78,
    pngQuality: 80, // for PNG compression level
    // Directories to process
    directories: ['projects', 'gallery', 'hero', 'logos'],
    // File extensions to process
    imageExtensions: ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'],
    // Skip files matching these patterns
    skipPatterns: ['thumb-'],
    // Directories that should get thumbnails
    thumbDirectories: ['projects', 'gallery'],
};

// Stats tracking
const stats = {
    processed: 0,
    skipped: 0,
    totalOriginalSize: 0,
    totalOptimizedSize: 0,
    errors: [],
};

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

function shouldSkip(filename) {
    return CONFIG.skipPatterns.some(p => filename.includes(p));
}

function isImageFile(filename) {
    const ext = path.extname(filename);
    return CONFIG.imageExtensions.includes(ext);
}

async function optimizeImage(filePath, dirName) {
    const filename = path.basename(filePath);
    const ext = path.extname(filename).toLowerCase();
    const nameWithoutExt = path.basename(filename, path.extname(filename));
    const dir = path.dirname(filePath);

    if (shouldSkip(filename) || !isImageFile(filename)) {
        stats.skipped++;
        return;
    }

    const originalSize = fs.statSync(filePath).size;
    stats.totalOriginalSize += originalSize;

    try {
        const image = sharp(filePath);
        const metadata = await image.metadata();

        // --- Generate optimized full-size image (overwrite original) ---
        let fullPipeline = sharp(filePath).rotate(); // auto-rotate based on EXIF

        // Resize if larger than max dimensions
        if (metadata.width > CONFIG.fullMaxWidth || metadata.height > CONFIG.fullMaxHeight) {
            fullPipeline = fullPipeline.resize(CONFIG.fullMaxWidth, CONFIG.fullMaxHeight, {
                fit: 'inside',
                withoutEnlargement: true,
            });
        }

        // Compress based on format
        if (ext === '.png') {
            fullPipeline = fullPipeline.png({ quality: CONFIG.pngQuality, compressionLevel: 8 });
        } else {
            fullPipeline = fullPipeline.jpeg({ quality: CONFIG.jpegQuality, mozjpeg: true });
        }

        const fullBuffer = await fullPipeline.toBuffer();
        fs.writeFileSync(filePath, fullBuffer);

        const optimizedSize = fullBuffer.length;
        stats.totalOptimizedSize += optimizedSize;

        // --- Generate WebP version ---
        const webpDir = path.join(dir, 'webp');
        if (!fs.existsSync(webpDir)) fs.mkdirSync(webpDir, { recursive: true });
        const webpPath = path.join(webpDir, `${nameWithoutExt}.webp`);
        await sharp(filePath)
            .rotate()
            .resize(CONFIG.fullMaxWidth, CONFIG.fullMaxHeight, {
                fit: 'inside',
                withoutEnlargement: true,
            })
            .webp({ quality: CONFIG.webpQuality })
            .toFile(webpPath);

        // --- Generate thumbnail (only for certain directories) ---
        if (CONFIG.thumbDirectories.includes(dirName)) {
            const thumbDir = path.join(dir, 'thumbs');
            if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });
            const thumbPath = path.join(thumbDir, `thumb-${nameWithoutExt}.webp`);
            await sharp(filePath)
                .rotate()
                .resize(CONFIG.thumbMaxWidth, CONFIG.thumbMaxHeight, {
                    fit: 'inside',
                    withoutEnlargement: true,
                })
                .webp({ quality: CONFIG.webpQuality })
                .toFile(thumbPath);
        }

        const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
        console.log(
            `  ✓ ${filename}: ${formatBytes(originalSize)} → ${formatBytes(optimizedSize)} (${savings}% smaller) + WebP${CONFIG.thumbDirectories.includes(dirName) ? ' + thumb' : ''}`
        );

        stats.processed++;
    } catch (err) {
        console.error(`  ✗ ${filename}: ${err.message}`);
        stats.errors.push({ file: filename, error: err.message });
    }
}

async function processDirectory(dirName) {
    const dirPath = path.join(PUBLIC_DIR, dirName);

    if (!fs.existsSync(dirPath)) {
        console.log(`⚠ Directory not found: ${dirPath}`);
        return;
    }

    console.log(`\n📁 Processing ${dirName}/`);
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);

        // Skip the webp/ and thumbs/ output subdirectories
        if (stat.isDirectory()) continue;

        if (stat.isFile() && isImageFile(file)) {
            await optimizeImage(filePath, dirName);
        }
    }
}

async function main() {
    console.log('🖼  Image Optimization Script');
    console.log('============================\n');

    for (const dir of CONFIG.directories) {
        await processDirectory(dir);
    }

    console.log('\n============================');
    console.log('📊 Summary:');
    console.log(`   Processed: ${stats.processed} images`);
    console.log(`   Skipped:   ${stats.skipped} files`);
    console.log(`   Original:  ${formatBytes(stats.totalOriginalSize)}`);
    console.log(`   Optimized: ${formatBytes(stats.totalOptimizedSize)}`);
    console.log(
        `   Savings:   ${formatBytes(stats.totalOriginalSize - stats.totalOptimizedSize)} (${(
            ((stats.totalOriginalSize - stats.totalOptimizedSize) / stats.totalOriginalSize) *
            100
        ).toFixed(1)}%)`
    );

    if (stats.errors.length > 0) {
        console.log(`\n⚠ Errors (${stats.errors.length}):`);
        stats.errors.forEach((e) => console.log(`   ${e.file}: ${e.error}`));
    }
}

main().catch(console.error);
