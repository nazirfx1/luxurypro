import { supabase } from "@/integrations/supabase/client";

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = async (): Promise<string> => {
  const baseUrl = 'https://luxurypro.org';
  const urls: SitemapUrl[] = [];

  // Static pages
  urls.push({
    loc: `${baseUrl}/`,
    lastmod: new Date().toISOString(),
    changefreq: 'daily',
    priority: 1.0,
  });

  urls.push({
    loc: `${baseUrl}/properties`,
    lastmod: new Date().toISOString(),
    changefreq: 'hourly',
    priority: 0.9,
  });

  urls.push({
    loc: `${baseUrl}/auth`,
    lastmod: new Date().toISOString(),
    changefreq: 'monthly',
    priority: 0.5,
  });

  // Fetch all active properties
  try {
    const { data: properties, error } = await supabase
      .from('properties')
      .select('id, updated_at, status')
      .eq('status', 'active')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching properties for sitemap:', error);
    }

    if (properties) {
      properties.forEach((property) => {
        urls.push({
          loc: `${baseUrl}/properties/${property.id}`,
          lastmod: property.updated_at || new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.8,
        });
      });
    }
  } catch (error) {
    console.error('Failed to generate sitemap:', error);
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;

  return xml;
};

export const downloadSitemap = async () => {
  const xml = await generateSitemap();
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sitemap.xml';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
