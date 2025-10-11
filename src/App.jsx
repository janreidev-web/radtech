import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import HomeContent from './components/HomeContent';
import ModelLoader from './components/ModelViewer/ModelLoader';
import { useState, useEffect } from 'react';

function App() {
  // Load saved page from localStorage or default to 'home'
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'home';
  });

  // Save currentPage in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  // Derive bg
  const bg = currentPage === 'model' ? 'bg-white' : 'bg-gray-900';

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <HomeContent />;
      case 'model':
        return <ModelLoader />;
      default:
        return <HomeContent />;
    }
  };

  return (
    <div className={`${bg} min-h-screen flex flex-col transition-colors duration-100`}>
      <Header onNavClick={setCurrentPage} />
      <main className="flex-grow">{renderContent()}</main>
      <Footer />
    </div>
  );
}



export default App;
