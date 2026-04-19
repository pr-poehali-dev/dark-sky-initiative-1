import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "50vh"]);

  return (
    <div
      ref={container}
      className="relative flex items-center justify-center h-screen overflow-hidden"
    >
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-full"
      >
        <img
          src="/images/mountain-landscape.jpg"
          alt="Mountain landscape"
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="relative z-10 text-center text-white">
        <p className="text-sm uppercase tracking-widest mb-4 opacity-70">Пермский край · 1975–2025</p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
          РЕКОРДЫ
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto px-6 opacity-90">
          16 климатических рекордов и мистических мест на интерактивной карте
        </p>
        <a href="#map" className="mt-8 inline-block px-8 py-3 border border-white text-white uppercase text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300 cursor-pointer">
          Открыть карту
        </a>
      </div>
    </div>
  );
}