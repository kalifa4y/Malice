import React from 'react';
import { DeliveryZone } from '../../../types';

interface ZonesManagerProps {
  zones: DeliveryZone[];
  onSaveZones: (zones: DeliveryZone[]) => void;
}

export const ZonesManager: React.FC<ZonesManagerProps> = ({ zones, onSaveZones }) => {
  return (
    <div className="space-y-6 font-google-sans">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-darker-grotesque">Zones de Livraison</h2>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-theme-surface/80 text-theme-text-muted uppercase text-[10px] tracking-wider border-b border-theme-border">
              <tr>
                <th className="p-4">Quartier / Commune à Bamako</th>
                <th className="p-4">Rive</th>
                <th className="p-4">Frais de livraison (FCFA)</th>
                <th className="p-4">Délai estimé (heures)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-border/50">
              {zones.map((zone, idx) => (
                <tr key={zone.id} className="hover:bg-theme-surface/40 transition-colors">
                  <td className="p-4 font-bold text-theme-text">
                    {zone.name}
                  </td>
                  <td className="p-4 capitalize text-theme-text-muted">
                    {zone.riverSide.replace('_', ' ')}
                  </td>
                  <td className="p-4">
                    <input
                      type="number"
                      value={zone.fee}
                      onChange={e => {
                        const updated = [...zones];
                        updated[idx].fee = Number(e.target.value);
                        onSaveZones(updated);
                      }}
                      className="w-32 px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-sm font-mono font-bold text-theme-primary focus:border-theme-primary outline-none transition-colors"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="number"
                      value={zone.estimatedHours}
                      onChange={e => {
                        const updated = [...zones];
                        updated[idx].estimatedHours = Number(e.target.value);
                        onSaveZones(updated);
                      }}
                      className="w-24 px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-sm focus:border-theme-primary outline-none transition-colors"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
