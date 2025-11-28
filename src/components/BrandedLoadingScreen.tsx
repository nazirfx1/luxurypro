import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

interface BrandedLoadingScreenProps {
  isLoading: boolean;
  progress: number;
}

const BrandedLoadingScreen = ({ isLoading, progress }: BrandedLoadingScreenProps) => {
  if (!isLoading) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-brand-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Logo and loading animation */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.6,
            ease: [0.23, 1, 0.32, 1],
          }}
        >
          <motion.img
            src={logo}
            alt="Luxury Pro"
            className="w-48 h-48 object-contain"
            animate={{
              filter: [
                "drop-shadow(0 0 20px rgba(234, 179, 8, 0.3))",
                "drop-shadow(0 0 40px rgba(234, 179, 8, 0.6))",
                "drop-shadow(0 0 20px rgba(234, 179, 8, 0.3))",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Loading dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 rounded-full bg-brand-yellow"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2,
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-64 mt-4">
          <div className="relative h-1.5 bg-brand-yellow/20 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-yellow via-brand-yellow to-yellow-400 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
          </div>
          
          {/* Progress percentage */}
          <motion.p
            className="text-brand-yellow/70 text-xs text-center mt-2 font-medium"
            key={progress}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {Math.round(progress)}%
          </motion.p>
        </div>

        {/* Loading text */}
        <motion.p
          className="text-brand-yellow font-medium text-sm tracking-wider mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Loading Luxury Experience...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default BrandedLoadingScreen;
