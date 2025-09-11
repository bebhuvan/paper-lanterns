// Make function globally available
window.getRandomLetter = async function() {
  const button = document.querySelector('.random-letter-btn-large');
  if (!button) return;
  
  // Disable button and show loading state
  button.disabled = true;
  const originalText = button.querySelector('span')?.textContent;
  const span = button.querySelector('span');
  if (span) span.textContent = 'Finding...';
  
  try {
    // Fetch all letters and speeches from the API
    const response = await fetch('/api/random-content.json');
    if (!response.ok) {
      throw new Error('Failed to fetch content');
    }
    
    const data = await response.json();
    const allContent = data.content;
    
    if (allContent.length === 0) {
      throw new Error('No content available');
    }
    
    // Select a random item
    const randomIndex = Math.floor(Math.random() * allContent.length);
    const randomItem = allContent[randomIndex];
    
    // Navigate to the random letter/speech
    window.location.href = `/${randomItem.collection}/${randomItem.slug}`;
    
  } catch (error) {
    console.error('Error fetching random letter:', error);
    
    // Re-enable button and restore text
    button.disabled = false;
    if (span && originalText) span.textContent = originalText;
    
    // Show error feedback
    if (span) {
      span.textContent = 'Try again';
      setTimeout(() => {
        if (originalText) span.textContent = originalText;
      }, 2000);
    }
  }
};