import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon, Loader2, X, Maximize2, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GalleryFile {
  id: string;
  title: string;
  imageUrl: string;
}

const CAMPUS_IMAGES: GalleryFile[] = [
  {
    id: "1hb8-UQpvWPFLgAOaocIgLCT7_3rCP9bt",
    title: "NBI Graduation Celebration",
    imageUrl: "https://lh3.googleusercontent.com/drive-storage/AJQWtBOjJam33cgJcaemTo8sAxkm0U7jaqWMFG_-ESY693H6ToVCOrB9HOcX6ySlHpnAGfi1ClC1-P7f7JAnXXIeZc5s4_IkxVs2rt4NlGSG=s1000"
  },
  {
    id: "1YF28DsE4PmoGm9HGlvhcfY2T9-Pzb5bO",
    title: "NBI Cohort Group Photo",
    imageUrl: "https://lh3.googleusercontent.com/drive-storage/AJQWtBPDT2qluOrjRbwSjK8F4hxSYC5TvpKlVd-qdFJuSID-nkYHqvJ_dVthjrDGdAr7u7uKisWptiots_JbjZL-uyubXiWER7YUKbrLAcCQ=s1000"
  },
  {
    id: "1u4s35M7q3A-Pj57U3IJAEh6l3nZeh-kO",
    title: "Graduation Convocation",
    imageUrl: "https://lh3.googleusercontent.com/drive-storage/AJQWtBMzVijqWot4kRQ-k8YP0I_Eaf7Y436aiGBGHCWhOE7Mltu1XobGmnkiwQ5aUlyv27B29Luy4XdVWQeT_ny3zijEabhDG3DkNR9w-R6F=s1000"
  },
  {
    id: "1_09ECBfvHgxp2FjcFiajtgmUCjQaZH6v",
    title: "NBI Academic Procession",
    imageUrl: "https://lh3.googleusercontent.com/drive-storage/AJQWtBNpXxaYqud790huKvlzovQuAbaPqFVSOCdVocdoitIK8oIlPkK7zSNmEJ58WmxUv23cuTMh88pZSfTXUKrKFBmlV9rTTPm_buR9M6Ik=s1000"
  },
  {
    id: "16CFNiK4JWT7O4zroZ5JSdPPhmW-O0rOM",
    title: "Student Presentation Ceremony",
    imageUrl: "https://lh3.googleusercontent.com/drive-storage/AJQWtBM4JZ18XWfXT-cLylsb3sK_zfTNIbY7TP-Bv3IAt5WdUX1EAli3wW4CgrtwkLmuL9BCSQUrQvFGiGhLIeCmqBa4AeHpxpo0MLtwu5TU=s1000"
  },
  {
    id: "1Gn1RQ0zfMbgIRk0-bbkmqVNlReY8UiAI",
    title: "Graduates and Faculty Fellowship",
    imageUrl: "https://lh3.googleusercontent.com/drive-storage/AJQWtBO9Wmrgx8Y59msncvDkmnCtIywvdM344tKaY_7LIOXWxVodCjQktGyqLr-Uk-hRSQg-IeoUc8ph71lgUBZkxF8bNOzXDXQvwHquK6IH=s1000"
  },
  {
    id: "12_paXBmEqhILs3OMCFssLRnXTOfxnhF6",
    title: "Honored Graduates Presentation",
    imageUrl: "https://lh3.googleusercontent.com/drive-storage/AJQWtBOjght0A4mkGoJY3NkdY8TxdqDU8-GIQNwwJ7LX0DV9l4ci_C28pzGjg6X1vTqLiTJwsWuAJc_THMXn-Acx7lxoDJEOK7MswQeC4Y6p=s1000"
  },
  {
    id: "1RPWu0-yvU4flg09BGiAloSqB5UHj3yF2",
    title: "NBI Convocation Address",
    imageUrl: "https://lh3.googleusercontent.com/drive-storage/AJQWtBM9eGxcrZQDUs4NW1JU5vujXT28IU4CHWdY12mmjtZTcpkD26MPHqi3cLXsXb44qPqvjDaNJiDfjF49KAEhINsIa4RWW4o_wTwE8kJm=s1000"
  },
  {
    id: "1u3uo0gtHYIhJ91RJethfhmLs0BaAcIpS",
    title: "Academic Commissioning",
    imageUrl: "https://lh3.googleusercontent.com/drive-storage/AJQWtBPNi2hNG9VyH5YeAtTo0F1AY-dEClErPyceGOLOdn84W4xkOctZE1FdbvnF3I0asf-C-Ae7cNaJ71srqR6NUzKtdmnq59EbVyLio8iZ=s1000"
  },
  {
    id: "1OcmJ3tuuzEXSQE6glHwNgVVAmNRCrnY-",
    title: "Graduates Group Fellowship",
    imageUrl: "https://lh3.googleusercontent.com/drive-storage/AJQWtBPFqfB2TdBPO2iESng-1rGK0txuwgrKkPon6we-jHK2qCRMpAFXhAMS2jCjhICt8HSy8kAi4PW5wDB5gJteZqy7sIgot9gkR6ZgbMu5=s1000"
  },
  {
    id: "196J2H6uA-UvBdNZ4vhBwmgFqh5iMy6CE",
    title: "Graduates Fellowship Banquet",
    imageUrl: "https://lh3.googleusercontent.com/drive-storage/AJQWtBONTWCvu1OxWtjYaSiTHWYsy0V0k_qsQKgoNVTuhxtz2gEWubUB5lok1ZbIHwYowQxHyc0i8HYi0_l7Pjtgl9-pMML9CaN68GGA4Int=s1000"
  },
  {
    id: "1SXEt5P4_tUoTflaxFdKNnhTJ1tJg1shI",
    title: "Commencement Cap Presentation",
    imageUrl: "https://lh3.googleusercontent.com/drive-storage/AJQWtBMRoyC1-na9-Ou_n6UyDt2Qmh2zUSYsrBNW5LKE45ypDD6Pvu1ClahQp5k3wRSbt3OtmAvfigByqvjR_9zKPJRLrZBbUW-D60LG73st=s1000"
  },
  {
    id: "1SUK8_X5p1Q_7s7VYzEsWjplAIVdQL_7H",
    title: "Faculty and Board Members",
    imageUrl: "https://lh3.googleusercontent.com/drive-storage/AJQWtBPJ4TjtoODH_kYVPT8lWw_DancixSMkEAWC3n0RVkvOAfBmt8eH89RJ6aC0dwXt1ntbpZR_PhlsyBPy6hYbfpmI3VYsBteGuCZRX0La=s1000"
  }
];

