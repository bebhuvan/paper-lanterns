import type { APIRoute } from 'astro';
import { getAllContentItems } from '../../lib/data-layer';

export const GET: APIRoute = async () => {
  try {
    // Get all content from data layer (cached)
    const allContent = await getAllContentItems();

    // Map to simple objects for the API
    const apiContent = allContent.map(item => ({
      slug: item.slug,
      collection: item.contentType, // 'letter', 'speech', 'lecture', 'essay'
      title: item.data.title,
      author: item.data.author.name,
      date: item.data.date.toISOString(),
    }));

    return new Response(
      JSON.stringify({
        content: apiContent,
        total: apiContent.length
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