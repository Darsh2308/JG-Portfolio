import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroWrapper } from './components/HeroWrapper';
import { Gallery } from './components/Gallery';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { GalleryProvider, useGallery } from './components/GalleryContext';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const [currentView, setCurrentView] = useState<'main' | 'login' | 'dashboard'>('main');

  // Register service worker for caching
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch((error) => {
            console.log('ServiceWorker registration failed: ', error);
          });
      });
    }
  }, []);

  // Prevent image downloads globally
  useEffect(() => {
    // Disable right-click on images and videos
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
        e.preventDefault();
        return false;
      }
    };

    // Disable common save shortcuts (Ctrl+S, Cmd+S)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+S / Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        return false;
      }
      // Prevent Ctrl+Shift+S / Cmd+Shift+S
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 's') {
        e.preventDefault();
        return false;
      }
    };

    // Disable drag and drop of images
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  const handleAdminClick = () => {
    // Always show login screen when admin icon is clicked
    setCurrentView('login');
  };

  const handleLoginSuccess = () => {
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentView('main');
  };

  if (currentView === 'login') {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentView === 'dashboard') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen">
      <Header onAdminClick={handleAdminClick} />
      <main>
        <HeroWrapper />
        <Gallery />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <GalleryProvider>
      <AppContent />
      <Toaster position="top-right" />
    </GalleryProvider>
  );
}
