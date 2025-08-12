import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    // Get all letters, speeches, lectures, and essays
    const letters = await getCollection('letters');
    const speeches = await getCollection('speeches');
    const lectures = await getCollection('lectures');
    const essays = await getCollection('essays');
    
    // Combine and map to simple objects for the API
    const allContent = [
      ...letters.map(item => ({
        slug: item.slug,
        collection: 'letter', // Use singular route name
        title: item.data.title,
        author: item.data.author.name,
        date: item.data.date.toISOString(),
      })),
      ...speeches.map(item => ({
        slug: item.slug,
        collection: 'speech', // Use singular route name
        title: item.data.title,
        author: item.data.author.name,
        date: item.data.date.toISOString(),
      })),
      ...lectures.map(item => ({
        slug: item.slug,
        collection: 'lecture', // Use singular route name
        title: item.data.title,
        author: item.data.author.name,
        date: item.data.date.toISOString(),
      })),
      ...essays.map(item => ({
        slug: item.slug,
        collection: 'essay', // Use singular route name
        title: item.data.title,
        author: item.data.author.name,
        date: item.data.date.toISOString(),
      }))
    ];

    return new Response(
      JSON.stringify({
        content: allContent,
        total: allContent.length
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
        },
      }
    );
  } catch (error) {
    console.error('Error in random-content API:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch content',
        content: [],
        total: 0
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};