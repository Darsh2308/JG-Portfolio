import { motion } from 'motion/react';
import pic1 from '../../pic1.JPG';

export function About() {
  return (
    <section id="about" className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 tracking-wider">ABOUT ME</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={pic1}
                alt="Jagdish Gavit - Photographer"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 select-none"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                draggable={false}
              />
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2 space-y-6"
          >
            <h3 className="tracking-wide">Hello, I'm Jagdish Gavit</h3>
            <div className="space-y-4 text-neutral-700">
              <p>
                The creative mind behind Jaguuz Photography & Films. I believe every story deserves to be told with heart, light, and emotion. My camera is more than a tool—it’s an eye that smiles, capturing real, authentic moments that speak louder than words. Each frame is crafted with purpose, reflecting not just what you see, but what you feel.
              </p>
              <p>
                From cinematic wedding tales to fine art portraits, I strive to create imagery that’s timeless and emotionally rich. Every detail, every glance, every fleeting second becomes part of something beautiful and honest. Based in Pune, Maharashtra, I travel wherever love and stories take me, transforming ordinary moments into unforgettable visual memories.
              </p>
              <p>
                Because for me, photography isn’t just about pictures—it’s about preserving emotions that last a lifetime.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-neutral-300">
              <div>
                <div className="text-neutral-900 mb-1">500+</div>
                <div className="text-sm text-neutral-600">Projects</div>
              </div>
              <div>
                <div className="text-neutral-900 mb-1">15+</div>
                <div className="text-sm text-neutral-600">Years</div>
              </div>
              <div>
                <div className="text-neutral-900 mb-1">50+</div>
                <div className="text-sm text-neutral-600">Awards</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
