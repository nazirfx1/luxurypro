import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface PropertyGalleryModalProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
  propertyTitle?: string;
}

const PropertyGalleryModal = ({
  images,
  isOpen,
  onClose,
  initialIndex = 0,
  propertyTitle,
}: PropertyGalleryModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [api, setApi] = useState<CarouselApi>();
  const [isZoomed, setIsZoomed] = useState(false);

  // Update carousel when initialIndex changes
  useEffect(() => {
    if (api && isOpen) {
      api.scrollTo(initialIndex);
      setCurrentIndex(initialIndex);
    }
  }, [api, initialIndex, isOpen]);

  // Listen to carousel changes
  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap());
      setIsZoomed(false);
    });
  }, [api]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handlePrevious = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const handleNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleThumbnailClick = (index: number) => {
    api?.scrollTo(index);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  if (!images || images.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full w-screen h-screen p-0 bg-black/95 border-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full flex flex-col"
        >
          {/* Header */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {propertyTitle && (
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    {propertyTitle}
                  </h2>
                )}
                <p className="text-sm text-white/70 mt-1">
                  {currentIndex + 1} / {images.length}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleZoom}
                  className="text-white hover:bg-white/20 transition-colors"
                >
                  {isZoomed ? (
                    <ZoomOut className="w-5 h-5" />
                  ) : (
                    <ZoomIn className="w-5 h-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/20 transition-colors"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Main Image Carousel */}
          <div className="flex-1 flex items-center justify-center relative px-16 py-20">
            <Carousel
              setApi={setApi}
              className="w-full h-full"
              opts={{
                loop: true,
                skipSnaps: false,
              }}
            >
              <CarouselContent className="h-full">
                {images.map((image, index) => (
                  <CarouselItem key={index} className="h-full flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {currentIndex === index && (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ 
                            opacity: 1, 
                            scale: isZoomed ? 1.5 : 1,
                            transition: {
                              scale: { duration: 0.3 },
                              opacity: { duration: 0.4 }
                            }
                          }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                          className={`relative max-w-full max-h-full ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                          onClick={toggleZoom}
                        >
                          <img
                            src={image}
                            alt={`Property image ${index + 1}`}
                            className="max-w-full max-h-[80vh] object-contain select-none"
                            draggable={false}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <motion.button
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all hover:scale-110"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-8 h-8" />
                </motion.button>

                <motion.button
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all hover:scale-110"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-8 h-8" />
                </motion.button>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/80 to-transparent p-6"
            >
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {images.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden transition-all ${
                      currentIndex === index
                        ? "ring-2 ring-primary scale-105"
                        : "opacity-50 hover:opacity-100"
                    }`}
                    whileHover={{ scale: currentIndex === index ? 1.05 : 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {currentIndex === index && (
                      <motion.div
                        layoutId="activeThumbnail"
                        className="absolute inset-0 border-2 border-primary rounded-lg"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Touch/Swipe Instructions for Mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none md:hidden"
          >
            <div className="text-white/40 text-sm text-center">
              Swipe to navigate
            </div>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyGalleryModal;