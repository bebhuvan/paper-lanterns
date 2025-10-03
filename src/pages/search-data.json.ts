import { getCollection } from 'astro:content';

export const prerender = true;

export async function GET() {
  const letters = await getCollection('letters');
  const speeches = await getCollection('speeches');

  const allContent = [
    ...letters.map((item) => ({ ...item, contentType: 'letter' })),
    ...speeches.map((item) => ({ ...item, contentType: 'speech' })),
  ];

  const searchData = allContent.map((item) => ({
    slug: item.slug,
    contentType: item.contentType,
    title: item.data.title,
    author: item.data.author.name,
    recipient: item.data.recipient || '',
    context: item.data.context,
    excerpt: item.data.excerpt,
    body: item.body,
    tags: item.data.tags || [],
    collections: item.data.collections || [],
    date: new Date(item.data.date).getTime(),
  }));

  return new Response(JSON.stringify(searchData), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
