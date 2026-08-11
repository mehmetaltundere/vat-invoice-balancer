"use client";

import React, { useState } from "react";
import { MasterOrderList, OrderItem } from "./master-order-list";
import { RangeResolverDashboard } from "./range-resolver-dashboard";

const sampleIdeaSoftOrders: OrderItem[] = [
  {
    id: "ord_1",
    orderNumber: "IS-2026-8801",
    customerName: "Ahmet Yılmaz",
    tckn: "11111111111", // Default TCKN (Included in filter)
    totalAmount: 2700.0,
    date: "10 dk önce",
    status: "PENDING",
  },
  {
    id: "ord_2",
    orderNumber: "IS-2026-8802",
    customerName: "Mehmet Demir",
    tckn: "11111111111", // Default TCKN (Included in filter)
    totalAmount: 8200.5,
    date: "42 dk önce",
    status: "PENDING",
  },
  {
    id: "ord_3",
    orderNumber: "IS-2026-8803",
    customerName: "Ayşe Kaya (Kurumsal)",
    tckn: "99887766551", // Specific TCKN (Filtered out by default rule)
    totalAmount: 23100.0,
    date: "2 saat önce",
    status: "BALANCED",
  },
  {
    id: "ord_4",
    orderNumber: "IS-2026-8804",
    customerName: "Zeynep Arslan",
    tckn: "11111111111", // Default TCKN (Included in filter)
    totalAmount: 5400.0,
    date: "3 saat önce",
    status: "PENDING",
  },
  {
    id: "ord_5",
    orderNumber: "IS-2026-8805",
    customerName: "Mustafa Çelik (Şahıs)",
    tckn: "34829103948", // Specific TCKN (Filtered out by default rule)
    totalAmount: 11250.0,
    date: "4 saat önce",
    status: "BALANCED",
  },
  {
    id: "ord_6",
    orderNumber: "IS-2026-8806",
    customerName: "Elif Öztürk",
    tckn: "11111111111", // Default TCKN (Included in filter)
    totalAmount: 3950.0,
    date: "5 saat önce",
    status: "PENDING",
  },
];

export function InvoiceEngineContainer() {
  const [orders] = useState<OrderItem[]>(sampleIdeaSoftOrders);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(
    sampleIdeaSoftOrders[0] // Select first order by default
  );

  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([
    sampleIdeaSoftOrders[0].id,
  ]);

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
        />
      </div>

      {/* Right Pane (Detail / Action): Range Resolver Dashboard */}
      <div className="lg:col-span-8">
        <RangeResolverDashboard selectedOrder={selectedOrder} />
      </div>
    </div>
  );
}
