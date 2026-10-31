import React from 'react';
import { DeliveryZone } from '../../../types';

interface ZonesManagerProps {
  zones: DeliveryZone[];
  onSaveZones: (zones: DeliveryZone[]) => void;
}

export const ZonesManager: React.FC<ZonesManagerProps> = ({ zones, onSaveZones }) => {
  return (
    <div className="space-y-4 font-sans">
      <h2 className="font-serif text-2xl font-bold">Quartiers de Bamako</h2>

      <div className="rounded-2xl glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-theme-surface/80 text-theme-text-muted uppercase text-[10px] tracking-wider border-b border-theme-border">
              <tr>
                <th className="p-3.5">Quartier</th>
                <th className="p-3.5">Rive</th>
                <th className="p-3.5">Tarif (FCFA)</th>
                <th className="p-3.5">Délai (h)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-border/50">
              {zones.map((zone, idx) => (
                <tr key={zone.id} className="hover:bg-theme-surface/40 transition-colors">
                  <td className="p-3.5 font-semibold text-theme-text">{zone.name}</td>
                  <td className="p-3.5 capitalize text-xs text-theme-text-muted">
                    {zone.riverSide.replace('_', ' ')}
                  </td>
                  <td className="p-3.5">
                    <input
                      type="number"
                      value={zone.fee}
                      onChange={(e) => {
                        const updated = [...zones];
                        updated[idx].fee = Number(e.target.value);
                        onSaveZones(updated);
                      }}
                      className="w-28 px-3 py-1.5 rounded-xl bg-theme-surface border border-theme-border text-sm font-mono font-bold text-theme-gold focus:border-theme-gold outline-none"
                    />
                  </td>
                  <td className="p-3.5">
                    <input
                      type="number"
                      value={zone.estimatedHours}
                      onChange={(e) => {
                        const updated = [...zones];
                        updated[idx].estimatedHours = Number(e.target.value);
                        onSaveZones(updated);
                      }}
                      className="w-20 px-3 py-1.5 rounded-xl bg-theme-surface border border-theme-border text-sm focus:border-theme-gold outline-none"
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
