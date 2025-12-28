import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Image } from 'lucide-react';
import { Button } from './ui/button';

// Desktop slideshow images
import image1 from '/1.jpg';
import image2 from '/2.jpg';
import image3 from '/3.jpg';

const images = [image1, image2, image3];

export function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        prevIndex => (prevIndex + 1) % images.length
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const scrollToGallery = () => {
    const gallery = document.getElementById('gallery');
    if (gallery) {
      gallery.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const changeBackground = () => {
    setCurrentImageIndex(
      prevIndex => (prevIndex + 1) % images.length
    );
  };

  return (
    <section
      id="home"
      className="relative h-screen w-full hidden md:flex items-center justify-center overflow-hidden"
    >

      {/* DESKTOP — Slideshow Background */}
      <div className="absolute inset-0 z-0">
        {images.map((image, index) => (
          <motion.img
            key={index}
            src={image}
            alt={`Hero Background ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            onContextMenu={e => e.preventDefault()}
            onDragStart={e => e.preventDefault()}
            draggable={false}
          />
        ))}

        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
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

          <p className="max-w-2xl mx-auto mb-8 text-white/90">
            Where every glance becomes a story and every story feels like cinema.
            <br />
            Crafting fine art wedding films and photographs that live forever.
          </p>

          <Button
            onClick={scrollToGallery}
            size="lg"
            className="bg-white text-black hover:bg-white/90 transition-all duration-300 px-8 py-6 group"
          >
            View Portfolio
            <ChevronDown className="ml-2 group-hover:translate-y-1 transition-transform" />
          </Button>
        </motion.div>
      </div>

      {/* DESKTOP ONLY — Change Background Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 right-8 z-10"
      >
        <Button
          onClick={changeBackground}
          size="lg"
          className="bg-white text-black hover:bg-white/90 transition-all duration-300 px-6 py-3 group"
        >
          <Image className="mr-2" size={18} />
          Change Background
        </Button>
      </motion.div>

      {/* SCROLL INDICATOR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
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
