import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

// Desktop background image
import image1 from '../assets/1.jpg';

export function Hero() {
  const scrollToGallery = () => {
    const gallery = document.getElementById('gallery');
    if (gallery) {
      gallery.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative hidden h-screen w-full overflow-hidden md:flex"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img
          src={image1}
          alt="Hero Background"
          className="h-full w-full object-cover select-none"
          draggable={false}
          onContextMenu={e => e.preventDefault()}
          onDragStart={e => e.preventDefault()}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* TEXT BLOCK */}
      <div className="relative z-10 flex w-full justify-center text-center text-white">
        <motion.div
          className="max-w-3xl"
          style={{ marginTop: '13vh' }} // 👈 move text UP (smaller = higher)
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="mb-6 tracking-wider">
            CAPTURING MOMENTS,
            <br />
            CREATING MEMORIES
          </h1>

          <p className="text-white/90">
            Where every glance becomes a story and every story feels like cinema.
            <br />
            Crafting fine art wedding films and photographs that live forever.
          </p>
        </motion.div>
      </div>

      {/* CTA BUTTON */}
      <motion.div
        className="absolute left-1/2 z-20 -translate-x-1/2"
        style={{ bottom: '3.5rem' }} // 👈 move button DOWN (smaller = lower)
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Button
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
        style={{ bottom: '2rem' }}
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
