'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import styles from '@/styles/components/DashboardOrders.module.css';

type Order = {
  id: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  total_price: number;
  created_at: string;
};

type FilterType = 'ALL' | 'PENDING' | 'STUCK' | 'PAID' | 'CANCELLED';

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('ALL');

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAction = async (orderId: string, action: 'confirm' | 'cancel') => {
    if (!window.confirm(`Yakin ingin ${action} order ini?`)) return;
    
    setActionLoading(orderId);
    try {
      const res = await fetch(`/api/dashboard/order/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId }),
      });

      const result = await res.json();
      
      if (!res.ok) {
        alert(`Error: ${result.error}`);
        console.error(`🚨 ALERT [API_ERROR]: ${action} failed for order ${orderId}`, result.error);
      } else {
        await fetchOrders();
      }
    } catch (error) {
      console.error(`🚨 ALERT [NETWORK_ERROR]: Critical failure during ${action} for order ${orderId}:`, error);
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setActionLoading(null);
    }
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const isStuck = (order: Order) => {
    if (order.status !== 'PENDING') return false;
    const orderTime = new Date(order.created_at).getTime();
    const now = new Date().getTime();
    // Anggap stuck jika PENDING lebih dari 1 Jam (60 menit)
    return (now - orderTime) > 60 * 60 * 1000; 
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'ALL') return true;
    if (filter === 'STUCK') return isStuck(order);
    return order.status === filter;
  });

  if (loading) {
    return (
      <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2 className={styles.title}>Loading Rupa Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
        <div>
          <h1 className={styles.title}>Order Management</h1>
          <p className={styles.subtitle}>Rupa Leather • Dashboard</p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {(['ALL', 'STUCK', 'PENDING', 'PAID', 'CANCELLED'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '99px',
                border: f === filter ? '1px solid var(--color-primary)' : '1px solid var(--color-border-subtle)',
                background: f === filter ? 'rgba(200, 169, 126, 0.15)' : 'transparent',
                color: f === filter ? 'var(--color-primary)' : 'var(--color-text-muted)',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                fontWeight: f === filter ? 600 : 400,
                transition: 'all 0.2s ease',
              }}
            >
              {f === 'STUCK' ? '🚨 STUCK ORDERS' : f}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tableContainer} style={{ position: 'relative' }}>
        {actionLoading && (
          <div className={styles.loadingOverlay}>
            Processing Transaction...
          </div>
        )}
        
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyState}>
                  Belum ada pesanan {filter !== 'ALL' && filter} yang sesuai.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} style={{ borderLeft: isStuck(order) ? '3px solid var(--color-error)' : 'none' }}>
                  <td>
                    <span className={styles.orderId}>{order.id.split('-')[0]}...</span>
                  </td>
                  <td>
                    {formatDate(order.created_at)}
                    {isStuck(order) && <span style={{display: 'block', color: 'var(--color-error)', fontSize: '0.7rem', marginTop: '4px'}}>⚠️ Lebih dari 1 Jam</span>}
                  </td>
                  <td className={styles.price}>{formatRupiah(order.total_price)}</td>
                  <td>
                    <span className={`${styles.badge} ${
                      order.status === 'PENDING' ? styles.badgePending :
                      order.status === 'PAID' ? styles.badgePaid :
                      styles.badgeCancelled
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button 
                        className={`${styles.btn} ${styles.btnConfirm}`}
                        onClick={() => handleAction(order.id, 'confirm')}
                        disabled={order.status !== 'PENDING' || actionLoading !== null}
                      >
                        Confirm
                      </button>
                      <button 
                        className={`${styles.btn} ${styles.btnCancel}`}
                        onClick={() => handleAction(order.id, 'cancel')}
                        disabled={order.status !== 'PENDING' || actionLoading !== null}
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
