export default {
  // Site configuration
  site: {
    title: 'Voice from time',
    description: 'A curated digital archive of historically significant letters and speeches in the public domain.',
    url: process.env.SITE_URL || 'https://voicefromtime.com',
  },

  // Content collections configuration
  collections: [
    {
      name: 'letters',
      label: 'Letters',
      folder: 'src/content/letters',
      create: true,
      slug: '{{author-slug}}-{{title-slug}}-{{year}}',
      fields: [
        {
          name: 'title',
          label: 'Title',
          widget: 'string',
          required: true,
          hint: 'A compelling title for the letter (e.g., "I am reduced to a thing that wants Virginia")'
        },
        {
          name: 'author',
          label: 'Author',
          widget: 'object',
          fields: [
            { name: 'name', label: 'Name', widget: 'string', required: true },
            { name: 'birth_year', label: 'Birth Year', widget: 'number', required: false },
            { name: 'death_year', label: 'Death Year', widget: 'number', required: false },
            { name: 'bio', label: 'Biography', widget: 'text', required: false }
          ]
        },
        {
          name: 'recipient',
          label: 'Recipient',
          widget: 'string',
          required: true
        },
        {
          name: 'date',
          label: 'Date',
          widget: 'datetime',
          required: true,
          date_format: 'YYYY-MM-DD',
          time_format: false
        },
        {
          name: 'context',
          label: 'Context',
          widget: 'string',
          required: true,
          hint: 'Brief context for display (e.g., "To Vita Sackville-West, January 1927")'
        },
        {
          name: 'location',
          label: 'Location',
          widget: 'string',
          required: false,
          hint: 'Where the letter was written'
        },
        {
          name: 'excerpt',
          label: 'Excerpt',
          widget: 'text',
          required: true,
          hint: 'First 1-2 sentences for homepage preview'
        },
        {
          name: 'signature',
          label: 'Signature',
          widget: 'string',
          required: false,
          hint: 'How the letter was signed'
        },
        {
          name: 'source',
          label: 'Source',
          widget: 'string',
          required: true,
          hint: 'Citation for the letter source'
        },
        {
          name: 'collections',
          label: 'Collections',
          widget: 'relation',
          collection: 'collections',
          search_fields: ['name'],
          value_field: 'slug',
          display_fields: ['name'],
          multiple: true,
          default: [],
          hint: 'Select or create thematic collections this letter belongs to'
        },
        {
          name: 'tags',
          label: 'Tags',
          widget: 'list',
          default: [],
          hint: 'Descriptive tags for the letter'
        },
        {
          name: 'featured',
          label: 'Featured',
          widget: 'boolean',
          default: false,
          hint: 'Show on homepage'
        },
        {
          name: 'drop_cap_color',
          label: 'Drop Cap Color',
          widget: 'select',
          options: [
            { label: 'Coral', value: '#e07a5f' },
            { label: 'Sage Green', value: '#81b29a' },
            { label: 'Golden Yellow', value: '#f2cc8f' },
            { label: 'Lavender', value: '#9381c2' },
            { label: 'Soft Red', value: '#f07167' }
          ],
          default: '#e07a5f'
        },
        {
          name: 'body',
          label: 'Letter Content',
          widget: 'markdown',
          required: true,
          hint: 'Full text of the letter',
          buttons: ['bold', 'italic', 'code', 'link', 'heading-one', 'heading-two', 'heading-three', 'quote', 'bulleted-list', 'numbered-list'],
          editor_components: [],
          modes: ['rich_text', 'raw']
        },
        {
          name: 'about',
          label: 'About This Letter',
          widget: 'object',
          collapsed: true,
          fields: [
            {
              name: 'context',
              label: 'Historical Context',
              widget: 'markdown',
              required: false,
              hint: 'Background information about when/why this letter was written',
              buttons: ['bold', 'italic', 'link', 'quote'],
              modes: ['rich_text', 'raw']
            },
            {
              name: 'significance',
              label: 'Significance',
              widget: 'markdown',
              required: false,
              hint: 'Why this letter is historically or culturally important',
              buttons: ['bold', 'italic', 'link', 'quote'],
              modes: ['rich_text', 'raw']
            },
            {
              name: 'author_bio',
              label: 'About the Author',
              widget: 'markdown',
              required: false,
              hint: 'Brief biographical information about the letter writer',
              buttons: ['bold', 'italic', 'link'],
              modes: ['rich_text', 'raw']
            },
            {
              name: 'recipient_info',
              label: 'About the Recipient',
              widget: 'markdown',
              required: false,
              hint: 'Information about who received this letter',
              buttons: ['bold', 'italic', 'link'],
              modes: ['rich_text', 'raw']
            },
            {
              name: 'links',
              label: 'Additional Resources',
              widget: 'list',
              allow_add: true,
              fields: [
                { name: 'title', label: 'Link Title', widget: 'string', required: true },
                { name: 'url', label: 'URL', widget: 'string', required: true, pattern: ['^https?://', 'Must be a valid URL starting with http:// or https://'] },
                { name: 'description', label: 'Description', widget: 'string', required: false }
              ],
              default: [],
              hint: 'Wikipedia links, biographical resources, related articles, etc.'
            }
          ]
        }
      ]
    },
    {
      name: 'speeches',
      label: 'Speeches',
      folder: 'src/content/speeches',
      create: true,
      slug: '{{author-slug}}-{{title-slug}}-{{year}}',
      fields: [
        {
          name: 'title',
          label: 'Title',
          widget: 'string',
          required: true
        },
        {
          name: 'author',
          label: 'Author',
          widget: 'object',
          fields: [
            { name: 'name', label: 'Name', widget: 'string', required: true },
            { name: 'birth_year', label: 'Birth Year', widget: 'number', required: false },
            { name: 'death_year', label: 'Death Year', widget: 'number', required: false },
            { name: 'bio', label: 'Biography', widget: 'text', required: false }
          ]
        },
        {
          name: 'date',
          label: 'Date',
          widget: 'datetime',
          required: true,
          date_format: 'YYYY-MM-DD',
          time_format: false
        },
        {
          name: 'context',
          label: 'Context',
          widget: 'string',
          required: true
        },
        {
          name: 'location',
          label: 'Location',
          widget: 'string',
          required: false
        },
        {
          name: 'occasion',
          label: 'Occasion',
          widget: 'string',
          required: false
        },
        {
          name: 'excerpt',
          label: 'Excerpt',
          widget: 'text',
          required: true
        },
        {
          name: 'source',
          label: 'Source',
          widget: 'string',
          required: true
        },
        {
          name: 'collections',
          label: 'Collections',
          widget: 'relation',
          collection: 'collections',
          search_fields: ['name'],
          value_field: 'slug',
          display_fields: ['name'],
          multiple: true,
          default: [],
          hint: 'Select or create thematic collections this speech belongs to'
        },
        {
          name: 'tags',
          label: 'Tags',
          widget: 'list',
          default: []
        },
        {
          name: 'featured',
          label: 'Featured',
          widget: 'boolean',
          default: false
        },
        {
          name: 'drop_cap_color',
          label: 'Drop Cap Color',
          widget: 'select',
          options: [
            { label: 'Coral', value: '#e07a5f' },
            { label: 'Sage Green', value: '#81b29a' },
            { label: 'Golden Yellow', value: '#f2cc8f' },
            { label: 'Lavender', value: '#9381c2' },
            { label: 'Soft Red', value: '#f07167' }
          ],
          default: '#e07a5f'
        },
        {
          name: 'body',
          label: 'Speech Content',
          widget: 'markdown',
          required: true,
          hint: 'Full text of the speech',
          buttons: ['bold', 'italic', 'code', 'link', 'heading-one', 'heading-two', 'heading-three', 'quote', 'bulleted-list', 'numbered-list'],
          editor_components: [],
          modes: ['rich_text', 'raw']
        }
      ]
    },
    {
      name: 'collections',
      label: 'Collections',
      folder: 'src/content/collections',
      create: true,
      slug: '{{name-slug}}',
      fields: [
        {
          name: 'name',
          label: 'Collection Name',
          widget: 'string',
          required: true
        },
        {
          name: 'slug',
          label: 'Slug',
          widget: 'string',
          required: true,
          pattern: ['^[a-z0-9]+(?:-[a-z0-9]+)*$', 'Slug must be lowercase letters, numbers, and hyphens only'],
          hint: 'URL-friendly version of the name (e.g., love-letters, wartime-correspondence)'
        },
        {
          name: 'description',
          label: 'Description',
          widget: 'text',
          required: true
        },
        {
          name: 'color',
          label: 'Theme Color',
          widget: 'string',
          default: '#d4a574'
        },
        {
          name: 'body',
          label: 'Collection Description',
          widget: 'markdown',
          required: false,
          hint: 'Extended description of the collection (optional)',
          buttons: ['bold', 'italic', 'link', 'heading-two', 'heading-three', 'quote', 'bulleted-list', 'numbered-list'],
          editor_components: [],
          modes: ['rich_text', 'raw']
        }
      ]
    }
  ],

  // Media configuration
  media: {
    folder: 'public/images',
    public_folder: '/images'
  },

  // Editorial workflow (optional)
  publish_mode: 'editorial_workflow',

  // Backend configuration (GitHub by default)
  backend: {
    name: 'git-gateway',
    branch: 'main'
  }
};