import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import HomeContent from './components/HomeContent';

function App() {
  return (
    // Changed background to bg-gray-900 for a consistent dark theme
    <div className="bg-gray-900 min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HomeContent /> 
      </main>
      <Footer />
    </div>
  );
  
}

export default App;