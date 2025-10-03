// Search functionality for Paper Lanterns
// This file is loaded on the search page to enable client-side search

// Search functionality
function performSearch(query) {
  const searchTerm = query.toLowerCase().trim();

  if (!searchTerm) return [];

  // Check if this is an era search
  const eraMap = {
    '20th-century': { start: 1900, end: 2000 },
    '19th-century': { start: 1800, end: 1900 },
    '18th-century-earlier': { start: 0, end: 1800 }
  };

  const era = eraMap[searchTerm];
  if (era) {
    return window.searchData.filter(item => {
      const year = new Date(item.date).getFullYear();
      return year >= era.start && year < era.end;
    }).sort((a, b) => b.date - a.date);
  }

  return window.searchData.filter(item => {
    const searchableText = [
      item.title,
      item.author,
      item.recipient,
      item.context,
      item.excerpt,
      item.body,
      ...item.tags,
      ...item.collections
    ].join(' ').toLowerCase();

    return searchableText.includes(searchTerm);
  }).sort((a, b) => {
    // Prioritize title matches, then author matches, then content matches
    const aTitle = a.title.toLowerCase().includes(searchTerm);
    const bTitle = b.title.toLowerCase().includes(searchTerm);
    const aAuthor = a.author.toLowerCase().includes(searchTerm);
    const bAuthor = b.author.toLowerCase().includes(searchTerm);

    if (aTitle && !bTitle) return -1;
    if (bTitle && !aTitle) return 1;
    if (aAuthor && !bAuthor) return -1;
    if (bAuthor && !aAuthor) return 1;

    // Sort by date if equal relevance
    return b.date - a.date;
  });
}

// Highlight search terms
function highlightText(text, searchTerm, maxLength = 150) {
  if (!searchTerm || !text) return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '');

  const lowerText = text.toLowerCase();
  const lowerTerm = searchTerm.toLowerCase();
  const index = lowerText.indexOf(lowerTerm);

  if (index === -1) {
    return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '');
  }

  // Try to center the match in the excerpt
  const start = Math.max(0, index - Math.floor((maxLength - searchTerm.length) / 2));
  const end = Math.min(text.length, start + maxLength);

  let excerpt = text.substring(start, end);
  if (start > 0) excerpt = '...' + excerpt;
  if (end < text.length) excerpt = excerpt + '...';

  // Highlight the search term
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return excerpt.replace(regex, '<mark>$1</mark>');
}

// Display results with smooth transitions
function displayResults(results, query) {
  const resultsSection = document.getElementById('search-results');
  const resultsList = document.getElementById('results-list');
  const noResults = document.getElementById('no-results');
  const suggestions = document.getElementById('search-suggestions');
  const subtitle = document.getElementById('search-subtitle');

  // Hide suggestions first
  suggestions.classList.remove('visible');
  suggestions.classList.add('hidden');

  // Update content
  if (results.length === 0) {
    noResults.style.display = 'block';
    resultsList.innerHTML = '';
  } else {
    noResults.style.display = 'none';
    resultsList.innerHTML = results.map(item => `
      <article class="result-item">
        <div class="result-meta">
          <span class="result-type">${item.contentType === 'letter' ? 'Letter' : 'Speech'}</span>
          <time class="result-date">${new Date(item.date).getFullYear()}</time>
        </div>

        <h3 class="result-title">
          <a href="/${item.contentType}/${item.slug}">${item.title}</a>
        </h3>

        <div class="result-details">
          <span class="author-name">${item.author}</span>
          ${item.contentType === 'letter' && item.recipient ? `
            <span class="separator">→</span>
            <span class="recipient">${item.recipient}</span>
          ` : ''}
        </div>

        <p class="result-excerpt">${highlightText(item.excerpt, query)}</p>

        ${item.tags.length > 0 ? `
          <div class="result-tags">
            ${item.tags.slice(0, 4).map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        ` : ''}
      </article>
    `).join('');
  }

  subtitle.textContent = `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`;
  subtitle.style.display = 'block';

  // Show results with smooth transition
  setTimeout(() => {
    resultsSection.classList.remove('hidden');
    resultsSection.classList.add('visible');
  }, 150);
}

// Handle search with smooth transitions using classes
function handleSearch(query) {
  if (!query.trim()) {
    const resultsSection = document.getElementById('search-results');
    const suggestions = document.getElementById('search-suggestions');
    const subtitle = document.getElementById('search-subtitle');

    // Hide results and show suggestions
    resultsSection.classList.remove('visible');
    resultsSection.classList.add('hidden');
    subtitle.style.display = 'none';

    setTimeout(() => {
      suggestions.classList.remove('hidden');
      suggestions.classList.add('visible');
    }, 100);
    return;
  }

  const results = performSearch(query);
  displayResults(results, query);

  // Update URL without page reload
  const url = new URL(window.location);
  url.searchParams.set('q', query);
  window.history.pushState({}, '', url);
}

// Initialize search page
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const searchForm = document.getElementById('search-form');

  // Check for query parameter on load
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q');
  if (initialQuery) {
    searchInput.value = initialQuery;
    handleSearch(initialQuery);
  } else {
    searchInput.focus();
  }

  // Form submission
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSearch(searchInput.value);
  });

  // Real-time search with reduced debounce for smoother UX
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      handleSearch(e.target.value);
    }, 200);
  });

  // Suggestion tags
  document.querySelectorAll('.suggestion-tag').forEach(tag => {
    tag.addEventListener('click', (e) => {
      const query = e.target.getAttribute('data-query');
      searchInput.value = query;
      handleSearch(query);
    });
  });
});
