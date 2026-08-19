import React, { useState } from 'react';
import { Pack, ThemeConfig } from '../../types';
import { Eye, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
interface PackShowcaseProps {
  packs: Pack[];
  currentTheme: ThemeConfig;
  onSelectPack: (pack: Pack) => void;
}

export const PackShowcase: React.FC<PackShowcaseProps> = ({
  packs,
  onSelectPack
}) => {
  const [activeModalPack, setActiveModalPack] = useState<Pack | null>(null);

  return (
    <section id="packs-showcase" className="relative py-32 px-4 max-w-7xl mx-auto flex flex-col items-center pointer-events-none">
      
      <div className="text-center mb-20 pointer-events-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-2xl sm:text-3xl md:text-4xl font-darker font-medium tracking-[0.1em] uppercase text-theme-text opacity-90"
        >
          Les Collections
        </motion.h2>
      </div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } }
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-6xl pointer-events-auto"
      >
        {packs.filter(p => p.isActive).map((pack) => {
          return (
            <GlassCard 
              key={pack.id} 
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
              }}
              className="group flex flex-col justify-between p-8 h-full"
              glowColor="var(--theme-primary-glow)"
            >
              
              {/* Image Container with Fixed Uniform Aspect Ratio */}
              <div className="mb-6 relative w-full aspect-[16/10] sm:aspect-[4/3] max-h-48 overflow-hidden rounded-xl border border-white/10 flex-shrink-0 bg-black/40">
                <img
                  src={pack.image}
                  alt={pack.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100"
                />
                <button
                  onClick={() => setActiveModalPack(pack)}
                  className="absolute bottom-3 right-3 p-2.5 rounded-full bg-black/60 hover:bg-theme-primary text-white transition-all cursor-pointer backdrop-blur-md border border-white/20"
                  title="Voir les détails"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Text Container with Strictly Aligned Heights */}
              <div className="flex-1 flex flex-col justify-start">
                <h3 className="text-xl sm:text-2xl font-darker font-medium tracking-widest uppercase text-theme-text mb-2 min-h-[3.75rem] flex items-start line-clamp-2">
                  {pack.name}
                </h3>
                <p className="text-sm font-mono text-theme-primary mb-4 font-bold tracking-wider">
                  {pack.price.toLocaleString('fr-FR')} FCFA
                </p>
                <p className="text-xs text-theme-text-muted font-mono uppercase tracking-widest leading-relaxed mb-6 flex-1 min-h-[2.75rem] flex items-start line-clamp-2">
                  {pack.tagline}
                </p>
              </div>

              {/* Bottom Aligned Action Button */}
              <button
                onClick={() => onSelectPack(pack)}
                className="mt-auto w-full flex items-center justify-center gap-4 py-4 rounded-none border border-theme-border/50 hover:border-theme-primary bg-transparent hover:bg-theme-primary/20 text-theme-text font-darker font-semibold tracking-widest uppercase transition-all duration-500 cursor-pointer text-sm"
              >
                <span>Commander</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
            </GlassCard>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {activeModalPack && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md pointer-events-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg border border-theme-primary/30 rounded-2xl bg-black/90 p-10 overflow-y-auto max-h-[90vh] shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              <button
                onClick={() => setActiveModalPack(null)}
                className="absolute top-6 right-6 text-theme-text-muted hover:text-white transition-colors cursor-pointer font-mono text-xl"
              >
                ✕
              </button>

              <h3 className="text-2xl sm:text-3xl font-darker font-medium tracking-widest uppercase text-white mb-2">
                {activeModalPack.name}
              </h3>
              <p className="text-lg font-mono text-theme-primary mb-10">
                {activeModalPack.price.toLocaleString('fr-FR')} FCFA
              </p>

              <div className="space-y-6 mb-12">
                <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text-muted mb-4 font-mono">
                  // Composition
                </h4>
                <ul className="space-y-3 font-mono text-xs uppercase tracking-widest text-theme-text-muted">
                  {activeModalPack.contents.map((c, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-theme-primary opacity-50">+</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  onSelectPack(activeModalPack);
                  setActiveModalPack(null);
                }}
                className="w-full flex items-center justify-center gap-4 py-4 rounded-none border border-theme-primary bg-theme-primary/10 text-theme-text font-darker font-semibold tracking-widest uppercase hover:bg-theme-primary hover:text-white transition-all duration-500 cursor-pointer text-sm shadow-glow-primary"
              >
                <span>Valider</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
