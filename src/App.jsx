import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import HomeContent from './components/HomeContent';
import ModelLoader from './components/ModelViewer/ModelLoader';
import About from './components/About';
import { useState } from 'react';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); 

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
      <Header onNavClick={setCurrentPage} />
      <main className="flex-grow">{renderContent()}</main>
      <Footer />
    </div>
  );
}

export default App;
