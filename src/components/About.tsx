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
                For over 8+ years, photography has been my way of preserving reality in its purest form. As a professional photographer and editor, I believe the most powerful images are created when nature, light, and emotion come together naturally.              </p>
              <p>
                My work focuses on original, unfiltered moments, enhanced through thoughtful editing while respecting the authenticity of each scene. Whether it’s landscapes, people, or real-life moments, I strive to create images that feel honest, timeless, and meaningful.              
              </p>
              <p>Photography is not just my profession—it’s my passion, my perspective, and my way of telling stories that last beyond the moment.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-neutral-300">
              <div>
                <div className="text-neutral-900 mb-1">150+</div>
                <div className="text-sm text-neutral-600">Projects</div>
              </div>
              <div>
                <div className="text-neutral-900 mb-1">8+</div>
                <div className="text-sm text-neutral-600">Years</div>
              </div>
              {/* <div>
                <div className="text-neutral-900 mb-1">50+</div>
                <div className="text-sm text-neutral-600">Awards</div>
              </div> */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
