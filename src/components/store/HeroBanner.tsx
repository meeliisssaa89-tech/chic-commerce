import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useBanners } from "@/hooks/useSupabaseData";

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const { data: banners = [] } = useBanners();

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) {
    return (
      <div className="w-full h-[60vh] md:h-[75vh] bg-secondary flex items-center justify-center">
        <p className="text-muted-foreground">لا توجد بانرات — أضف بانرات من لوحة التحكم</p>
      </div>
    );
  }

  const goTo = (index: number) => setCurrent(index);
  const goPrev = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  const goNext = () => setCurrent((prev) => (prev + 1) % banners.length);

  return (
    <div className="relative w-full h-[60vh] md:h-[75vh] bg-secondary overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            backgroundImage: `url(${banners[current]?.image_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-charcoal/40" />
          <div className="relative z-10 text-center px-4">
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-display text-4xl md:text-6xl font-bold text-cream mb-4"
            >
              {banners[current]?.title_ar}
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg md:text-xl text-cream/90"
            >
              {banners[current]?.subtitle_ar}
            </motion.p>
            {banners[current]?.link && (
              <motion.a
                href={banners[current].link!}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-8 inline-block bg-accent text-accent-foreground px-8 py-3 font-bold text-sm tracking-wider hover:bg-gold-dark transition-colors"
              >
                تسوق الآن
              </motion.a>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <button onClick={goPrev} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/30 backdrop-blur-sm p-2 rounded-full hover:bg-background/60 transition-colors">
        <ChevronRight className="w-5 h-5 text-cream" />
      </button>
      <button onClick={goNext} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/30 backdrop-blur-sm p-2 rounded-full hover:bg-background/60 transition-colors">
        <ChevronLeft className="w-5 h-5 text-cream" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? "bg-accent w-8" : "bg-cream/50"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
