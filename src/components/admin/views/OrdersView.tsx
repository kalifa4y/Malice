import React, { useState } from 'react';
import { Order, OrderStatus } from '../../../types';
import { Search, Phone } from 'lucide-react';

interface OrdersViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ orders, onUpdateOrderStatus }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending_payment':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">⏳ En attente paiement</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">✓ Payée / Confirmée</span>;
      case 'preparing':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">📦 En préparation</span>;
      case 'shipping':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">🛵 En livraison</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-500/20 text-green-300 border border-green-500/40">✨ Livrée</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/20 text-red-300 border border-red-500/40">✕ Annulée</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-lg">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-theme-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher par client, tél, n°..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-theme-bg/50 border border-theme-border text-sm text-theme-text focus:outline-none focus:border-theme-primary transition-colors font-google-sans"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 font-google-sans">
          {['all', 'pending_payment', 'confirmed', 'shipping', 'delivered'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                statusFilter === st
                  ? 'bg-theme-primary text-white shadow-glow-primary scale-105'
                  : 'bg-white/5 border border-white/10 text-theme-text-muted hover:text-theme-text hover:bg-theme-surface/50'
              }`}
            >
              {st === 'all' ? 'Toutes' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-google-sans">
            <thead className="bg-theme-surface/80 text-theme-text-muted uppercase text-[10px] tracking-wider border-b border-theme-border">
              <tr>
                <th className="p-4">N° Commande</th>
                <th className="p-4">Client & Contact</th>
                <th className="p-4">Coffret</th>
                <th className="p-4">Lieu & Frais</th>
                <th className="p-4">Total</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-border/50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-theme-text-muted">
                    Aucune commande trouvée.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-theme-surface/40 transition-colors group">
                    <td className="p-4 font-mono font-bold text-theme-primary">
                      {order.orderNumber}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-theme-text">{order.customerName}</div>
                      <div className="text-theme-text-muted flex items-center gap-1 mt-0.5 text-xs">
                        <Phone className="w-3 h-3 text-theme-primary opacity-70" />
                        <span>{order.customerPhone}</span>
                        <a
                          href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 hover:underline ml-1"
                          title="Ouvrir WhatsApp"
                        >
                          (WhatsApp)
                        </a>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-theme-text">{order.packName}</div>
                      <div className="text-[11px] text-theme-text-muted capitalize">{order.paymentMethod.replace('_', ' ')}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-theme-text">{order.deliveryZoneName}</div>
                      <div className="text-[11px] text-theme-text-muted truncate max-w-[160px]" title={order.deliveryAddress}>
                        {order.deliveryAddress}
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-theme-gold">
                      {order.totalAmount.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="p-4">
                      {statusBadge(order.status)}
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={order.status}
                        onChange={e => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="px-3 py-2 rounded-lg bg-theme-surface border border-theme-border text-xs text-theme-text focus:outline-none focus:border-theme-primary cursor-pointer hover:bg-theme-surface/80 transition-colors"
                      >
                        <option value="pending_payment">En attente paiement</option>
                        <option value="confirmed">Confirmée / Payée</option>
                        <option value="preparing">En préparation</option>
                        <option value="shipping">En livraison</option>
                        <option value="delivered">Livrée</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
