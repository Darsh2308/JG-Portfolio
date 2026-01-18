import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Play, Grid, List } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { useGallery } from './GalleryContext';

export function Gallery() {
  const { galleryItems, categories, isLoading } = useGallery();
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter items by category - only show items from selected category
  const filteredItems = selectedCategory !== null
    ? galleryItems.filter(item => item.categoryId === selectedCategory)
    : []; // Show empty state until a category is selected

  // Get visible items based on visibleCount
  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  // Set default category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && selectedCategory === null) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    // Pause video if it's playing
    if (selectedImageIndex !== null) {
      const video = videoRefs.current[selectedImageIndex];
      if (video) {
        video.pause();
      }
    }
    setSelectedImageIndex(null);
  };

  // Play video when lightbox opens
  useEffect(() => {
    if (selectedImageIndex !== null && filteredItems[selectedImageIndex]?.type === 'video') {
      const video = videoRefs.current[selectedImageIndex];
      if (video) {
        video.play();
      }
    }
  }, [selectedImageIndex, filteredItems]);

  const navigateImage = (newDirection: number) => {
    if (selectedImageIndex === null || isAnimating) return;
    
    setIsAnimating(true);
    setDirection(newDirection);
    const newIndex = selectedImageIndex + newDirection;
    
    if (newIndex >= 0 && newIndex < filteredItems.length) {
      setSelectedImageIndex(newIndex);
    } else if (newIndex < 0) {
      setSelectedImageIndex(filteredItems.length - 1);
    } else {
      setSelectedImageIndex(0);
    }
  };

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setVisibleCount(12); // Reset to initial count when changing category
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="mb-4 tracking-wider">PORTFOLIO</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            A curated collection of my finest work, capturing the beauty of the
            world through my lens.
          </p>
        </motion.div>

        {/* Category Filter and View Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          {/* Categories Container with Horizontal Scroll */}
          <div className="relative w-full overflow-hidden">
            <div className="overflow-x-auto scrollbar-hide touch-pan-x" style={{ scrollBehavior: 'smooth', overflowY: 'hidden' }}>
              <div className="flex items-center gap-3 pb-2" style={{ width: 'max-content' }}>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-6 py-2 rounded-full transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                      selectedCategory === category.id
                        ? 'bg-black text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* View Mode Toggle - Mobile Only */}
          <div className="mt-4 sm:hidden" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <div className="flex gap-1.5 flex-shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-black text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
                aria-label="Grid view"
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-black text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
                aria-label="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            <p className="text-neutral-600 mt-4">Loading gallery...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-neutral-500">No items found</p>
            {selectedCategory === null && (
              <p className="text-neutral-400 text-sm mt-2">
                Loading categories...
              </p>
            )}
          </div>
        )}

        {/* Gallery Grid - Masonry Layout (Desktop) or List/Grid (Mobile) */}
        {!isLoading && filteredItems.length > 0 && (
          <>
            {/* Desktop - Always Masonry Grid */}
            <div className="hidden sm:block">
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                {visibleItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="relative overflow-hidden cursor-pointer group break-inside-avoid mb-4"
                    onClick={() => openLightbox(index)}
                  >
                    {item.type === 'image' ? (
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 select-none"
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                        draggable={false}
                      />
                    ) : (
                      <div className="relative w-full">
                        <video
                          src={item.src}
                          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 select-none"
                          muted
                          onContextMenu={(e) => e.preventDefault()}
                          onDragStart={(e) => e.preventDefault()}
                          draggable={false}
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                            <Play className="text-black ml-1" size={28} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 pointer-events-none" />
                    {/* Invisible protection overlay */}
                    <div className="absolute inset-0 z-10" onContextMenu={(e) => e.preventDefault()} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile - List or Grid View */}
            <div className="sm:hidden">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 gap-2">
                  {visibleItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="relative overflow-hidden cursor-pointer group aspect-square"
                      onClick={() => openLightbox(index)}
                    >
                      {item.type === 'image' ? (
                        <img
                          src={item.src}
                          alt={item.alt}
                          className="w-full h-full object-cover transition-transform duration-500 select-none"
                          onContextMenu={(e) => e.preventDefault()}
                          onDragStart={(e) => e.preventDefault()}
                          draggable={false}
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          <video
                            src={item.src}
                            className="w-full h-full object-cover transition-transform duration-500 select-none"
                            muted
                            onContextMenu={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                            draggable={false}
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                              <Play className="text-black ml-0.5" size={20} />
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 pointer-events-none" />
                      {/* Invisible protection overlay */}
                      <div className="absolute inset-0 z-10" onContextMenu={(e) => e.preventDefault()} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col space-y-6">
                  {visibleItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="relative cursor-pointer group w-full"
                      onClick={() => openLightbox(index)}
                    >
                      {item.type === 'image' ? (
                        <img
                          src={item.src}
                          alt={item.alt}
                          className="w-full h-auto object-cover transition-transform duration-500 select-none rounded-lg"
                          onContextMenu={(e) => e.preventDefault()}
                          onDragStart={(e) => e.preventDefault()}
                          draggable={false}
                        />
                      ) : (
                        <div className="relative w-full rounded-lg overflow-hidden">
                          <video
                            src={item.src}
                            className="w-full h-auto object-cover transition-transform duration-500 select-none"
                            muted
                            onContextMenu={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                            draggable={false}
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                              <Play className="text-black ml-1" size={28} />
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="mt-3 px-1">
                        <p className="text-sm text-neutral-600">{item.alt}</p>
                      </div>
                      {/* Invisible protection overlay */}
                      <div className="absolute inset-0 z-10 rounded-lg" onContextMenu={(e) => e.preventDefault()} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* View More Button */}
            {hasMore && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center mt-12"
              >
                <Button
                  onClick={loadMore}
                  className="bg-black hover:bg-neutral-800 text-white px-8 py-6"
                  size="lg"
                >
                  View More
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-7xl w-full bg-black/95 border-none p-0 overflow-hidden">
          <DialogTitle className="sr-only">
            {selectedImageIndex !== null ? filteredItems[selectedImageIndex]?.alt : 'Gallery'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Use arrow keys or buttons to navigate between items. Press escape to close.
          </DialogDescription>
          <div className="relative w-full h-[90vh] flex items-center justify-center" onContextMenu={(e) => e.preventDefault()}>
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-50 text-white/80 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>

            {/* Previous Button */}
            <button
              onClick={() => navigateImage(-1)}
              className="absolute left-4 z-50 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
            >
              <ChevronLeft size={40} />
            </button>

            {/* Next Button */}
            <button
              onClick={() => navigateImage(1)}
              className="absolute right-4 z-50 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
            >
              <ChevronRight size={40} />
            </button>

            {/* Image/Video Container with Protection */}
            <div className="relative flex items-center justify-center max-w-full max-h-full">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                {selectedImageIndex !== null && filteredItems[selectedImageIndex] && (
                  filteredItems[selectedImageIndex].type === 'image' ? (
                    <motion.img
                      key={selectedImageIndex}
                      src={filteredItems[selectedImageIndex].src}
                      alt={filteredItems[selectedImageIndex].alt}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: 'tween', duration: 0.3, ease: 'easeInOut' },
                        opacity: { duration: 0.2 },
                      }}
                      onAnimationComplete={() => setIsAnimating(false)}
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                      draggable={false}
                      className="max-w-full max-h-full object-contain select-none"
                      style={{ pointerEvents: 'none' }}
                    />
                  ) : (
                    <motion.video
                      key={selectedImageIndex}
                      ref={(el) => {
                        videoRefs.current[selectedImageIndex] = el;
                      }}
                      src={filteredItems[selectedImageIndex].src}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: 'tween', duration: 0.3, ease: 'easeInOut' },
                        opacity: { duration: 0.2 },
                      }}
                      onAnimationComplete={() => setIsAnimating(false)}
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                      draggable={false}
                      className="max-w-full max-h-full object-contain select-none"
                      controls
                      autoPlay
                    />
                  )
                )}
              </AnimatePresence>
              {/* Invisible overlay to prevent interaction with image */}
              <div 
                className="absolute inset-0 z-10" 
                onContextMenu={(e) => e.preventDefault()}
                style={{ cursor: 'default' }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