export default function ImageGallery() {
  const [images, setImages] = useState<GalleryFile[]>(CAMPUS_IMAGES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<GalleryFile | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch images from the live backend Google Drive proxy, with a graceful local fallback
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const apiBase = (import.meta as any).env.VITE_API_URL || "/api";
        const fetchUrl = apiBase.endsWith("/api") ? `${apiBase}/drive-gallery` : `${apiBase}/api/drive-gallery`;
        const res = await fetch(fetchUrl);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data.success && Array.isArray(data.files) && data.files.length > 0) {
          setImages(data.files);
          setError(null);
        } else {
          throw new Error(data.message || "Invalid response format from server");
        }
      } catch (err: any) {
        console.warn(
          "Could not load live Google Drive gallery. Falling back to default campus photos.",
          err.message
        );
        // Seamless fallback to pre-packaged campus images so the UI is always beautiful
        setImages(CAMPUS_IMAGES);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // Handle auto-playing carousel scroll
  useEffect(() => {
    if (!isAutoPlaying || images.length === 0 || loading) {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      handleNext();
    }, 4000);

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isAutoPlaying, images, loading, activeIndex]);

  const handlePrev = () => {
    if (images.length === 0) return;
    const newIndex = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    if (images.length === 0) return;
    const newIndex = activeIndex === images.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const scrollToIndex = (index: number) => {
    const container = carouselRef.current;
    if (!container) return;

    const cards = container.querySelectorAll(".gallery-card-item");
    if (cards && cards[index]) {
      const card = cards[index] as HTMLElement;
      container.scrollTo({
        left: card.offsetLeft - container.offsetLeft - (container.clientWidth - card.clientWidth) / 2,
        behavior: "smooth"
      });
    }
  };

  const handleScroll = () => {
    const container = carouselRef.current;
    if (!container || images.length === 0) return;

    // Detect active card in center of container
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    const cards = container.querySelectorAll(".gallery-card-item");
    
    let closestIndex = 0;
    let minDistance = Infinity;

    cards.forEach((card, idx) => {
      const element = card as HTMLElement;
      const cardCenter = element.offsetLeft + element.clientWidth / 2;
      const distance = Math.abs(cardCenter - containerCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  };

  return (
    <section id="gallery-section" className="py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden border-t border-slate-200/50 dark:border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 space-y-4 md:space-y-0">
          <div className="space-y-3 max-w-2xl">
            <span className="px-3 py-1 bg-brand-blue/10 dark:bg-brand-accent/20 text-brand-blue dark:text-brand-gold text-xs font-extrabold uppercase tracking-widest rounded-md inline-block">
              Campus Life
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-blue dark:text-white tracking-tight">
              NBI Campus Photo Gallery
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-bold">
              Explore dynamic moments captured on campus. Catch a glimpse of graduation ceremonies, active learning, theological research, and fellowship.
            </p>
          </div>

          {/* Carousel Navigation Buttons */}
          {images.length > 0 && (
            <div className="flex items-center space-x-3 self-start md:self-end">
              <button
                id="gallery-btn-autoplay"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={`px-4 py-2 text-xs font-extrabold rounded-full border transition-all duration-300 cursor-pointer ${
                  isAutoPlaying
                    ? "bg-brand-blue/10 text-brand-blue border-brand-blue/20 dark:bg-brand-accent/20 dark:text-brand-gold dark:border-brand-accent/30"
                    : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800"
                }`}
              >
                {isAutoPlaying ? "⏸ Pause Autoplay" : "▶ Resume Autoplay"}
              </button>
              
              <button
                id="gallery-btn-prev"
                onClick={() => {
                  setIsAutoPlaying(false);
                  handlePrev();
                }}
                className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:-translate-x-0.5 transition-all shadow-sm cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                id="gallery-btn-next"
                onClick={() => {
                  setIsAutoPlaying(false);
                  handleNext();
                }}
                className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:translate-x-0.5 transition-all shadow-sm cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Gallery Carousel Container */}
        {loading ? (
          <div className="h-80 flex flex-col items-center justify-center space-y-4 bg-white dark:bg-slate-900/20 rounded-3xl border border-slate-200/60 dark:border-slate-900">
            <Loader2 className="w-10 h-10 text-brand-blue dark:text-brand-gold animate-spin" />
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold animate-pulse">
              Fetching live assets from Google Drive...
            </p>
          </div>
        ) : error ? (
          <div className="h-80 flex flex-col items-center justify-center p-6 text-center bg-red-50 dark:bg-red-950/10 rounded-3xl border border-red-100 dark:border-red-950/40">
            <ImageIcon className="w-12 h-12 text-red-400 dark:text-red-500/60 mb-3" />
            <p className="text-base font-extrabold text-red-800 dark:text-red-400 mb-2">
              Failed to load Drive Gallery
            </p>
            <p className="text-xs text-red-600 dark:text-red-500/80 max-w-md font-bold">
              {error}
            </p>
          </div>
        ) : images.length === 0 ? (
          <div className="h-80 flex flex-col items-center justify-center p-6 text-center bg-slate-100 dark:bg-slate-900/30 rounded-3xl border border-slate-200 dark:border-slate-800">
            <ImageIcon className="w-12 h-12 text-slate-400 mb-3" />
            <p className="text-base font-extrabold text-slate-700 dark:text-slate-300">
              No images found
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 max-w-xs font-bold mt-1">
              No compatible images were detected inside the specified Google Drive folder.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Horizontal sliding viewport */}
            <div
              id="gallery-scroll-container"
              ref={carouselRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto scrollbar-none snap-x snap-mandatory gap-6 pb-8 pt-4 px-4 -mx-4 scroll-smooth"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {images.map((img, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <div
                    key={img.id}
                    className="gallery-card-item flex-none w-[280px] sm:w-[360px] md:w-[420px] snap-center transition-all duration-500"
                    style={{ perspective: "1000px" }}
                  >
                    <motion.div
                      className={`relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border transition-all duration-500 select-none shadow-md ${
                        isActive
                          ? "border-brand-blue dark:border-brand-gold scale-[1.02] shadow-xl z-10"
                          : "border-slate-200/80 dark:border-slate-800 scale-95 opacity-70 hover:opacity-100 hover:scale-[0.97]"
                      }`}
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      {/* Image Frame */}
                      <div className="relative h-60 sm:h-72 overflow-hidden group cursor-pointer" onClick={() => setLightboxImage(img)}>
                        <img
                          src={img.imageUrl}
                          alt={img.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                          <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white scale-90 group-hover:scale-100 transition-transform duration-300">
                            <Maximize2 className="w-5 h-5" />
                          </div>
                        </div>
                      </div>

                      {/* Info Bar */}
                      <div className="p-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                        <div className="truncate pr-4">
                          <h4 className="text-sm font-extrabold text-slate-800 dark:text-white truncate">
                            {img.title}
                          </h4>
                          <span className="text-[10px] font-black text-brand-accent dark:text-brand-gold uppercase tracking-widest block mt-0.5">
                            NBI Campus Life
                          </span>
                        </div>
                        <a
                          href={img.imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-slate-400 hover:text-brand-blue dark:hover:text-brand-gold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="View original image"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            {/* Pagination/Scroll indicator dots */}
            <div className="flex justify-center items-center space-x-2 mt-4">
              {images.map((_, idx) => (
                <button
                  id={`gallery-dot-${idx}`}
                  key={idx}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setActiveIndex(idx);
                    scrollToIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeIndex
                      ? "w-8 bg-brand-blue dark:bg-brand-gold"
                      : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Immersive Dark Modal Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setLightboxImage(null)}
          >
            {/* Close Button */}
            <button
              id="lightbox-btn-close"
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 z-55 hover:scale-105 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Lightbox Card */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl z-51"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-[65vh] md:h-[75vh] w-full bg-slate-950">
                <img
                  src={lightboxImage.imageUrl}
                  alt={lightboxImage.title}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Bottom detail header */}
              <div className="p-6 bg-slate-900 flex items-center justify-between border-t border-white/5">
                <div>
                  <h3 className="text-lg font-extrabold text-white">
                    {lightboxImage.title}
                  </h3>
                  <span className="text-xs text-brand-gold font-bold uppercase tracking-wider block mt-1">
                    Naioth Bible Institute
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <a
                    href={lightboxImage.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/10 text-xs font-extrabold cursor-pointer"
                  >
                    <span>View original</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
