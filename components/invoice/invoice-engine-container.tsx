"use client";

import React, { useEffect, useState } from "react";
import { MasterOrderList } from "./master-order-list";
import { RangeResolverDashboard } from "./range-resolver-dashboard";
import { useInvoiceStore } from "@/lib/store/useInvoiceStore";
import { Toast } from "@/components/ui/toast";

const STORAGE_KEY = "nexus_vat_api_settings";

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

  /**
   * Reads UI API Credentials from localStorage to send in headers
   */
  const getApiCredentials = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to read settings for headers", e);
    }
    return {
      ideaSoftClientId: "",
      ideaSoftClientSecret: "",
      dopigoApiToken: "",
    };
  };

  useEffect(() => {
    let isMounted = true;

    if (orders.length === 0) {
      const creds = getApiCredentials();

      fetch("/api/ideasoft/orders", {
        headers: {
          "x-ideasoft-client-id": creds.ideaSoftClientId,
          "x-ideasoft-client-secret": creds.ideaSoftClientSecret,
        },
      })
        .then(async (res) => {
          const resJson = await res.json().catch(() => ({}));

          if (!res.ok || !resJson.success) {
            throw new Error(
              resJson.error ||
                "IdeaSoft Bağlantı Hatası: Lütfen API anahtarlarınızı Ayarlar sayfasından kontrol edin."
            );
          }
          return resJson;
        })
        .then((data) => {
          if (!isMounted) return;
          if (data.success && Array.isArray(data.orders)) {
            setOrders(data.orders);
          }
        })
        .catch((err: any) => {
          if (!isMounted) return;
          setApiErrorToast(
            err.message ||
              "IdeaSoft Bağlantı Hatası: Lütfen API anahtarlarınızı Ayarlar sayfasından kontrol edin."
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
          title="IdeaSoft Bağlantı Hatası"
          description={apiErrorToast}
          type="error"
          onClose={() => setApiErrorToast(null)}
        />
      )}
    </div>
  );
}
