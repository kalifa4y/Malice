import React, { useState } from 'react';
import { Pack } from '../../../types';
import { ImageUpload } from '../ui/ImageUpload';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X,
  Package,
  Info,
  Image as ImageIcon,
  List,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface PacksManagerProps {
  packs: Pack[];
  onSavePack: (pack: Pack) => void;
  onDeletePack: (packId: string) => void;
}

export const PacksManager: React.FC<PacksManagerProps> = ({ packs, onSavePack, onDeletePack }) => {
  const [editingPack, setEditingPack] = useState<Pack | null>(null);
  const [step, setStep] = useState(1);

  const handleCreateNew = () => {
    setEditingPack({
      id: `pack-${Date.now()}`,
      name: '',
      tagline: '',
      slug: 'normal',
      price: 0,
      description: '',
      image: '',
      contents: [],
      features: [],
      isActive: true,
      badge: ''
    });
    setStep(1);
  };

  const handleEdit = (pack: Pack) => {
    setEditingPack({ ...pack });
    setStep(1);
  };

  const updateEditingPack = (field: keyof Pack, value: any) => {
    if (editingPack) {
      setEditingPack({ ...editingPack, [field]: value });
    }
  };

  const handleArrayChange = (field: 'contents' | 'features', index: number, value: string) => {
    if (editingPack) {
      const newArray = [...editingPack[field]];
      newArray[index] = value;
      updateEditingPack(field, newArray);
    }
  };

  const addArrayItem = (field: 'contents' | 'features') => {
    if (editingPack) {
      updateEditingPack(field, [...editingPack[field], '']);
    }
  };

  const removeArrayItem = (field: 'contents' | 'features', index: number) => {
    if (editingPack) {
      const newArray = [...editingPack[field]];
      newArray.splice(index, 1);
      updateEditingPack(field, newArray);
    }
  };

  const handleSave = () => {
    if (editingPack) {
      onSavePack(editingPack);
      setEditingPack(null);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const StepIndicator = ({ num, active }: { num: number; active: boolean }) => (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
      active 
        ? 'bg-theme-primary text-white shadow-glow-primary scale-110' 
        : 'bg-theme-surface border border-theme-border text-theme-text-muted'
    }`}>
      {num}
    </div>
  );

  return (
    <div className="space-y-6 font-google-sans">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-darker-grotesque">Gestion des Coffrets</h2>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 rounded-xl bg-theme-primary text-white font-bold text-sm shadow-glow-primary hover:brightness-110 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouveau Coffret
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packs.map(pack => (
          <div key={pack.id} className="p-6 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl flex flex-col group hover:border-theme-primary/50 transition-colors shadow-2xl">
            <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden mb-4 bg-theme-surface relative flex-shrink-0 border border-white/10">
              {pack.image ? (
                <img src={pack.image} alt={pack.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-theme-text-muted">
                  <Package className="w-8 h-8 opacity-50" />
                </div>
              )}
              {!pack.isActive && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">Inactif</span>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold font-darker-grotesque text-lg leading-tight">{pack.name}</h3>
                  <p className="text-xs text-theme-text-muted line-clamp-1">{pack.tagline}</p>
                </div>
                <div className="text-theme-gold font-mono font-bold">{pack.price.toLocaleString('fr-FR')} F</div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-theme-border flex items-center justify-between">
              <div className="text-xs text-theme-text-muted">
                {pack.slug === 'premium' ? '👑 Premium' : pack.slug === 'seasonal' ? '🎄 Saisonnier' : '📦 Normal'}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(pack)}
                  className="p-2 rounded-lg hover:bg-theme-surface text-theme-text-muted hover:text-theme-primary transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Voulez-vous vraiment supprimer ce coffret ?')) {
                      onDeletePack(pack.id);
                    }
                  }}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-theme-text-muted hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingPack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0a0a0a] w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#0a0a0a]">
              <h3 className="text-xl font-bold font-darker-grotesque text-white">
                {packs.find(p => p.id === editingPack.id) ? 'Modifier le Coffret' : 'Nouveau Coffret'}
              </h3>
              <button onClick={() => setEditingPack(null)} className="p-2 rounded-xl hover:bg-theme-surface cursor-pointer transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper */}
            <div className="px-8 pt-6 pb-2">
              <div className="flex items-center justify-between relative px-2 mb-4">
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] bg-theme-surface -z-10">
                  <div 
                    className="h-full bg-theme-primary transition-all duration-300"
                    style={{ width: `${((step - 1) / 2) * 100}%` }}
                  />
                </div>
                <StepIndicator num={1} active={step >= 1} />
                <StepIndicator num={2} active={step >= 2} />
                <StepIndicator num={3} active={step >= 3} />
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 pt-2">
              
              {/* Step 1 */}
              <div className={step === 1 ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden'}>
                <h4 className="text-lg font-bold font-darker-grotesque mb-6 flex items-center gap-2">
                  <Info className="w-5 h-5 text-theme-primary" />
                  Informations de base
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-theme-text-muted mb-1.5">Nom du coffret</label>
                    <input
                      type="text"
                      value={editingPack.name}
                      onChange={e => updateEditingPack('name', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme-border text-sm focus:border-theme-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-theme-text-muted mb-1.5">Tagline (Court)</label>
                    <input
                      type="text"
                      value={editingPack.tagline}
                      onChange={e => updateEditingPack('tagline', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme-border text-sm focus:border-theme-primary outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-theme-text-muted mb-1.5">Prix (FCFA)</label>
                      <input
                        type="number"
                        value={editingPack.price}
                        onChange={e => updateEditingPack('price', Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme-border text-sm font-mono focus:border-theme-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-theme-text-muted mb-1.5">Slug (Type)</label>
                      <select
                        value={editingPack.slug}
                        onChange={e => updateEditingPack('slug', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme-border text-sm focus:border-theme-primary outline-none"
                      >
                        <option value="normal">Normal</option>
                        <option value="premium">Premium</option>
                        <option value="seasonal">Saisonnier</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-theme-text-muted mb-1.5">Badge (Optionnel)</label>
                    <input
                      type="text"
                      value={editingPack.badge || ''}
                      onChange={e => updateEditingPack('badge', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme-border text-sm focus:border-theme-primary outline-none"
                      placeholder="Ex: Best-Seller"
                    />
                  </div>
                  <div className="pt-2">
                    <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-theme-border/60 bg-theme-surface/20">
                      <input
                        type="checkbox"
                        checked={editingPack.isActive}
                        onChange={e => updateEditingPack('isActive', e.target.checked)}
                        className="w-5 h-5 rounded border-theme-border text-theme-primary focus:ring-theme-primary focus:ring-offset-theme-bg"
                      />
                      <span className="text-sm font-bold">Coffret Actif (Visible sur le site)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className={step === 2 ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden'}>
                <h4 className="text-lg font-bold font-darker-grotesque mb-6 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-theme-primary" />
                  Visuels & Description
                </h4>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-theme-text-muted mb-1.5">Description complète</label>
                    <textarea
                      value={editingPack.description}
                      onChange={e => updateEditingPack('description', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme-border text-sm focus:border-theme-primary outline-none resize-none"
                      placeholder="Décrivez les merveilles et délices de ce coffret..."
                    />
                  </div>
                  <div>
                    <ImageUpload
                      value={editingPack.image}
                      onChange={url => updateEditingPack('image', url)}
                      label="Image Principale du Coffret"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className={step === 3 ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden'}>
                <h4 className="text-lg font-bold font-darker-grotesque mb-6 flex items-center gap-2">
                  <List className="w-5 h-5 text-theme-primary" />
                  Détails & Contenu
                </h4>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-bold text-theme-text-muted">Ingrédients / Contenu</label>
                      <button onClick={() => addArrayItem('contents')} className="text-xs text-theme-primary hover:underline font-bold">+ Ajouter</button>
                    </div>
                    <div className="space-y-2">
                      {editingPack.contents.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={e => handleArrayChange('contents', idx, e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-sm focus:border-theme-primary outline-none"
                            placeholder="Ex: Sablés artisanaux"
                          />
                          <button onClick={() => removeArrayItem('contents', idx)} className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-theme-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-bold text-theme-text-muted">Caractéristiques (Features)</label>
                      <button onClick={() => addArrayItem('features')} className="text-xs text-theme-primary hover:underline font-bold">+ Ajouter</button>
                    </div>
                    <div className="space-y-2">
                      {editingPack.features.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={e => handleArrayChange('features', idx, e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-sm focus:border-theme-primary outline-none"
                            placeholder="Ex: Coffret rigide local"
                          />
                          <button onClick={() => removeArrayItem('features', idx)} className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-theme-border bg-theme-surface/50">
              <div className="flex gap-3">
                {step > 1 && (
                  <button
                    onClick={prevStep}
                    className="p-4 rounded-xl bg-theme-surface border border-theme-border hover:bg-theme-surface/80 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-theme-text" />
                  </button>
                )}
                
                {step < 3 ? (
                  <button
                    onClick={nextStep}
                    className="flex-1 py-4 rounded-xl bg-theme-primary text-white font-bold text-sm shadow-glow-primary hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Continuer</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="flex-1 py-4 rounded-xl font-bold text-white text-sm shadow-glow-primary hover:brightness-110 transition-all bg-theme-primary"
                  >
                    Enregistrer le coffret
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
