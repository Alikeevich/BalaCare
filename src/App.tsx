import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'; // Добавили BrowserRouter и Routes
import { AuthProvider, useAuth } from './context/AuthContext';

// Компоненты
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import OnboardingScreen from './components/OnboardingScreen';
import AuthModal from './components/AuthModal';

// Страницы
import HomePage from './pages/HomePage';
import LearningPage from './pages/LearningPage';
import SupportPage from './pages/SupportPage';
import CommunityPage from './pages/CommunityPage';
import MarketPage from './pages/MarketPage';
import ProfilePage from './pages/ProfilePage';

const ONBOARDING_KEY = 'balaCareOnboardingSeen';

const AppContent = () => {
  const { session, profile, signOut } = useAuth();
  const [onboardingSeen, setOnboardingSeen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  
  // Хук useLocation нужен, чтобы BottomNav знал, где мы находимся
  // Но BottomNav сам может его использовать, здесь он не обязателен для рендера,
  // но нужен, чтобы передать текущий путь в Nav, если мы не перепишем Nav.
  // Давай сделаем Nav умнее (см. следующий шаг), а тут просто роуты.

  useEffect(() => {
    const seen = localStorage.getItem(ONBOARDING_KEY) === 'true';
    setOnboardingSeen(seen);
  }, []);

  const handleOnboardingClose = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setOnboardingSeen(true);
  };

  const isLoggedIn = !!session;
  const openAuth = () => setAuthModalOpen(true);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-purple-200">
      
      {!onboardingSeen && <OnboardingScreen onClose={handleOnboardingClose} />}
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />

      <div className="max-w-xl mx-auto min-h-screen bg-white shadow-2xl relative">
        <Header 
          isLoggedIn={isLoggedIn} 
          onLogin={openAuth} 
          onLogout={signOut} 
          userProfile={profile}
        />

        <main className="animate-fade-in">
          {/* НАСТОЯЩАЯ МАРШРУТИЗАЦИЯ */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/learn" element={<LearningPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/market" element={<MarketPage />} />
            <Route path="/profile" element={<ProfilePage onLogin={openAuth} />} />
            {/* Если путь не найден, вернем домой */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        
        {/* BottomNav теперь сам разберется с путями */}
        <BottomNav /> 

      </div>
    </div>
  );
};

function App() {
  return (
    // ВАЖНО: BrowserRouter должен быть САМЫМ ВЕРХНИМ
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;