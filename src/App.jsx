import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import HomeContent from './components/HomeContent';
import ModelLoader from './components/ModelViewer/ModelLoader';
import About from './components/About';
import { useState, useEffect } from 'react';
import { NavigationManager } from './utils/navigationManager';

function App() {
  // Initialize currentPage using NavigationManager
  const [currentPage, setCurrentPage] = useState(() => {
    const page = NavigationManager.initialize();
    console.log('App initialized with page:', page, 'Is refresh:', NavigationManager.isRefresh());
    return page;
  }); 

  // Save current page to sessionStorage whenever it changes
  useEffect(() => {
    NavigationManager.savePage(currentPage);
  }, [currentPage]);

  // Setup cleanup when component mounts
  useEffect(() => {
    const cleanup = NavigationManager.setupCleanup();
    return cleanup;
  }, []);

  // Enhanced navigation handler that updates both state and sessionStorage
  const handleNavClick = (pageId) => {
    console.log('Navigating to:', pageId);
    setCurrentPage(pageId);
    NavigationManager.savePage(pageId);
  };

  const bg = currentPage === 'model' ? 'bg-white' : 'bg-gray-900';

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <HomeContent />;
      case 'model':
        return <ModelLoader />;
      case 'about':
        return <About/>;
      default:
        return <HomeContent />;
    }
  };

  return (
    <div className={`${bg} min-h-screen flex flex-col transition-colors duration-100`}>
      <Header onNavClick={handleNavClick} currentPage={currentPage} />
      <main className="flex-grow">{renderContent()}</main>
      <Footer />
    </div>
  );
}

export default App;
