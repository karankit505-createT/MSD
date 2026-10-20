const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = 'd:/MSD-main/MSD-main/public';
const OUT_DIR = 'd:/MSD-main/MSD-main/public/presidents';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function build1947() {
  // 1947 Founder Saragabani Gopu (1254 x 1254)
  // We want an 800 x 1200 image.
  // The original has:
  // - Top: "— 1947 — MAHA SEVA DAL", Saragabani Gopu head, quote on right
  // - Bottom: "FOUNDER SARAGABANI GOPU ... MAHA SEVA DAL NATIONAL PRESIDENT"
  // Let's create an 800 x 1200 canvas with seamless dark vintage backdrop,
  // matching the dark tone of 1947, and place the 1947 poster centered with elegant gradient borders.
  const src = sharp(path.join(PUBLIC_DIR, 'founder-saragabani-gopu-1947.jpg'));
  const meta = await src.metadata();

  // Resize src to width 800 (height will be 800 since 1:1)
  const resized = await sharp(path.join(PUBLIC_DIR, 'founder-saragabani-gopu-1947.jpg'))
    .resize(800, 800)
    .toBuffer();

  // Top color of 1947 is roughly #18141f, bottom is #350002
  const svg = `
    <svg width="800" height="1200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#14121d" />
          <stop offset="25%" stop-color="#18141f" />
          <stop offset="70%" stop-color="#350002" />
          <stop offset="100%" stop-color="#1f0001" />
        </linearGradient>
      </defs>
      <rect width="800" height="1200" fill="url(#bg)" />
      <!-- Subtle vintage frame accent lines -->
      <line x1="40" y1="30" x2="760" y2="30" stroke="#d4af37" stroke-width="1.5" stroke-opacity="0.4" />
      <line x1="40" y1="36" x2="760" y2="36" stroke="#d4af37" stroke-width="0.7" stroke-opacity="0.3" />
      <circle cx="400" cy="33" r="4" fill="#d4af37" fill-opacity="0.6" />
      
      <line x1="40" y1="1165" x2="760" y2="1165" stroke="#d4af37" stroke-width="0.7" stroke-opacity="0.3" />
      <line x1="40" y1="1171" x2="760" y2="1171" stroke="#d4af37" stroke-width="1.5" stroke-opacity="0.4" />
      <circle cx="400" cy="1168" r="4" fill="#d4af37" fill-opacity="0.6" />
    </svg>
  `;

  const bgBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  // Y position: 200 (so 200 to 1000 is the 800x800 image, 200px top, 200px bottom)
  await sharp(bgBuffer)
    .composite([
      { input: resized, top: 200, left: 0 }
    ])
    .jpeg({ quality: 95 })
    .toFile(path.join(OUT_DIR, 'president-1947.jpg'));

  console.log('Built president-1947.jpg (800x1200)');
}

async function build1949() {
  // 1949 Sharagabani Gopu (1145 x 1374)
  // Target 2:3 ratio: crop width = Math.round(1374 * 2 / 3) = 916.
  // Left: (1145 - 916) / 2 = 114.
  // This produces a full-bleed 800x1200 portrait showing the flag, temple, Sharagabani Gopu, and the plaque!
  await sharp(path.join(PUBLIC_DIR, 'founder-saragabani-gopu-portrait.jpg'))
    .extract({ left: 114, top: 0, width: 916, height: 1374 })
    .resize(800, 1200)
    .jpeg({ quality: 95 })
    .toFile(path.join(OUT_DIR, 'president-1949.jpg'));

  console.log('Built president-1949.jpg (800x1200)');
}

async function build1961() {
  // 1961 Narendra Singh (1024 x 1536)
  // Already exactly 2:3! Resize directly to 800x1200.
  await sharp(path.join(PUBLIC_DIR, 'president-narendra-singh-1961.jpg'))
    .resize(800, 1200)
    .jpeg({ quality: 95 })
    .toFile(path.join(OUT_DIR, 'president-1961.jpg'));

  console.log('Built president-1961.jpg (800x1200)');
}

async function build1986() {
  // 1986 M. H. Krishna Gowda (608 x 713)
  // Target 2:3: height = 713, width = Math.round(713 * 2 / 3) = 475.
  // Left: Math.round((608 - 475) / 2) = 66.
  // Fits face, glasses, saffron sash, Sun Om emblem flag, and name plaque!
  await sharp(path.join(PUBLIC_DIR, 'president-krishna-gowda-1986.jpg'))
    .extract({ left: 66, top: 0, width: 475, height: 713 })
    .resize(800, 1200)
    .jpeg({ quality: 95 })
    .toFile(path.join(OUT_DIR, 'president-1986.jpg'));

  console.log('Built president-1986.jpg (800x1200)');
}

async function build1997() {
  // 1997 National President (1402 x 1122)
  // Target 2:3: height = 1122, width = Math.round(1122 * 2 / 3) = 748.
  // Centered on President and the podium plaque at left = 320.
  await sharp(path.join(PUBLIC_DIR, 'president-1997.jpg'))
    .extract({ left: 320, top: 0, width: 748, height: 1122 })
    .resize(800, 1200)
    .jpeg({ quality: 95 })
    .toFile(path.join(OUT_DIR, 'president-1997.jpg'));

  console.log('Built president-1997.jpg (800x1200)');
}

async function main() {
  await build1947();
  await build1949();
  await build1961();
  await build1986();
  await build1997();
  console.log('All 5 presidents standardized to 800x1200 successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
