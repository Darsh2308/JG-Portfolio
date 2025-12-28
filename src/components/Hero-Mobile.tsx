import { useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import mobileBg from '../assets/mobile-bg.jpeg';

const MOBILE_HEADER_HEIGHT = 72;

export function HeroMobile() {
  useEffect(() => {
    const setVH = () => {
      document.documentElement.style.setProperty(
        '--vh',
        `${window.innerHeight * 0.01}px`
      );
    };

    setVH();
    window.addEventListener('resize', setVH);
    return () => window.removeEventListener('resize', setVH);
  }, []);

  const scrollToGallery = () => {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;

    window.scrollTo({
      top: gallery.offsetTop,
      behavior: 'smooth',
    });
  };

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden md:hidden"
      style={{ minHeight: 'calc(var(--vh) * 100)' }}
    >
      {/* BACKGROUND */}
      <img
        src={mobileBg}
        alt="Hero Mobile Background"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/50" />

      {/* TEXT BLOCK (OFFSET FROM FIXED HEADER) */}
      <div
        className="relative z-10 flex justify-center px-4 text-center text-white"
        style={{
          paddingTop: `calc(${MOBILE_HEADER_HEIGHT}px + env(safe-area-inset-top) + 1rem)`,
        }}
      >
        <motion.div
          className="max-w-[22rem]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="mb-4 leading-tight tracking-wider">
            CAPTURING MOMENTS,
            <br />
            CREATING MEMORIES
          </h1>

          <p className="text-sm leading-relaxed text-white/90">
            Where every glance becomes a story and every story feels like cinema.
            Crafting fine art wedding films and photographs that live forever.
          </p>
        </motion.div>
      </div>

      {/* CTA BUTTON */}
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
          className="group bg-white px-8 py-6 text-black hover:bg-white/90"
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
