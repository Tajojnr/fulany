// scripts/extract-frames.mjs
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const inputVideo = path.join(rootDir, "public", "hero.mp4");
const outputDir = path.join(rootDir, "public", "frames");

// Check video existence
if (!fs.existsSync(inputVideo)) {
  console.error("❌ Error: public/hero.mp4 was not found!");
  console.error("Please ensure hero.mp4 is saved inside your public/ folder.");
  process.exit(1);
}

// Create output frames directory if missing
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Check FFmpeg installation
try {
  execSync("ffmpeg -version", { stdio: "ignore" });
} catch (e) {
  console.error("❌ Error: FFmpeg is not installed or not added to system PATH.");
  console.error("On Windows, install it using winget:");
  console.error("  winget install ffmpeg");
  process.exit(1);
}

console.log("🎬 Extracting frames from public/hero.mp4 to WebP images...");

try {
  // Extract at 24fps, scaled to 1920x1080 canvas, WebP quality 75
  execSync(
    `ffmpeg -i "${inputVideo}" -vf "fps=24,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x0b0a09" -c:v libwebp -quality 75 "${outputDir}/frame-%04d.webp" -y`,
    { stdio: "inherit" }
  );

  const files = fs.readdirSync(outputDir).filter((f) => f.endsWith(".webp"));
  console.log(`\n✅ Done! Extracted ${files.length} frames into public/frames/`);
} catch (err) {
  console.error("❌ Extraction failed:", err.message);
}