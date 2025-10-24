# Navigation Persistence System

This document explains the navigation persistence system that maintains the current view during page refreshes while defaulting to Home on initial launches.

## Overview

The system uses `sessionStorage` to persist the current page state during browser refreshes, but clears this state when the user closes the tab/window to ensure fresh starts on new sessions.

## How It Works

### 1. **Initial Load vs Refresh Detection**

```javascript
// On app initialization
const [currentPage, setCurrentPage] = useState(() => {
  const page = NavigationManager.initialize();
  console.log('App initialized with page:', page, 'Is refresh:', NavigationManager.isRefresh());
  return page;
});
```

- **Initial Load**: When you first open the app (new tab/window), `sessionStorage` is empty, so it defaults to `'home'`
- **Refresh**: When you refresh the page, `sessionStorage` contains the last viewed page, so it restores that page

### 2. **Page State Persistence**

```javascript
// Save page whenever it changes
useEffect(() => {
  NavigationManager.savePage(currentPage);
}, [currentPage]);

// Navigation handler
const handleNavClick = (pageId) => {
  console.log('Navigating to:', pageId);
  setCurrentPage(pageId);
  NavigationManager.savePage(pageId);
};
```

Every time you navigate to a different page, it's automatically saved to `sessionStorage`.

### 3. **Cleanup on Tab Close**

```javascript
// Setup cleanup when component mounts
useEffect(() => {
  const cleanup = NavigationManager.setupCleanup();
  return cleanup;
}, []);
```

When you close the tab/window, the `beforeunload` event clears the `sessionStorage`, ensuring the next fresh launch starts at Home.

## User Experience Scenarios

### Scenario 1: Fresh Launch
1. User opens new tab/window
2. App starts at **Home** page
3. User navigates to **Model Viewer**
4. User refreshes page (F5 or Ctrl+R)
5. App stays on **Model Viewer** ✅

### Scenario 2: Tab Close and Reopen
1. User is on **Model Viewer**
2. User closes tab/window
3. User opens new tab/window
4. App starts at **Home** page ✅

### Scenario 3: Multiple Refreshes
1. User navigates to **About** page
2. User refreshes → stays on **About**
3. User refreshes again → stays on **About**
4. User refreshes multiple times → always stays on **About** ✅

## Technical Implementation

### NavigationManager Utility

The `NavigationManager` utility provides clean methods for managing navigation state:

```javascript
// Get current page from sessionStorage or return default
getCurrentPage() {
  const savedPage = sessionStorage.getItem(this.STORAGE_KEY);
  return this.VALID_PAGES.includes(savedPage) ? savedPage : this.DEFAULT_PAGE;
}

// Save page to sessionStorage
savePage(page) {
  if (this.VALID_PAGES.includes(page)) {
    sessionStorage.setItem(this.STORAGE_KEY, page);
  }
}

// Clear saved page
clearPage() {
  sessionStorage.removeItem(this.STORAGE_KEY);
}

// Check if current session is a refresh
isRefresh() {
  return sessionStorage.getItem(this.STORAGE_KEY) !== null;
}
```

### Key Features

1. **Validation**: Only valid pages (`home`, `model`, `about`) are saved
2. **Fallback**: Invalid or missing pages default to `home`
3. **Cleanup**: Automatic cleanup on tab close prevents stale state
4. **Debugging**: Console logs help track navigation behavior

## Browser Compatibility

- **sessionStorage**: Supported in all modern browsers
- **beforeunload**: Supported in all modern browsers
- **React useEffect**: Standard React hook

## Testing the Behavior

1. **Open the app** → Should start at Home
2. **Navigate to Model Viewer** → Should switch to Model Viewer
3. **Refresh the page** → Should stay on Model Viewer
4. **Close the tab** → Clears sessionStorage
5. **Open new tab** → Should start at Home again

## Debug Information

The console will show:
- `App initialized with page: [page] Is refresh: [true/false]`
- `Navigating to: [page]`

This helps verify the system is working correctly.

## Benefits

1. **User-Friendly**: Maintains context during refreshes
2. **Clean Starts**: Fresh launches always begin at Home
3. **Reliable**: Uses browser-native sessionStorage
4. **Maintainable**: Clean utility functions for easy updates
5. **Debuggable**: Console logs for troubleshooting

This system provides the best of both worlds: persistence during refreshes and clean starts for new sessions.
