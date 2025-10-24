// Navigation utility for managing page state persistence
export const NavigationManager = {
  // Key for sessionStorage
  STORAGE_KEY: 'currentPage',
  
  // Default page
  DEFAULT_PAGE: 'home',
  
  // Valid pages
  VALID_PAGES: ['home', 'model', 'about'],
  
  // Get current page from sessionStorage or return default
  getCurrentPage() {
    const savedPage = sessionStorage.getItem(this.STORAGE_KEY);
    return this.VALID_PAGES.includes(savedPage) ? savedPage : this.DEFAULT_PAGE;
  },
  
  // Save page to sessionStorage
  savePage(page) {
    if (this.VALID_PAGES.includes(page)) {
      sessionStorage.setItem(this.STORAGE_KEY, page);
    }
  },
  
  // Clear saved page
  clearPage() {
    sessionStorage.removeItem(this.STORAGE_KEY);
  },
  
  // Check if current session is a refresh (has saved page)
  isRefresh() {
    return sessionStorage.getItem(this.STORAGE_KEY) !== null;
  },
  
  // Initialize navigation state
  initialize() {
    const currentPage = this.getCurrentPage();
    this.savePage(currentPage);
    return currentPage;
  },
  
  // Setup beforeunload listener to clear storage on tab close
  setupCleanup() {
    const handleBeforeUnload = () => {
      this.clearPage();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }
};
