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
  {
    name: "Le Coffret d'Alice",
    url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Le Coffret du Chapelier',
    url: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=800&q=80'
  },
  { name: 'Chapelier Fou', url: '/assets/hatter.jpg' },
  { name: 'Reine de Cœur', url: '/assets/reine coeur.png' },
  { name: 'Chat de Cheshire', url: '/assets/cat.webp' }
];

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = 'Photo',
  className = ''
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
      setError('Fichier image requis.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('Image trop lourde (max 20 Mo).');
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
      setError(err.message || 'Erreur image.');
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
      setError('Lien requis.');
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
    <div className={`space-y-2.5 font-sans ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-semibold text-theme-text-muted flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-theme-primary" />
          <span>{label}</span>
        </label>

        <div className="flex items-center gap-1 bg-theme-surface/80 p-1 rounded-xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('upload');
              setError(null);
            }}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'upload'
                ? 'bg-theme-primary text-white'
                : 'text-theme-text-muted hover:text-white'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Fichier</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('preset');
              setError(null);
            }}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'preset'
                ? 'bg-theme-primary text-white'
                : 'text-theme-text-muted hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-theme-gold" />
            <span>Galerie</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('url');
              setError(null);
            }}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'url'
                ? 'bg-theme-primary text-white'
                : 'text-theme-text-muted hover:text-white'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Lien</span>
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg+xml"
        onChange={handleFileSelect}
        className="hidden"
      />

      {activeTab === 'upload' && (
        <div>
          {value ? (
            <div className="relative rounded-2xl overflow-hidden border border-theme-primary/40 bg-black/60 group">
              <div className="aspect-video w-full relative bg-[#0d0d0d] flex items-center justify-center">
                <img
                  src={value}
                  alt="Aperçu"
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowZoomModal(true)}
                    className="p-2 rounded-xl bg-black/70 hover:bg-black/90 text-white border border-white/20 cursor-pointer"
                    title="Agrandir"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="p-2 rounded-xl bg-red-500/80 hover:bg-red-500 text-white cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="absolute bottom-0 inset-x-0 p-2.5 bg-black/75 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-semibold text-white">Prête</span>
                    {optimizationStats && (
                      <span className="text-emerald-300 font-mono text-[10px]">
                        ({formatBytes(optimizationStats.sizeBytes)})
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Changer</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] ${
                isDragging
                  ? 'border-theme-primary bg-theme-primary/10'
                  : 'border-white/20 hover:border-theme-primary/60 bg-theme-surface/30'
              }`}
            >
              {isProcessing ? (
                <div className="w-8 h-8 rounded-full border-2 border-theme-primary border-t-transparent animate-spin" />
              ) : (
                <div className="space-y-2 flex flex-col items-center">
                  <Upload className="w-6 h-6 text-theme-primary" />
                  <p className="text-xs font-semibold text-theme-text">
                    Glissez une photo ou cliquez
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'preset' && (
        <div className="p-3 rounded-2xl bg-theme-surface/40 border border-white/10">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {PRESET_GALLERY.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setOptimizationStats(null);
                  setError(null);
                }}
                className={`p-1.5 rounded-xl border text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
                  value === preset.url
                    ? 'border-theme-primary bg-theme-primary/10'
                    : 'border-white/10 bg-black/40 hover:border-white/30'
                }`}
              >
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/50 relative">
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] font-semibold truncate text-theme-text">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'url' && (
        <div className="p-3 rounded-2xl bg-theme-surface/40 border border-white/10 space-y-2.5">
          <div className="flex gap-2">
            <input
              type="url"
              value={customUrlInput}
              onChange={(e) => setCustomUrlInput(e.target.value)}
              placeholder="https://..."
              className="flex-1 px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text font-mono outline-none"
            />
            <button
              type="button"
              onClick={handleApplyCustomUrl}
              className="px-3.5 py-2 rounded-xl bg-theme-primary text-white font-semibold text-xs cursor-pointer"
            >
              Valider
            </button>
          </div>

          {value && (
            <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10">
              <img src={value} alt="Aperçu" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {showZoomModal && value && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-3xl w-full flex flex-col items-center">
            <button
              type="button"
              onClick={() => setShowZoomModal(false)}
              className="absolute -top-10 right-0 p-2 rounded-full bg-white/10 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={value}
              alt="Aperçu"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-white/20"
            />
          </div>
        </div>
      )}
    </div>
  );
};
