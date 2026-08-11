"use client";

import React, { useEffect, useState } from "react";
import { MasterOrderList } from "./master-order-list";
import { RangeResolverDashboard } from "./range-resolver-dashboard";
import { useInvoiceStore } from "@/lib/store/useInvoiceStore";
import { Toast } from "@/components/ui/toast";

export function InvoiceEngineContainer() {
  const {
    orders,
    setOrders,
    selectedOrder,
    setSelectedOrder,
    selectedOrderIds,
    setSelectedOrderIds,
    toggleBatchSelect,
    updateOrder,
  } = useInvoiceStore();

  const [apiErrorToast, setApiErrorToast] = useState<string | null>(null);

  // Fetch orders from server-side API route (/api/ideasoft/orders)
  useEffect(() => {
    let isMounted = true;

    if (orders.length === 0) {
      fetch("/api/ideasoft/orders")
        .then(async (res) => {
          if (res.status === 401) {
            const errJson = await res.json();
            throw new Error(
              errJson.error ||
                "Bağlantı Hatası: IdeaSoft API anahtarınız geçersiz veya eksik. Lütfen Ayarlar sayfasından kontrol edin."
            );
          }
          return res.json();
        })
        .then((data) => {
          if (!isMounted) return;
          if (data.success && Array.isArray(data.orders)) {
            setOrders(data.orders);
          } else if (data.error) {
            setApiErrorToast(data.error);
          }
        })
        .catch((err: any) => {
          if (!isMounted) return;
          setApiErrorToast(
            err.message ||
              "Bağlantı Hatası: IdeaSoft API anahtarınız geçersiz veya eksik. Lütfen Ayarlar sayfasından kontrol edin."
          );
        });
    }
  }, [orders.length, setOrders]);

  const handleSelectAllBatch = (orderIds: string[]) => {
    setSelectedOrderIds(orderIds);
  };

  const handleBatchCompleted = (completedIds: string[]) => {
    setOrders(
      orders.map((o) =>
        completedIds.includes(o.id) ? { ...o, status: "BALANCED" } : o
      )
    );
    setSelectedOrderIds(
      selectedOrderIds.filter((id) => !completedIds.includes(id))
    );
  };

  const selectedBatchOrders = orders.filter((o) =>
    selectedOrderIds.includes(o.id)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Pane (Master): Order List */}
      <div className="lg:col-span-4 h-full">
        <MasterOrderList
          orders={orders}
          selectedOrderId={selectedOrder?.id || null}
          onSelectOrder={(order) => setSelectedOrder(order)}
          selectedOrderIds={selectedOrderIds}
          onToggleBatchSelect={toggleBatchSelect}
          onSelectAllBatch={handleSelectAllBatch}
          onUpdateOrder={updateOrder}
        />
      </div>

      {/* Right Pane (Detail / Action): Range Resolver Dashboard */}
      <div className="lg:col-span-8">
        <RangeResolverDashboard
          selectedOrder={selectedOrder}
          batchOrders={selectedBatchOrders}
          onBatchCompleted={handleBatchCompleted}
        />
      </div>

      {apiErrorToast && (
        <Toast
          title="API Bağlantı Uyarısı"
          description={apiErrorToast}
          type="error"
          onClose={() => setApiErrorToast(null)}
        />
      )}
    </div>
  );
}
