"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  CheckSquare,
  Square,
  Filter,
  UserX,
  Search,
  AlertCircle,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useInvoiceStore } from "@/lib/store/useInvoiceStore";

export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  tckn: string;
  totalAmount: number;
  date: string;
  status: "PENDING" | "BALANCED";
}

interface MasterOrderListProps {
  orders: OrderItem[];
  selectedOrderId: string | null;
  onSelectOrder: (order: OrderItem) => void;
  selectedOrderIds: string[];
  onToggleBatchSelect: (orderId: string) => void;
  onSelectAllBatch: (orderIds: string[]) => void;
  onUpdateOrder: (updatedOrder: OrderItem) => void;
}

export function MasterOrderList({
  orders,
  selectedOrderId,
  onSelectOrder,
  selectedOrderIds,
  onToggleBatchSelect,
  onSelectAllBatch,
  onUpdateOrder,
}: MasterOrderListProps) {
  const [filterDefaultTcknOnly, setFilterDefaultTcknOnly] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editTckn, setEditTckn] = useState("");

  const isDefaultOrBlankTckn = (tckn?: string | null): boolean => {
    if (!tckn) return true;
    const trimmed = tckn.trim();
    return trimmed === "" || trimmed === "11111111111";
  };

  const filteredOrders = orders.filter((order) => {
    const matchesTcknRule = filterDefaultTcknOnly
      ? isDefaultOrBlankTckn(order.tckn)
      : true;

    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTcknRule && matchesSearch;
  });

  const excludedCount = orders.length - filteredOrders.length;
  const allFilteredSelected =
    filteredOrders.length > 0 &&
    filteredOrders.every((o) => selectedOrderIds.includes(o.id));

  const handleSelectAll = () => {
    if (allFilteredSelected) {
      onSelectAllBatch([]);
    } else {
      onSelectAllBatch(filteredOrders.map((o) => o.id));
    }
  };

  const startInlineEdit = (e: React.MouseEvent, order: OrderItem) => {
    e.stopPropagation();
    setEditingOrderId(order.id);
    setEditName(order.customerName);
    setEditTckn(order.tckn || "11111111111");
  };

  const saveInlineEdit = (e: React.MouseEvent, order: OrderItem) => {
    e.stopPropagation();
    onUpdateOrder({
      ...order,
      customerName: editName.trim() || order.customerName,
      tckn: editTckn.trim() || "11111111111",
    });
    setEditingOrderId(null);
  };

  const cancelInlineEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingOrderId(null);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="p-5 border-b border-gray-100 bg-gray-50/50 space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold tracking-tight text-gray-900 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-[#0066CC]" />
            IdeaSoft Sipariş Akışı
          </CardTitle>
          <Badge variant="outline" className="text-[11px] font-semibold">
            {filteredOrders.length} Sipariş
          </Badge>
        </div>

        {/* TCKN Strict Filter Toggle */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-gray-200 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-[#0066CC]" />
            <span className="font-semibold text-gray-700">
              Filtre: Boş veya Varsayılan TCKN (11111111111)
            </span>
          </div>
          <button
            onClick={() => setFilterDefaultTcknOnly(!filterDefaultTcknOnly)}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all text-[11px] cursor-pointer hover:scale-[1.02] active:scale-95 ${
              filterDefaultTcknOnly
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            {filterDefaultTcknOnly ? "Aktif (Süzülüyor)" : "Tümü Gösteriliyor"}
          </button>
        </div>

        {excludedCount > 0 && filterDefaultTcknOnly && (
          <p className="text-[11px] text-amber-700 flex items-center gap-1 font-medium">
            <UserX className="h-3 w-3 shrink-0" />
            Özel TCKN giren {excludedCount} kurumsal sipariş süzüldü.
          </p>
        )}

        {/* Search & Batch Select Header */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-[#0066CC] transition-colors cursor-pointer"
          >
            {allFilteredSelected ? (
              <CheckSquare className="h-4 w-4 text-[#0066CC]" />
            ) : (
              <Square className="h-4 w-4 text-gray-400" />
            )}
            Toplu Seçim ({selectedOrderIds.length})
          </button>

          <div className="relative flex-1 max-w-[180px]">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 flex-1 overflow-y-auto space-y-2 max-h-[620px]">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 space-y-2 text-gray-400">
            <AlertCircle className="h-8 w-8 mx-auto opacity-50" />
            <p className="text-xs font-semibold">İşlenecek varsayılan sipariş bulunamadı.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isSelectedForDetail = selectedOrderId === order.id;
            const isCheckedBatch = selectedOrderIds.includes(order.id);
            const isEditing = editingOrderId === order.id;

            return (
              <div
                key={order.id}
                onClick={() => onSelectOrder(order)}
                className={`group relative p-3.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                  isSelectedForDetail
                    ? "bg-blue-50/80 border-blue-300 shadow-xs"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBatchSelect(order.id);
                      }}
                      className="text-gray-400 hover:text-[#0066CC] transition-colors cursor-pointer"
                    >
                      {isCheckedBatch ? (
                        <CheckSquare className="h-4 w-4 text-[#0066CC]" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-gray-900">
                          {order.orderNumber}
                        </span>
                        {order.status === "BALANCED" && (
                          <Badge variant="success" className="text-[10px] py-0 px-1.5">
                            Dengelendi
                          </Badge>
                        )}
                      </div>

                      {/* Inline Customer Edit Mode */}
                      {isEditing ? (
                        <div className="flex items-center gap-1.5 mt-1.5" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Müşteri Adı"
                            className="px-2 py-1 rounded bg-white border border-blue-300 text-xs font-medium text-gray-900 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={editTckn}
                            onChange={(e) => setEditTckn(e.target.value)}
                            placeholder="TCKN"
                            className="w-24 px-2 py-1 rounded bg-white border border-blue-300 text-xs font-mono text-gray-900 focus:outline-none"
                          />
                          <button
                            onClick={(e) => saveInlineEdit(e, order)}
                            className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                          <button
                            onClick={cancelInlineEdit}
                            className="p-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <p className="text-xs text-gray-600 font-medium truncate">
                            {order.customerName}
                          </p>
                          <button
                            onClick={(e) => startInlineEdit(e, order)}
                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-[#0066CC] p-0.5 transition-opacity cursor-pointer"
                            title="Müşteri Bilgilerini Düzenle"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-sm text-gray-900">
                      ₺{order.totalAmount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                    </span>
                    <p className="text-[10px] font-mono text-gray-400 mt-0.5">
                      TCKN: {order.tckn || "Boş (11111111111)"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
