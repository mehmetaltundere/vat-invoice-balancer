"use client";

import React, { useState, useEffect } from "react";
import { MasterOrderList, OrderItem } from "./master-order-list";
import { RangeResolverDashboard } from "./range-resolver-dashboard";

export function InvoiceEngineContainer() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Fetch orders from real server-side API route (/api/ideasoft/orders)
  useEffect(() => {
    let isMounted = true;
    setIsLoadingOrders(true);

    fetch("/api/ideasoft/orders")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
          if (data.orders.length > 0) {
            setSelectedOrder(data.orders[0]);
            setSelectedOrderIds([data.orders[0].id]);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to fetch IdeaSoft orders", err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingOrders(false);
      });
  }, []);

  const handleToggleBatchSelect = (orderId: string) => {
    if (selectedOrderIds.includes(orderId)) {
      setSelectedOrderIds(selectedOrderIds.filter((id) => id !== orderId));
    } else {
      setSelectedOrderIds([...selectedOrderIds, orderId]);
    }
  };

  const handleSelectAllBatch = (orderIds: string[]) => {
    setSelectedOrderIds(orderIds);
  };

  const handleUpdateOrder = (updatedOrder: OrderItem) => {
    setOrders(
      orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
    if (selectedOrder?.id === updatedOrder.id) {
      setSelectedOrder(updatedOrder);
    }
  };

  const handleBatchCompleted = (completedIds: string[]) => {
    // Mark completed orders as BALANCED
    setOrders(
      orders.map((o) =>
        completedIds.includes(o.id) ? { ...o, status: "BALANCED" } : o
      )
    );
    // Uncheck completed orders
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
          onToggleBatchSelect={handleToggleBatchSelect}
          onSelectAllBatch={handleSelectAllBatch}
          onUpdateOrder={handleUpdateOrder}
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
    </div>
  );
}
