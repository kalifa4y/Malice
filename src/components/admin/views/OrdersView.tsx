import React, { useState } from 'react';
import { Order, OrderStatus } from '../../../types';
import {
  Search,
  Phone,
  Clock,
  CheckCircle2,
  Package,
  Truck,
  Sparkles,
  XCircle
} from 'lucide-react';

interface OrdersViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const STATUS_FILTERS: { id: string; label: string }[] = [
  { id: 'all', label: 'Toutes' },
  { id: 'pending_payment', label: 'À payer' },
  { id: 'confirmed', label: 'Payées' },
  { id: 'shipping', label: 'En route' },
  { id: 'delivered', label: 'Livrées' }
];

export const OrdersView: React.FC<OrdersViewProps> = ({ orders, onUpdateOrderStatus }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = orders.filter((o) => {
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
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Clock className="w-3 h-3" />
            <span>À payer</span>
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3 h-3" />
            <span>Payée</span>
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40">
            <Package className="w-3 h-3" />
            <span>Préparation</span>
          </span>
        );
      case 'shipping':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/40">
            <Truck className="w-3 h-3" />
            <span>En route</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-500/20 text-green-300 border border-green-500/40">
            <Sparkles className="w-3 h-3" />
            <span>Livrée</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-500/20 text-red-300 border border-red-500/40">
            <XCircle className="w-3 h-3" />
            <span>Annulée</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-3.5 rounded-2xl glass-panel">
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-theme-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-theme-bg/60 border border-white/15 text-xs sm:text-sm text-theme-text focus:outline-none focus:border-theme-gold"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {STATUS_FILTERS.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                statusFilter === st.id
                  ? 'bg-theme-primary text-white'
                  : 'bg-white/5 border border-white/10 text-theme-text-muted hover:text-theme-text'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-theme-surface/80 text-theme-text-muted uppercase text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="p-3.5">N°</th>
                <th className="p-3.5">Client</th>
                <th className="p-3.5">Coffret</th>
                <th className="p-3.5">Adresse</th>
                <th className="p-3.5">Total</th>
                <th className="p-3.5">Statut</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-xs text-theme-text-muted">
                    Aucune commande.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5 font-mono text-xs font-bold text-theme-gold">
                      {order.orderNumber}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-theme-text">{order.customerName}</div>
                      <div className="text-theme-text-muted flex items-center gap-1 mt-0.5 text-xs">
                        <Phone className="w-3 h-3 text-theme-gold" />
                        <a
                          href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono hover:text-emerald-400 hover:underline"
                        >
                          {order.customerPhone}
                        </a>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-theme-text">{order.packName}</div>
                      <div className="text-[11px] text-theme-text-muted capitalize">
                        {order.paymentMethod.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-theme-text">{order.deliveryZoneName}</div>
                      <div
                        className="text-[11px] text-theme-text-muted truncate max-w-[160px]"
                        title={order.deliveryAddress}
                      >
                        {order.deliveryAddress}
                      </div>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-theme-gold">
                      {order.totalAmount.toLocaleString('fr-FR')} F
                    </td>
                    <td className="p-3.5">{statusBadge(order.status)}</td>
                    <td className="p-3.5 text-right">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          onUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-theme-surface border border-white/15 text-xs text-theme-text focus:outline-none focus:border-theme-gold cursor-pointer"
                      >
                        <option value="pending_payment">À payer</option>
                        <option value="confirmed">Payée</option>
                        <option value="preparing">Préparation</option>
                        <option value="shipping">En route</option>
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
