import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT_DIR = process.cwd();
const FOTOS_DIR = path.join(ROOT_DIR, 'Fotos');
const PORTFOLIO_SRC = path.join(FOTOS_DIR, 'portfolio');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public', 'images');
const PUBLIC_PORTFOLIO = path.join(PUBLIC_DIR, 'portfolio');
const DATA_DIR = path.join(ROOT_DIR, 'src', 'data');

// Ensure output dirs exist
fs.mkdirSync(PUBLIC_PORTFOLIO, { recursive: true });
fs.mkdirSync(DATA_DIR, { recursive: true });

async function optimizeHeroImages() {
  console.log('Optimizing main key images...');

  // 1. Capa / Perfil Cristina
  const capaMeta = await sharp(path.join(FOTOS_DIR, 'foto-capa.jpg'))
    .webp({ quality: 86 })
    .toFile(path.join(PUBLIC_DIR, 'cristina-perfil.webp'));
  console.log('✔ cristina-perfil.webp created:', capaMeta.width, 'x', capaMeta.height);

  // 2. Estúdio
  const estudioMeta = await sharp(path.join(FOTOS_DIR, 'estudio.jpg'))
    .webp({ quality: 86 })
    .toFile(path.join(PUBLIC_DIR, 'estudio-fachada.webp'));
  console.log('✔ estudio-fachada.webp created:', estudioMeta.width, 'x', estudioMeta.height);

  // 3. Poesia / Frase (Menina na chuva P&B)
  const fraseMeta = await sharp(path.join(FOTOS_DIR, 'frase.jpeg'))
    .webp({ quality: 86 })
    .toFile(path.join(PUBLIC_DIR, 'poesia-chuva.webp'));
  console.log('✔ poesia-chuva.webp created:', fraseMeta.width, 'x', fraseMeta.height);
}

async function optimizePortfolio() {
  console.log('Optimizing portfolio items...');
  const files = fs.readdirSync(PORTFOLIO_SRC).filter(f => f.toLowerCase().endsWith('.jpeg') || f.toLowerCase().endsWith('.jpg'));

  // Natural sort for files
  files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  const portfolioItems = [];

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const srcFile = path.join(PORTFOLIO_SRC, filename);
    const index = String(i + 1).padStart(2, '0');
    const outFull = path.join(PUBLIC_PORTFOLIO, `foto-${index}.webp`);
    const outThumb = path.join(PUBLIC_PORTFOLIO, `foto-${index}-thumb.webp`);

    // Full high-res for lightbox
    const image = sharp(srcFile);
    const meta = await image.metadata();

    // Scale to max 1600px width/height while keeping aspect ratio
    const fullBuffer = await image
      .resize({
        width: meta.width > meta.height ? 1600 : undefined,
        height: meta.height >= meta.width ? 1600 : undefined,
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 85 })
      .toFile(outFull);

    // Optimized thumbnail for carousel / preview
    const thumbBuffer = await sharp(srcFile)
      .resize({
        width: meta.width > meta.height ? 800 : undefined,
        height: meta.height >= meta.width ? 900 : undefined,
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toFile(outThumb);

    portfolioItems.push({
      id: `foto-${index}`,
      fullSrc: `/images/portfolio/foto-${index}.webp`,
      thumbSrc: `/images/portfolio/foto-${index}-thumb.webp`,
      width: fullBuffer.width,
      height: fullBuffer.height,
      aspectRatio: fullBuffer.width / fullBuffer.height,
      alt: `Fotografia profissional por Cristina Ferreira - Registro ${index}`
    });

    console.log(`✔ foto-${index}.webp (${fullBuffer.width}x${fullBuffer.height})`);
  }

  // Write metadata file
  const tsContent = `// Generated automatically by scripts/optimize-images.js
export interface PhotoItem {
  id: string;
  fullSrc: string;
  thumbSrc: string;
  width: number;
  height: number;
  aspectRatio: number;
  alt: string;
}

export const portfolioPhotos: PhotoItem[] = ${JSON.stringify(portfolioItems, null, 2)};
`;

  fs.writeFileSync(path.join(DATA_DIR, 'photos.ts'), tsContent, 'utf-8');
  console.log(`\n✔ Generated src/data/photos.ts with ${portfolioItems.length} photos!`);
}

async function run() {
  try {
    await optimizeHeroImages();
    await optimizePortfolio();
    console.log('\n🎉 Image optimization finished successfully!');
  } catch (err) {
    console.error('Error optimizing images:', err);
    process.exit(1);
  }
}

run();
