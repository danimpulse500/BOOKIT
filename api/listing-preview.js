import { readFile } from 'node:fs/promises';

const API_BASE = process.env.VITE_API_BASE_URL || 'https://api.bookit.it.com/api';
const CLOUDINARY_BASE = 'https://res.cloudinary.com/dx0faws91/';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function absoluteImageUrl(image, origin) {
  if (!image) return null;
  const value = String(image);
  const base = /^https?:\/\//i.test(value) ? origin : CLOUDINARY_BASE;
  return new URL(value, base).toString();
}

export default async function handler(request, response) {
  const listingId = String(request.query?.id || '');
  if (!/^\d+$/.test(listingId)) {
    response.status(400).send('A valid listing ID is required.');
    return;
  }

  try {
    const apiResponse = await fetch(`${API_BASE}/listings/${encodeURIComponent(listingId)}/`, {
      headers: { Accept: 'application/json' }
    });
    if (!apiResponse.ok) {
      response.status(apiResponse.status).send('Unable to load this lodge listing.');
      return;
    }

    const listing = await apiResponse.json();
    const host = request.headers.host;
    if (!host) throw new Error('Request host is missing.');
    const origin = new URL(`https://${host}`).origin;
    const canonicalUrl = `${origin}/details/${encodeURIComponent(listingId)}`;
    const title = listing.lodge_name || 'Student Lodge';
    const description = listing.description || 'View this student lodge on BookIt.';
    const image = absoluteImageUrl(
      listing.cover_image_url ||
      listing.images?.find(item => item.is_primary)?.image_url ||
      listing.images?.[0]?.image_url,
      origin
    );

    const metadata = [
      `<title>${escapeHtml(title)} | BookIt</title>`,
      `<meta name="description" content="${escapeHtml(description)}" />`,
      `<meta property="og:type" content="product" />`,
      `<meta property="og:title" content="${escapeHtml(title)}" />`,
      `<meta property="og:description" content="${escapeHtml(description)}" />`,
      `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
      `<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}" />`,
      `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
      `<meta name="twitter:description" content="${escapeHtml(description)}" />`
    ];

    if (image) {
      metadata.push(
        `<meta property="og:image" content="${escapeHtml(image)}" />`,
        `<meta property="og:image:alt" content="${escapeHtml(title)}" />`,
        `<meta name="twitter:image" content="${escapeHtml(image)}" />`
      );
    }

    if (listing.first_price) {
      metadata.push(
        `<meta property="product:price:amount" content="${escapeHtml(listing.first_price)}" />`,
        '<meta property="product:price:currency" content="NGN" />'
      );
    }

    const template = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
    const html = template
      .replace(/<title>[\s\S]*?<\/title>/i, '')
      .replace(/<meta\s+name=["']description["'][^>]*\/?>/i, '')
      .replace(/<meta\b(?=[^>]*(?:property|name)=["'](?:og:|twitter:|product:))[^>]*\/?>/gi, '')
      .replace('</head>', `${metadata.join('\n    ')}\n  </head>`);

    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    response.status(200).send(html);
  } catch (error) {
    console.error('Failed to render lodge share preview:', error);
    response.status(500).send('Unable to render this lodge preview.');
  }
}
