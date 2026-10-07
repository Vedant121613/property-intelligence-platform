import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import HomePage from './pages/HomePage';
import TransactionsPage from './pages/TransactionsPage';
import TransactionDetailPage from './pages/TransactionDetailPage';
import CityPage from './pages/CityPage';
import LocalityPage from './pages/LocalityPage';
import ProjectPage from './pages/ProjectPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import PlansPage from './pages/PlansPage';

function AppContent() {
  const [route, setRoute] = useState(() => {
    const path = window.location.pathname;
    if (path.startsWith('/signin') || path.startsWith('/signup') || path.startsWith('/login')) {
      return { page: 'signin', params: {} };
    } else if (path.startsWith('/plans')) {
      return { page: 'plans', params: {} };
    } else if (path.startsWith('/profile')) {
      return { page: 'profile', params: {} };
    } else if (path.startsWith('/details/')) {
      const parts = path.split('/').filter(Boolean);
      return {
        page: 'details',
        params: { transactionId: parts[1] || '11089052' }
      };
    } else if (path.startsWith('/transactions')) {
      return {
        page: 'transactions',
        params: { projectId: 'y-square', cityId: 'mumbai' }
      };
    } else if (path.startsWith('/project/')) {
      const parts = path.split('/').filter(Boolean);
      return {
        page: 'project',
        params: {
          cityId: parts[1] || 'pune',
          localityId: parts[2] || 'saswad-road',
          projectId: parts[3] || 'heera-solitaire'
        }
      };
    } else if (path.startsWith('/location/')) {
      const parts = path.split('/').filter(Boolean);
      return {
        page: 'locality',
        params: {
          cityId: parts[1] || 'pune',
          localityId: parts[2] || 'saswad-road'
        }
      };
    } else if (path.startsWith('/city/')) {
      const parts = path.split('/').filter(Boolean);
      return {
        page: 'city',
        params: { cityId: parts[1] || 'pune' }
      };
    }
    // Default to Home page
    return {
      page: 'home',
      params: {}
    };
  });

  const [currentCity, setCurrentCity] = useState(route.params.cityId || 'mumbai');

  const navigateTo = (page, params = {}) => {
    setRoute({ page, params });
    if (params.cityId) {
      setCurrentCity(params.cityId);
    }

    let targetUrl = '/';
    if (page === 'home') {
      targetUrl = '/';
    } else if (page === 'signin' || page === 'signup') {
      targetUrl = '/signin';
    } else if (page === 'plans') {
      targetUrl = '/plans';
    } else if (page === 'profile') {
      targetUrl = '/profile';
    } else if (page === 'transactions') {
      targetUrl = `/transactions?project=${params.projectId || 'y-square'}`;
    } else if (page === 'details') {
      targetUrl = `/details/${params.transactionId || '11089052'}`;
    } else if (page === 'city') {
      targetUrl = `/city/${params.cityId || currentCity}`;
    } else if (page === 'locality') {
      targetUrl = `/location/${params.cityId || currentCity}/${params.localityId || 'saswad-road'}`;
    } else if (page === 'project') {
      targetUrl = `/project/${params.cityId || currentCity}/${params.localityId || 'saswad-road'}/${params.projectId || 'heera-solitaire'}`;
    }

    try {
      window.history.pushState({ page, params }, '', targetUrl);
    } catch {
      // Fallback for sandboxed environments
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.page) {
        setRoute(event.state);
        if (event.state.params?.cityId) {
          setCurrentCity(event.state.params.cityId);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="app-container">
      {/* Top Persistent Navbar (Hidden on clean Auth page matching screenshot) */}
      {route.page !== 'signin' && (
        <Navbar
          currentCity={currentCity}
          onSelectCity={(cityId) => {
            setCurrentCity(cityId);
            if (route.page === 'city') {
              navigateTo('city', { cityId });
            }
          }}
          onNavigate={navigateTo}
        />
      )}

      {/* Main Page View */}
      <main className="main-content">
        {route.page === 'signin' && (
          <AuthPage onNavigate={navigateTo} />
        )}

        {route.page === 'plans' && (
          <PlansPage onNavigate={navigateTo} />
        )}

        {route.page === 'home' && (
          <HomePage
            currentCity={currentCity}
            onSelectCity={setCurrentCity}
            onNavigate={navigateTo}
          />
        )}

        {route.page === 'profile' && (
          <ProfilePage
            onNavigate={navigateTo}
          />
        )}

        {route.page === 'transactions' && (
          <TransactionsPage
            projectId={route.params.projectId || 'y-square'}
            cityId={route.params.cityId || currentCity}
            onNavigate={navigateTo}
          />
        )}

        {route.page === 'details' && (
          <TransactionDetailPage
            transactionId={route.params.transactionId || '11089052'}
            onNavigate={navigateTo}
          />
        )}

        {route.page === 'city' && (
          <CityPage
            cityId={route.params.cityId || currentCity}
            onNavigate={navigateTo}
          />
        )}

        {route.page === 'locality' && (
          <LocalityPage
            cityId={route.params.cityId || currentCity}
            localityId={route.params.localityId || 'saswad-road'}
            onNavigate={navigateTo}
          />
        )}

        {route.page === 'project' && (
          <ProjectPage
            cityId={route.params.cityId || currentCity}
            localityId={route.params.localityId || 'saswad-road'}
            projectId={route.params.projectId || 'heera-solitaire'}
            onNavigate={navigateTo}
          />
        )}
      </main>

      {/* Global Footer (Omitted on dedicated Auth page) */}
      {route.page !== 'signin' && <Footer onNavigate={navigateTo} />}

      {/* Floating Chat Assistant */}
      <ChatWidget />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
