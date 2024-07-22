import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WebChecker from '@/components/webchecker';

const HeroSection: React.FC = () => {
  const [dynamicText, setDynamicText] = useState('Predict Downtimes');
  const texts = ['Predict Downtimes', 'Visualise Downtimes', "AI-Powered Uptime", "Zero Downtime AI"];

  useEffect(() => {
    const interval = setInterval(() => {
      setDynamicText((prevText) => {
        const currentIndex = texts.indexOf(prevText);
        const nextIndex = (currentIndex + 1) % texts.length;
        return texts[nextIndex];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.heroSection} className="flex flex-col items-center text-center p-4">
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        className="text-7xl font-bold text-white leading-tight"
      >
        Prevent
        <br />
        downtime.
      </motion.h1>
      <AnimatePresence mode="wait">
        <motion.p
          key={dynamicText}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-xl text-gray-300 mt-6 font-bold max-w-xl"
        >
          {dynamicText}
        </motion.p>
      </AnimatePresence>
      <div style={{ marginTop: '80px' }}> {/* Adjust this value for spacing */}
        <WebChecker />
      </div>
    </div>
  );
};

const styles: { heroSection: React.CSSProperties } = {
  heroSection: {
    minHeight: '70vh', // Adjust this value to move the content up or down
    marginTop: '20vh', // Adjust this value to control the space above
  },
};

export default HeroSection;
