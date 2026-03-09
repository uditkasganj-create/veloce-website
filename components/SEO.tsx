import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
  tags?: string[];
}

export function useSEO({
  title = 'Veloce | Performance Footwear',
  description = 'Engineered for the urban athlete who demands precision, speed, and style in every stride. Discover premium performance footwear at Veloce.',
  image = '/og-image.jpg',
  url,
  type = 'website',
  publishedTime,
  author,
  tags,
}: SEOProps = {}) {
  const siteName = 'Veloce';
  const twitterHandle = '@veloce';

  useEffect(() => {
    document.title = title;

    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: tags?.join(', ') || 'running shoes, performance footwear, sports shoes, athletic wear' },
      
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: siteName },
      ...(url ? [{ property: 'og:url', content: url }] : []),
      ...(publishedTime ? [{ property: 'article:published_time', content: publishedTime }] : []),
      ...(author ? [{ property: 'article:author', content: author }] : []),

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: twitterHandle },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },

      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: author || 'Veloce' },
    ];

    const existingMeta = document.querySelectorAll('meta[name], meta[property]');
    existingMeta.forEach((meta) => {
      if (meta.getAttribute('name') !== 'viewport' && 
          meta.getAttribute('name') !== 'theme-color' &&
          meta.getAttribute('property') !== 'theme-color') {
        meta.remove();
      }
    });

    metaTags.forEach(({ name, property, content }) => {
      const meta = document.createElement('meta');
      if (name) meta.setAttribute('name', name);
      if (property) meta.setAttribute('property', property);
      if (content) meta.setAttribute('content', content);
      document.head.appendChild(meta);
    });

    return () => {
      metaTags.forEach(({ name, property }) => {
        const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
        document.querySelector(selector)?.remove();
      });
    };
  }, [title, description, image, url, type, publishedTime, author, tags, siteName, twitterHandle]);
}

export function JsonLd({ data }: { data: Record<string, any> }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [data]);

  return null;
}

export function useProductJsonLd(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  rating?: number;
  reviewCount?: number;
  sku?: string;
  availability?: 'in stock' | 'out of stock';
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku || product.name.toLowerCase().replace(/\s+/g, '-'),
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability: `https://schema.org/${product.availability || 'InStock'}`,
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 0,
      },
    }),
  };

  return JsonLd({ data: jsonLd });
}

export function useOrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Veloce',
    url: 'https://veloce.com',
    logo: 'https://veloce.com/logo.png',
    description: 'Premium performance footwear for urban athletes',
    sameAs: [
      'https://instagram.com/veloce',
      'https://twitter.com/veloce',
      'https://facebook.com/veloce',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-XXXXXXXXXX',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
    },
  };

  return JsonLd({ data: jsonLd });
}
