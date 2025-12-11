import { Instagram, Twitter, Facebook, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <div className="text-neutral-400 text-sm text-center md:text-left">
            © 2025 Jagdish Gavit Photography. All rights reserved.
            <span className="hidden sm:inline"> | Crafted with</span>
            <Heart className="inline mx-1 w-4 h-4 fill-red-500 text-red-500" />
            <span className="hidden sm:inline">and passion</span>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/jaguuz_photography_films/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-white hover:text-black flex items-center justify-center transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            {/* <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-white hover:text-black flex items-center justify-center transition-all duration-300"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-white hover:text-black flex items-center justify-center transition-all duration-300"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </a> */}
          </div>
        </div>

        {/* Additional Footer Text */}
        <div className="mt-8 pt-8 border-t border-neutral-800 text-center">
          <p className="text-neutral-500 text-sm">
            Capturing moments that last forever · Professional photography services
          </p>
        </div>
      </div>
    </footer>
  );
}
