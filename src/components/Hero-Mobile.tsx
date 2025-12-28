import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import mobileBg from '../assets/mobile-bg.jpeg';

export function HeroMobile() {
  const scrollToGallery = () => {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;

    // 1. Try known scroll container first
    const scrollRoot =
      document.getElementById('scroll-root') ||
      document.querySelector('[data-scroll-container]');

    if (scrollRoot) {
      const top =
        gallery.getBoundingClientRect().top + scrollRoot.scrollTop;

      scrollRoot.scrollTo({
        top,
        behavior: 'smooth',
      });

      return;
    }

    // 2. Fallback: window scrolling
    const y =
      gallery.getBoundingClientRect().top + window.pageYOffset;

    if (y !== 0) {
      window.scrollTo({
        top: y,
        behavior: 'smooth',
      });
      return;
    }

    // 3. Last-resort fallback (always works)
    window.location.hash = 'gallery';
  };

  return (
    <section
      id="home"
      className="relative h-screen w-full overflow-hidden md:hidden"
    >
      {/* BACKGROUND */}
      <img
        src={mobileBg}
        alt="Hero Mobile Background"
        className="absolute inset-0 h-full w-full object-cover select-none"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      />

      <div className="absolute inset-0 bg-black/50" />

      {/* CENTER TEXT */}
      <div className="relative z-10 flex h-full items-center justify-center px-4 pb-32 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="mb-6 tracking-wider">
            CAPTURING MOMENTS,
            <br />
            CREATING MEMORIES
          </h1>

          <p className="mx-auto max-w-2xl text-white/90">
            Where every glance becomes a story and every story feels like cinema.
            <br />
            Crafting fine art wedding films and photographs that live forever.
          </p>
        </motion.div>
      </div>
      {/* VIEW PORTFOLIO BUTTON */}
      <motion.div
        className="absolute left-1/2 z-30 -translate-x-1/2"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 3.5rem)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Button
          type="button"
          onClick={scrollToGallery}
          size="lg"
          className="group bg-white px-8 py-6 text-black transition-all hover:bg-white/90"
        >
          View Portfolio
          <ChevronDown className="ml-2 transition-transform group-hover:translate-y-1" />
        </Button>
      </motion.div>

      {/* SCROLL INDICATOR */}
      <motion.div
        className="absolute left-1/2 z-20 -translate-x-1/2"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="text-white/60" size={32} />
        </motion.div>
      </motion.div>
    </section>
  );
}
