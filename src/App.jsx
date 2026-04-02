import './App.css';
import Footer from './layout/Footer';
import Header from './layout/Header';
import HomeContent from './features/home/HomeContent';
import ModelLoader from './features/model-viewer/ModelLoader';
import About from './features/about/About';
import AssessmentContent from './features/assessment/AssessmentContent';
import NameGate from './features/assessment/NameGate';
import HighScoreBanner from './shared/components/HighScoreBanner';
import { useState, useEffect, useCallback } from 'react';
import { NavigationManager } from './utils/navigationManager';
import { getChampion } from './services/scoreService';

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const page = NavigationManager.initialize();
    return page;
  });

  // Assessment name gate — persisted in sessionStorage so refresh keeps the player logged in
  const [assessmentName, setAssessmentName] = useState(
    () => sessionStorage.getItem('assessmentName') || null
  );

  // High-score banner
  const [champion, setChampion]         = useState(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [hasRecords, setHasRecords]       = useState(false);

  const refreshChampion = useCallback(async () => {
    const data = await getChampion();
    if (!data) return;
    setHasRecords(true);
    setChampion(prev => {
      const isNew = !prev || data.finalScore > prev.finalScore || data.name !== prev.name;
      if (isNew) setBannerVisible(true);
      return isNew ? data : prev;
    });
  }, []);

  // One-time check on mount
  useEffect(() => {
    refreshChampion();
  }, [refreshChampion]);

  // Start polling only once records exist
  useEffect(() => {
    if (!hasRecords) return;
    const id = setInterval(refreshChampion, 30000);
    return () => clearInterval(id);
  }, [hasRecords, refreshChampion]);

  useEffect(() => {
    NavigationManager.savePage(currentPage);
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    const cleanup = NavigationManager.setupCleanup();
    return cleanup;
  }, []);

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    NavigationManager.savePage(pageId);
  };

  const bg = currentPage === 'model' ? 'bg-white' : 'bg-gray-900';

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <HomeContent onNavigate={handleNavClick} />;
      case 'model':
        return <ModelLoader />;
      case 'assessment':
        return assessmentName
          ? <AssessmentContent playerName={assessmentName} onScoreSubmitted={refreshChampion} onExit={() => { ['assessmentName','sectionStartTimes','sectionTimeUsed'].forEach(k => sessionStorage.removeItem(k)); setAssessmentName(null); }} />
          : <NameGate onConfirm={name => { sessionStorage.setItem('assessmentName', name); setAssessmentName(name); }} />;
      case 'about':
        return <About />;
      default:
        return <HomeContent onNavigate={handleNavClick} />;
    }
  };

  return (
    <div className={`${bg} min-h-screen flex flex-col transition-colors duration-100`}>
      <Header onNavClick={handleNavClick} currentPage={currentPage} />
      {bannerVisible && (
        <HighScoreBanner champion={champion} onDismiss={() => setBannerVisible(false)} />
      )}
      <main className="flex-grow">{renderContent()}</main>
      <Footer />
    </div>
  );
}

export default App;
