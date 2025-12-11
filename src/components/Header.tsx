import { useState, useEffect } from 'react';
import { Menu, X, Cloud } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  onAdminClick?: () => void;
}

export function Header({ onAdminClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/95 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => scrollToSection('hero')}
            className="text-white tracking-widest cursor-pointer hover:opacity-80 transition-opacity"
          >
            JAGDISH GAVIT
          </motion.button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {['Home', 'Gallery', 'About', 'Contact'].map((item, index) => (
              <motion.button
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-white/80 hover:text-white transition-colors text-sm tracking-wide"
              >
                {item}
              </motion.button>
            ))}
            
            {/* Admin Cloud Icon */}
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              onClick={onAdminClick}
              className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              title="Admin Panel"
            >
              <Cloud size={20} />
            </motion.button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onAdminClick}
              className="text-white/60 hover:text-white transition-colors p-2"
              title="Admin Panel"
            >
              <Cloud size={20} />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/40 backdrop-blur-xl border-t border-white/10">
          <nav className="container mx-auto px-6 py-4 flex flex-col gap-1">
            {['Home', 'Gallery', 'About', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-white hover:text-white hover:bg-white/10 transition-colors text-left py-2.5 px-3 rounded text-sm"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
