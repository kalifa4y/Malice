import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Link as LinkIcon, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Maximize2, 
  X,
  RefreshCw
} from 'lucide-react';
import { optimizeImage, formatBytes, OptimizedImageResult } from '../../../lib/imageOptimization';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

const PRESET_GALLERY = [
  { name: 'Le Coffret Alice (Signature)', url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80' },
  { name: 'Le Coffret Royal du Chapelier', url: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=800&q=80' },
  { name: 'Le Chapelier Fou (Art)', url: '/assets/hatter.jpg' },
  { name: 'La Reine de Cœur (Art)', url: '/assets/reine coeur.png' },
  { name: 'Le Chat du Cheshire (Art)', url: '/assets/cat.webp' },
];

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = "Visuel du Coffret",
  className = ""
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimizationStats, setOptimizationStats] = useState<OptimizedImageResult | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showZoomModal, setShowZoomModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner un fichier image valide (PNG, JPG, WEBP, etc.).');
      return;
    }

    // Limit original file size to 20MB
    if (file.size > 20 * 1024 * 1024) {
      setError('L\'image est trop volumineuse (max 20 Mo).');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const result = await optimizeImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.85,
        format: 'image/webp'
      });

      setOptimizationStats(result);
      onChange(result.dataUrl);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du traitement et de l\'optimisation de l\'image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileProcess(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileProcess(files[0]);
    }
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) {
      setError('Veuillez renseigner une URL d\'image.');
      return;
    }
    setError(null);
    setOptimizationStats(null);
    onChange(customUrlInput.trim());
  };

  const handleClearImage = () => {
    onChange('');
    setOptimizationStats(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-3 font-google-sans ${className}`}>
      {/* Label and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs font-bold text-theme-text-muted flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-theme-primary" />
          <span>{label}</span>
        </label>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 bg-theme-surface/80 p-1 rounded-xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => { setActiveTab('upload'); setError(null); }}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'upload' 
                ? 'bg-theme-primary text-white shadow-glow-primary' 
                : 'text-theme-text-muted hover:text-white'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Upload Fichier</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('preset'); setError(null); }}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'preset' 
                ? 'bg-theme-primary text-white shadow-glow-primary' 
                : 'text-theme-text-muted hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-theme-gold" />
            <span>Galerie</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('url'); setError(null); }}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'url' 
                ? 'bg-theme-primary text-white shadow-glow-primary' 
                : 'text-theme-text-muted hover:text-white'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Lien Web</span>
          </button>
        </div>
      </div>

      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg+xml"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Active Mode View */}
      {activeTab === 'upload' && (
        <div>
          {value ? (
            /* Image Preview Card */
            <div className="relative rounded-2xl overflow-hidden border border-theme-primary/40 bg-black/60 shadow-2xl group">
              <div className="aspect-video w-full relative bg-[#0d0d0d] flex items-center justify-center">
                <img 
                  src={value} 
                  alt="Aperçu du coffret" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                
                {/* Floating Top-Right Overlay Actions */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowZoomModal(true)}
                    className="p-2 rounded-xl bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 shadow-lg transition-colors cursor-pointer"
                    title="Agrandir"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="p-2 rounded-xl bg-red-500/80 hover:bg-red-500 text-white backdrop-blur-md border border-red-400/30 shadow-lg transition-colors cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Floating Bottom Info Bar */}
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-[2px] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white">Image prête</span>
                    {optimizationStats && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/40">
                        {formatBytes(optimizationStats.sizeBytes)} ({optimizationStats.compressionRatio > 0 ? `-${optimizationStats.compressionRatio}%` : 'WebP'})
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md border border-white/20"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Remplacer</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Drag & Drop Upload Zone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center min-h-[190px] ${
                isDragging
                  ? 'border-theme-primary bg-theme-primary/10 shadow-glow-primary scale-[1.01]'
                  : 'border-white/20 hover:border-theme-primary/60 bg-theme-surface/30 hover:bg-theme-surface/60'
              }`}
            >
              {isProcessing ? (
                <div className="space-y-3 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border-2 border-theme-primary border-t-transparent animate-spin" />
                  <p className="text-sm font-bold text-theme-primary animate-pulse">
                    Optimisation & compression en cours...
                  </p>
                  <p className="text-xs text-theme-text-muted">Conversion haute fidélité pour Bamako</p>
                </div>
              ) : (
                <div className="space-y-3 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-theme-surface to-black border border-white/10 flex items-center justify-center text-theme-primary shadow-glow-primary group-hover:scale-110 transition-transform">
                    <Upload className="w-7 h-7" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-theme-text">
                      Glissez-déposez votre image ici
                    </p>
                    <p className="text-xs text-theme-text-muted mt-1">
                      ou <span className="text-theme-primary font-bold underline">cliquez pour parcourir</span> vos fichiers
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-theme-text-muted font-mono bg-black/40 px-3 py-1 rounded-full border border-white/5">
                    <span>PNG, JPG, WEBP, GIF</span>
                    <span>•</span>
                    <span className="text-emerald-400">Compression auto WebP</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Preset Gallery View */}
      {activeTab === 'preset' && (
        <div className="p-4 rounded-2xl bg-theme-surface/40 border border-white/10 space-y-3">
          <p className="text-xs text-theme-text-muted">Sélectionnez un visuel thématique Maison Alice :</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PRESET_GALLERY.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setOptimizationStats(null);
                  setError(null);
                }}
                className={`p-2 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer group ${
                  value === preset.url
                    ? 'border-theme-primary bg-theme-primary/10 shadow-glow-primary'
                    : 'border-white/10 bg-black/40 hover:border-white/30'
                }`}
              >
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/50 relative">
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  {value === preset.url && (
                    <div className="absolute inset-0 bg-theme-primary/30 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white drop-shadow" />
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-bold truncate text-theme-text">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom URL View */}
      {activeTab === 'url' && (
        <div className="p-4 rounded-2xl bg-theme-surface/40 border border-white/10 space-y-3">
          <div>
            <label className="block text-xs font-bold text-theme-text-muted mb-1.5">Lien URL de l'image</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={customUrlInput}
                onChange={e => setCustomUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-theme-bg border border-theme-border text-sm text-theme-text font-mono focus:border-theme-primary outline-none"
              />
              <button
                type="button"
                onClick={handleApplyCustomUrl}
                className="px-4 py-2.5 rounded-xl bg-theme-primary text-white font-bold text-xs shadow-glow-primary hover:brightness-110 transition-colors cursor-pointer whitespace-nowrap"
              >
                Appliquer
              </button>
            </div>
          </div>

          {value && (
            <div className="mt-3 aspect-video w-full rounded-xl overflow-hidden border border-white/10 relative">
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )}

      {/* Error Message Display */}
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300 animate-in fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Zoom Modal */}
      {showZoomModal && value && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              type="button"
              onClick={() => setShowZoomModal(false)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={value} 
              alt="Grand format" 
              className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-white/20 shadow-2xl" 
            />
          </div>
        </div>
      )}
    </div>
  );
};
