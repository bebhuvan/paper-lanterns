import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  // Fetch all content collections
  const letters = await getCollection('letters');
  const speeches = await getCollection('speeches');
  const lectures = await getCollection('lectures');
  const essays = await getCollection('essays');
  const gardenPosts = await getCollection('garden', ({ data }) => !data.private);

  // Combine and sort all items by date
  const allItems = [
    ...letters.map(item => ({
      ...item,
      contentType: 'letter',
      pubDate: item.data.date,
    })),
    ...speeches.map(item => ({
      ...item,
      contentType: 'speech',
      pubDate: item.data.date,
    })),
    ...lectures.map(item => ({
      ...item,
      contentType: 'lecture',
      pubDate: item.data.date,
    })),
    ...essays.map(item => ({
      ...item,
      contentType: 'essay',
      pubDate: item.data.date,
    })),
    ...gardenPosts.map(item => ({
      ...item,
      contentType: 'garden',
      pubDate: item.data.date,
    })),
  ].sort((a, b) => b.pubDate - a.pubDate);

  return rss({
    title: 'Paper Lanterns',
    description: 'A curated digital archive of historically significant letters, speeches, lectures, and essays in the public domain.',
    site: context.site || 'https://paperlanterns.ink',
    items: allItems.map((item) => {
      const { contentType } = item;
      const data = item.data;

      // Construct the URL based on content type
      let link;
      if (contentType === 'garden') {
        link = `/garden/${item.slug}/`;
      } else {
        link = `/${contentType}/${item.slug}/`;
      }

      // Build description based on content type
      let description = '';
      if (contentType === 'letter') {
        description = `${data.excerpt || ''}\n\nFrom ${data.author.name} to ${data.recipient}, ${new Date(data.date).getFullYear()}`;
      } else if (contentType === 'garden') {
        description = data.excerpt || data.description || '';
      } else {
        description = `${data.excerpt || ''}\n\nBy ${data.author.name}, ${new Date(data.date).getFullYear()}`;
      }

      return {
        title: data.title,
        description: description,
        link: link,
        pubDate: data.date,
        author: contentType === 'garden'
          ? (data.author || 'Paper Lanterns')
          : data.author.name,
        categories: data.tags || [],
      };
    }),
    customData: `<language>en-us</language>`,
  });
}
