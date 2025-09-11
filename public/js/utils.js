// Utility functions for the site
(function() {
  'use strict';

  // Share content functionality
  window.shareContent = function() {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        text: document.querySelector('meta[name="description"]')?.content || '',
        url: window.location.href
      }).catch(console.error);
    } else {
      copyLink();
    }
  };

  // Copy link functionality
  window.copyLink = function() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast('Link copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast('Link copied to clipboard!');
    });
  };

  // Copy text functionality
  window.copyText = function() {
    const content = document.querySelector('.letter-content, .speech-content, .lecture-content, .essay-content');
    if (content) {
      const text = content.innerText;
      navigator.clipboard.writeText(text).then(() => {
        showToast('Text copied to clipboard!');
      }).catch(console.error);
    }
  };

  // Share post functionality for garden
  window.sharePost = function(button) {
    const postTitle = document.querySelector('h1')?.textContent || document.title;
    const postDesc = document.querySelector('meta[name="description"]')?.content || '';
    
    if (navigator.share) {
      navigator.share({
        title: postTitle,
        text: postDesc,
        url: window.location.href
      }).catch(console.error);
    } else {
      copyLink();
    }
  };

  // Show toast notification
  function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--accent-primary);
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      opacity: 0;
      transform: translateY(-10px);
      transition: all 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  // Initialize event listeners when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', function() {
        const menu = this.parentElement.nextElementSibling;
        if (menu) {
          menu.classList.toggle('mobile-open');
        }
      });
    }

    // Random letter button
    const randomButtons = document.querySelectorAll('.random-letter-btn-large, .random-letter-btn');
    randomButtons.forEach(button => {
      button.addEventListener('click', function() {
        if (typeof window.getRandomLetter === 'function') {
          window.getRandomLetter();
        }
      });
    });

    // Print buttons
    const printButtons = document.querySelectorAll('[data-action="print"]');
    printButtons.forEach(button => {
      button.addEventListener('click', function() {
        window.print();
      });
    });

    // Retry/reload buttons
    const reloadButtons = document.querySelectorAll('[data-action="reload"]');
    reloadButtons.forEach(button => {
      button.addEventListener('click', function() {
        window.location.reload();
      });
    });

    // Share buttons
    const shareButtons = document.querySelectorAll('[data-action="share"]');
    shareButtons.forEach(button => {
      button.addEventListener('click', shareContent);
    });

    // Copy link buttons
    const copyLinkButtons = document.querySelectorAll('[data-action="copy-link"]');
    copyLinkButtons.forEach(button => {
      button.addEventListener('click', copyLink);
    });

    // Copy text buttons
    const copyTextButtons = document.querySelectorAll('[data-action="copy-text"]');
    copyTextButtons.forEach(button => {
      button.addEventListener('click', copyText);
    });

    // Garden share buttons
    const gardenShareButtons = document.querySelectorAll('[data-action="share-post"]');
    gardenShareButtons.forEach(button => {
      button.addEventListener('click', function() {
        sharePost(this);
      });
    });
  });
})();